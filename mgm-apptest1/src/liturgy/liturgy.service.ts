import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Not } from "typeorm";

import { Liturgy } from './liturgy.entity';

@Injectable()
export class LiturgyService extends TypeOrmCrudService<Liturgy> {
  constructor(@InjectRepository(Liturgy) repo) {
    super(repo);
  }

  async save(obj : Liturgy) : Promise<Liturgy> {
    return await this.repo.save(obj);
  }

  menuOptions() : Promise<Liturgy[]> {
    return this.repo.find({
      select: ['id', 'slug', 'name', 'language', 'version', 'source', 'preferences', 'evening'],
      where: [{ supplement: false }, { supplement: null }]
    });
  }
}
