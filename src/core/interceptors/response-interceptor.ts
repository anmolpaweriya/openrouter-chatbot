import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { HttpResponseDto } from '../dtos/http-response';

@Injectable()
export class ReqResInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;
    return next.handle().pipe(
      map((data) => {
        if (data instanceof HttpResponseDto) {
          data.meta = {
            ...data.meta,
            success: true,
            message: 'SUCCESS',
            statusCode,
          };
          return data;
        }
        const resDto = new HttpResponseDto<any, any>();
        resDto.data = data;
        resDto.meta = {
          success: true,
          message: 'SUCCESS',
          statusCode,
        };
        // is list then
        if (data && typeof data === 'object' && data?.length !== undefined) {
          resDto.meta.count = data.length;
        }
        return resDto;
      }),
    );
  }
}
