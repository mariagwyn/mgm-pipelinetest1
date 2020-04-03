import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";

import { Favorite } from './favorite.entity';

@Injectable()
export class FavoriteService extends TypeOrmCrudService<Favorite> {
  constructor(@InjectRepository(Favorite) repo) {
    super(repo);
  }

  async save(obj : Favorite, user : string) : Promise<Favorite> {
    if(!obj.user) {
      obj.user = user;
    }
    return await this.repo.save(obj);
  }
}
