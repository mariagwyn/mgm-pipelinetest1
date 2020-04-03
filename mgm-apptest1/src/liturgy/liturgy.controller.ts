import { Controller, UseGuards, Get, SetMetadata } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';
import { Crud, CrudController } from "@nestjsx/crud";

import { Liturgy } from "./liturgy.entity";
import { LiturgyService } from "./liturgy.service";

@Crud({
  model: {
    type: Liturgy
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  }
})
@Controller('liturgy')
@UseGuards(PermissionGuard)
export class LiturgyController implements CrudController<Liturgy> {
  constructor(public service: LiturgyService) {}

  @Get('menu')
  @SetMetadata('override-rejection', true)
  async getLiturgyMenu() : Promise<Liturgy[]> {
    let menu = await this.service.menuOptions();
    return menu;
  }
}
