import mongoose, { Connection, createConnection } from 'mongoose';
import { MONGOOSE_MODELS } from '../models';
import { Logger } from '@nestjs/common';
import { MongoModelsType } from '../db.types';

export class MongoService {
  logger = new Logger(MongoService.name);
  private connection: Connection;
  public readonly models: MongoModelsType = {} as MongoModelsType;

  constructor(private readonly uri: string) {
    this.connect(uri);
  }
  async connect(uri: string) {
    if (!this.connection) {
      this.connection = await this.initiateConnection(uri);
      await this.setupModels();
    } else {
      this.logger.log(
        `Already connected to mongoose!! ${this.connection.host}`,
      );
    }
  }

  async initiateConnection(connectionString: string) {
    try {
      const server = await new Promise<Connection>((resolve, reject) => {
        const server = createConnection(connectionString);
        server.on('connected', (stream) => {
          resolve(server);
        });
        server.on('error', (err) => {
          reject(err);
        });
      });
      this.logger.log(`Successfully connected to mongoose!! ${server.host}`);
      return server;
    } catch (e) {
      this.logger.error('Error connecting to mongoose');
      throw e;
    }
  }

  async setupModels() {
    try {
      for (const [modelName, schema] of Object.entries(MONGOOSE_MODELS)) {
        (this.models[modelName] as any) =
          this.connection?.models[modelName] ??
          this.connection?.model(modelName, schema as any);
      }
    } catch (e) {
      throw e;
    }
  }

  async isConnected() {
    return this.connection?.readyState === 1;
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
}
