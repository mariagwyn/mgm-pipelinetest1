import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { Prayer } from './prayer.entity';

@Injectable()
export class PrayerService extends TypeOrmCrudService<Prayer> {
  constructor(@InjectRepository(Prayer) repo) {
    super(repo);
  }

  async save(obj : Prayer) : Promise<Prayer> {
    return await this.repo.save(obj);
  }
}
