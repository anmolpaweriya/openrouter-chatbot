import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import { DbService } from 'src/core/services/db-service/db.service';

@Injectable()
export class CustomHealthService extends HealthIndicator {
  constructor(private readonly dbService: DbService) {
    super();
  }

  checkSqlConnection = async () => {
    const sqlConnected = await this.dbService.getSqlConnection().isConnected();
    if (!sqlConnected)
      throw new HealthCheckError(
        'DB services are not ready',
        this.getStatus('Postgres', false),
      );
    return this.getStatus('Postgres', true);
  };

  checkMongoConnection = async () => {
    const mongoConnected = await this.dbService
      .getMongoConnection()
      .isConnected();
    if (!mongoConnected)
      throw new HealthCheckError(
        'MongoDB services are not ready',
        this.getStatus('MongoDB', false),
      );
    return this.getStatus('MongoDB', true);
  };
}
