import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SqlService } from './providers/sql.provider';
import { MongoModelsType, SqlModelsType } from './db.types';
import { MongoService } from './providers/mongo.provider';

@Injectable()
export class DbService implements OnModuleInit {
  private readonly logger = new Logger(DbService.name);
  public sqlService: SqlModelsType;
  public mongoService: MongoModelsType;
  private sqlConnection: SqlService;
  private mongoConnection: MongoService;

  constructor() {
    // this.mongoConnection = await mongoConnection();
    this.sqlConnection = new SqlService(
      process.env.POSTGRES_CONNECTION_STRING!,
    );
    // this.mongoConnection = new MongoService(
    //   process.env.MONGO_CONNECTION_STRING!,
    // );
    this.sqlService = this.sqlConnection.models;
    // this.mongoService = this.mongoConnection.models;
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing DbService...');

    try {
      await this.sqlConnection.init();

      // db sync
      // await this.sqlConnection.sync({ alter: true });

      this.logger.log('✅ SQL connection and model setup complete.');
    } catch (error) {
      this.logger.error(
        '❌ Failed to initialize SQL database connection.',
        error,
      );
      process.exit(1);
    }
  }

  getSqlConnection() {
    return this.sqlConnection;
  }

  getMongoConnection() {
    return this.mongoConnection;
  }
}
