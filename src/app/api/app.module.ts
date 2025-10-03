import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DbModule } from 'src/core/services/db-service/db.module';
import { HealthCheckModule } from 'src/core/health-check/health.module';
import { ReqResInterceptor } from 'src/core/interceptors/response-interceptor';
import { LoggerModule } from 'src/core/services/logger/logger.module';
import { HttpExceptionFilter } from 'src/core/filters/http-exception.filter';
import { ChatModule } from 'src/modules/chatbot/chat.module';
import { CoursesModule } from 'src/modules/courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DbModule,
    LoggerModule,
    HealthCheckModule,
    // modules
    ChatModule,
    CoursesModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ReqResInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
