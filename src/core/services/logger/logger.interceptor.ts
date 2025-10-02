import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { tap } from 'rxjs';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();

      const now = Date.now();

      this.loggerService.log(
        `Incoming Request: ${request.method} ${request.url}`,
        'HTTP_REQ',
      );

      return next.handle().pipe(
        tap(() => {
          this.loggerService.logRequest(request, response, now);
        }),
      );
    }

    return next.handle();
  }
}
