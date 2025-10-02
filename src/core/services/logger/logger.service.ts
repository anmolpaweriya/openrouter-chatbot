import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerService extends ConsoleLogger {
  formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ): string {
    const pid = this.colorize(pidMessage, logLevel);
    formattedLogLevel = this.colorize(formattedLogLevel, logLevel);
    message = this.stringifyMessage(message, logLevel);

    const logMessage = `${this.getTimestamp()} ${pid} ${formattedLogLevel} ${contextMessage}   ${String(message)} ${timestampDiff}`;

    return `${logMessage}\n`;
  }

  logRequest(request: any, response: Response, startTime: number, error?: any) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const requestId = request.headers['x-request-id'] as string | undefined;
    if (requestId) response.setHeader('X-Request-Id', requestId);

    const logData = {
      id: requestId,
      request: {
        url: request.url,
        method: request.method,
        headers: request.headers,
        ip: request.ip,
        user: request.user || {},
        query: request.query || {},
        params: request.params || {},
      },
      response: {
        statusCode: response.statusCode,
        responseTime: responseTime,
      },
    };

    if (error) {
      this.error(JSON.stringify(logData));
    } else {
      this.log(JSON.stringify(logData));
    }
  }
}
