import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { Bulletin } from './bulletin.entity';

@Injectable()
export class BulletinService extends TypeOrmCrudService<Bulletin> {
  constructor(@InjectRepository(Bulletin) repo) {
    super(repo);
  }

  async save(obj : Bulletin) : Promise<Bulletin> {
    return await this.repo.save(obj);
  }
}
