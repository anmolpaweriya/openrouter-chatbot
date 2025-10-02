import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '../services/logger/logger.service';
import { HttpResponseDto } from '../dtos/http-response';
import { HTTP_RESPONSE_CODES } from '../constants/http.constants';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly loggerService: LoggerService = new LoggerService();
  catch(exception: any, host: ArgumentsHost) {
    const endTime = Date.now();
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const status =
      exception?.status ?? HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR.CODE;

    const error = errorCodeRespConstructor(exception, status);
    this.loggerService.logRequest(request, response, endTime, {
      message: error.meta.message,
      failures: error.meta.failures,
    });
    response.status(status).json(error);
  }
}

function errorCodeRespConstructor(error: any, status: number) {
  const response = new HttpResponseDto();
  const statusMessage = Object.values(HTTP_RESPONSE_CODES).find(
    (code) => code.CODE == status,
  );
  // const reqId = tracer.id() as string;
  response.meta = {
    success: false,
    // traceId: reqId,
    message: statusMessage
      ? statusMessage.MESSAGE
      : (error?.message ?? HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR.MESSAGE),
    failures: {
      message:
        error?.message ?? HTTP_RESPONSE_CODES.INTERNAL_SERVER_ERROR.MESSAGE,
      ...(error?.response?.data ?? error?.response ?? error?.data ?? {}),
    },
  };

  return response;
}
