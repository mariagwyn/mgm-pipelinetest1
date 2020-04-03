import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService : UsersService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return true;
    if(
      request.headers &&
      request.headers['authorization'] &&
      request.headers['authorization'].includes('bearer ')
    ) {
      let token = request.headers['authorization'].split('bearer ')[1],
          username = this.usersService.getUsernameFromAccessToken(token);
      return !!username;
    } else {
      return false;
    }
  }
}
