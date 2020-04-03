import { Controller, Get, Post, Body, Query, Headers, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserPreferences, Role, Group } from './user.model';
import { AuthGuard } from '../guards/auth.guard';

class SetPrefsRequest {
  token: string;
  preferences: UserPreferences;
}

class SignInWithAppleRequest {
  email: string;
  authorizationCode : string;
  state?: string;
  identityToken: string;
  fullName: {
    nickname: string;
    phoneticRepresentation? : any,
    middleName: string;
    familyName: string;
    namePrefix: string;
    givenName: string;
    nameSuffix: string;
  };
  user: string;
}

@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService : UsersService) {}

  @Post('preferences')
  async setPreferences(@Body() request : SetPrefsRequest, @Headers('authorization') authorization : string) {
    let token = authorization.split('bearer ')[1],
        username = await this.usersService.getUsernameFromAccessToken(token);
    return this.usersService.setPreferences(username, request.preferences);
  }

  @Get('preferences')
  async getPreferences(@Headers('authorization') authorization : string) {
    let token = authorization.split('bearer ')[1],
        username = await this.usersService.getUsernameFromAccessToken(token);
    return this.usersService.getPreferences(username);
  }

  @Get()
  async returnUser(@Query('token') token : string) {
    let username = await this.usersService.getUsernameFromAccessToken(token);
    return username ? this.usersService.getUser(username) : undefined;
  }

  @Get('groups')
  async returnGroups(@Headers('authorization') authorization : string) : Promise<Group[]> {
    let token = authorization.split('bearer ')[1];
    return this.usersService.getGroups(token);
  }

  @Post('signInWithApple')
  async signInWithApple(@Body() req : SignInWithAppleRequest) : Promise<any> {
    console.log(req);
    const newUser = {
      profile: {
        firstName: req.fullName.givenName,
        lastName: req.fullName.familyName,
        email: req.email,
        login: req.user,
      },
      credentials: {
        provider : {
          type: "SOCIAL",
          name: "SOCIAL"
        }
      }
    };
    return this.usersService.signInWithApple(newUser);
  }
}
