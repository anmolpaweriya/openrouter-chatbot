import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { EXTERNAL_CALL_NOT_ALLOWED } from './guards.constants';

@Injectable()
export class InternalCallGuard implements CanActivate {
  constructor() {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const xSecret = request.headers['x-secret'];

    if (xSecret !== process.env.X_SECRET) {
      throw new UnauthorizedException(EXTERNAL_CALL_NOT_ALLOWED);
    }

    return true;
  }
}
