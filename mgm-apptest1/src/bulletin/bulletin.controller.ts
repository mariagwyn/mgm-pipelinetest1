import { Controller, UseGuards, Get, Post, Body, Headers, SetMetadata, Query } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';
import { Crud, CrudController } from "@nestjsx/crud";
import { In } from "typeorm";

import { Bulletin } from "./bulletin.entity";
import { BulletinService } from "./bulletin.service";
import { UsersService } from "../users/users.service";

@Crud({
  model: {
    type: Bulletin
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  }
})
@Controller('bulletin')
@UseGuards(PermissionGuard)
export class BulletinController implements CrudController<Bulletin> {
  constructor(public service: BulletinService, public usersService : UsersService) {}

  @Get('read')
  @SetMetadata('override-rejection', true)
  async readBulletin(@Query('id') id : number) : Promise<Bulletin> {
    return this.service.findOne({id});
  }

  @Get('many')
  @SetMetadata('override-rejection', true)
  async readBulletins(@Query('ids') ids : string) : Promise<Bulletin[]> {
    return this.service.find({id: In(ids.split(','))});
  }

  @Post('save')
  @SetMetadata('override-rejection', true)
  async saveBulletin(@Body() request : Bulletin, @Headers('authorization') authorization : string) : Promise<Bulletin> {
    const bulletin = new Bulletin();
    bulletin.settings = request.settings;
    bulletin.liturgy = request.liturgy;
    bulletin.uid = request.uid;
    if(authorization) {
      try {
        let token = authorization.split('bearer ')[1],
            username = await this.usersService.getUsernameFromAccessToken(token);
        bulletin.owner = username;
      } catch(e) {
        console.error(e);
      }
    }
    console.log(bulletin);
    return this.service.save(bulletin);
  }
}
