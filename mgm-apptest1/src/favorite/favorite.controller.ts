import { Controller, UseGuards, Request, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Crud, CrudController, CrudRequest, CrudAuth, Override, ParsedRequest, ParsedBody } from "@nestjsx/crud";

import { Favorite } from "./favorite.entity";
import { FavoriteService } from "./favorite.service";
import { User } from '../users/user.model';

@Crud({
  model: {
    type: Favorite
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  }
})
@CrudAuth({
  property: 'user',
  filter: (user: string) => ({
    user: user,
  })
})
@Controller('favorite')
@UseGuards(AuthGuard)
export class FavoriteController implements CrudController<Favorite> {
  constructor(public service: FavoriteService) {}

  get base(): CrudController<Favorite> {
    return this;
  }

  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Favorite,
    @Request() request
  ) {
    console.log(request.user);
    dto.user = request.user;
    return this.base.createOneBase(req, dto);
  }
}
