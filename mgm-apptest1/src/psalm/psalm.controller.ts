import { Controller, UseGuards, Get, SetMetadata, Query } from '@nestjs/common';
import { PermissionGuard } from '../guards/permission.guard';
import { Crud, CrudController } from "@nestjsx/crud";

import { Psalm } from "./psalm.entity";
import { PsalmService } from "./psalm.service";

@Crud({
  model: {
    type: Psalm
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  }
})
@Controller('psalm')
@UseGuards(PermissionGuard)
export class PsalmController implements CrudController<Psalm> {
  constructor(public service: PsalmService) {}

  @Get('canticles')
  @SetMetadata('override-rejection', true)
  async getCanticles(@Query('language') language : string, @Query('version') version : string) : Promise<Psalm[]> {
    let menu = await this.service.getCanticles(language, JSON.parse(version));
    return menu;
  }

  @Get('versions')
  @SetMetadata('override-rejection', true)
  async getVersions() : Promise<string[]> {
    return this.service.getVersions();
  }

  @Get('numbers')
  @SetMetadata('override-rejection', true)
  async getPsalmNumbers(@Query('version') version : string) : Promise<string[]> {
    return this.service.getPsalmNumbers(version);
  }

  @Get('get')
  @SetMetadata('override-rejection', true)
  async getPsalm( @Query('number') number : string, @Query('version') version : string) : Promise<Psalm[]> {
    return this.service.getPsalm(number, version);
  }
}
