// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from '@nestjs/terminus';
import { CustomHealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private readonly customHealthService: CustomHealthService,
  ) {}

  @Get()
  check() {
    return this.health.check([
      () => this.customHealthService.checkSqlConnection(),
      // () => this.customHealthService.checkMongoConnection(),
    ]);
  }
}
