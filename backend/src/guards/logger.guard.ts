
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    res.on('finish', () => {
      const duration = Date.now() - now;
      const method = req.method;
      const url = req.originalUrl;
      const statusCode = res.statusCode;

      console.log(`${method} ${url} - ${statusCode} ${duration}ms`);
    });

    return true; 
  }
}
