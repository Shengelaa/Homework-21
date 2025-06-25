import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class SafeGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const email = req.headers.email as string;

    if (!email) {
      console.log('No email provided in headers');
      req['hasSale'] = false;
      return true;
    }

    try {

      const user = await this.usersService.getUserByEmail(
        email.toLowerCase().trim(),
      );

      if (!user) {

        req['hasSale'] = false;
        return true;
      }


      const now = new Date();
      const subscriptionEnd = new Date(user.subscriptionEndDate.toString());


      req['hasSale'] = subscriptionEnd > now;
    } catch (error) {

      console.error('Error in SafeGuard:', error);
      req['hasSale'] = false;
    }

    return true;
  }
}
