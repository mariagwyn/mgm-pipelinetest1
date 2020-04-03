import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private users : UsersService) { }

  async use(req: any, res: any, next: () => void) {
    let authHeader = req.headers.authorization;
    if(authHeader) {
      try {
        let token = authHeader.split('bearer ')[1],
            username = await this.users.getUsernameFromAccessToken(token);
        if(username) {
          req.user = username;
        }
      } catch(e) {
        console.error(e);
      }
    }
    next();
  }
}
