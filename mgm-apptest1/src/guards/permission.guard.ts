import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from '../users/users.service';
import { Group } from '../users/user.model';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private usersService : UsersService, private reflector : Reflector) { }

  async canActivate(context : ExecutionContext): Promise<boolean> {
    const override = this.reflector.get<boolean | undefined>(
      'override-rejection',
      context.getHandler(),
    );
    if(override) {
      return true;
    } else {
      const request = context.switchToHttp().getRequest(),
            headers = request.headers,
            authHeader = headers['authorization'];
      if(!authHeader) {
        return false;
      } else {
        const accessToken = authHeader.split('bearer ')[1],
              groups : Group[] = await this.usersService.getGroups(accessToken),
              names : string[] = groups.map(group => group.profile.name);
        return names.includes('Content');
      }
    }
  }
}
