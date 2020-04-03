import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { Collect } from './collect.entity';

@Injectable()
export class CollectService extends TypeOrmCrudService<Collect> {
  constructor(@InjectRepository(Collect) repo) {
    super(repo);
  }

  async save(obj : Collect) : Promise<Collect> {
    return await this.repo.save(obj);
  }
}
