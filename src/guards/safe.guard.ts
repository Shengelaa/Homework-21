import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class SafeGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const email = req.headers.email as string;

    if (!email) {
      console.log('No email provided in headers');
      req['hasSale'] = false;
      return true;
    }

    const user = this.usersService.getUserByEmail(email);

    console.log('User found', user);

    if (!user) {
      req['hasSale'] = false;
      return true;
    }

    const now = new Date();
    const subscriptionEnd = new Date(user.subscriptionEndDate);

    req['hasSale'] = subscriptionEnd > now;

    return true;
  }
}
