import { Controller, UseGuards } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';
import { Crud, CrudController } from "@nestjsx/crud";

import { Prayer } from "./prayer.entity";
import { PrayerService } from "./prayer.service";

@Crud({
  model: {
    type: Prayer
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  }
})
@Controller('prayer')
@UseGuards(PermissionGuard)
export class PrayerController implements CrudController<Prayer> {
  constructor(public service: PrayerService) {}
}
