import { Sequelize, SyncOptions } from 'sequelize';
import { SqlModelsType } from '../db.types';
import { SQL_MODELS } from '../models';
import { Logger } from '@nestjs/common';

export class SqlService {
  logger = new Logger(SqlService.name);
  public readonly models: SqlModelsType = {} as SqlModelsType;
  private readonly sequelize: Sequelize;

  constructor(uri: string) {
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    try {
      this.sequelize = new Sequelize(uri, {
        dialect: 'postgres',
        logging: console.log,
      });

      this.logger.log('Initializing models...');
      for (const [modelName, initFn] of Object.entries(SQL_MODELS)) {
        const typedModelName = modelName as keyof typeof SQL_MODELS;
        this.models[typedModelName] = initFn(this.sequelize) as any;
      }

      for (const model of Object.values(this.models)) {
        (model as any)?.associate?.(this.models);
      }

      this.logger.log('✅ All models initialized and associated.');
    } catch (err) {
      this.logger.error('Database connection error:', err);
      throw err;
    }
  }

  public async init() {
    try {
      this.logger.log('Authenticating database connection...');
      await this.sequelize.authenticate();
      this.logger.log('✅ Successfully connected to PostgreSQL!');
    } catch (err) {
      this.logger.error(
        '❌ Failed to connect to the database. Exiting app.',
        err,
      );
      process.exit(1); // Immediately stop the app
    }
  }

  async sync(options?: SyncOptions) {
    await this.sequelize.sync(options);
  }

  getSequelizeInstance(): Sequelize {
    return this.sequelize;
  }

  async isConnected(): Promise<boolean> {
    try {
      await this.sequelize.authenticate();
      return true;
    } catch (error) {
      this.logger.error('Database connection error:', error);
      return false;
    }
  }
}
