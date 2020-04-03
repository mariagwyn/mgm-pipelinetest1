import { Controller, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';
import { Crud, CrudController } from "@nestjsx/crud";

import { Collect } from "./collect.entity";
import { CollectService } from "./collect.service";

@Crud({
  model: {
    type: Collect
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  }
})
@Controller('collect')
@UseGuards(PermissionGuard)
export class CollectController implements CrudController<Collect> {
  constructor(public service: CollectService) {}
}
