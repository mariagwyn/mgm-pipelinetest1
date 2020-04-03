import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { In, Not } from 'typeorm';

import { Psalm } from './psalm.entity';

@Injectable()
export class PsalmService extends TypeOrmCrudService<Psalm> {
  constructor(@InjectRepository(Psalm) repo) {
    super(repo);
  }

  async save(obj : Psalm) : Promise<Psalm> {
    return await this.repo.save(obj);
  }

  async getCanticles(language : string, version : string[]) : Promise<Psalm[]> {
    return await this.repo.find({ language, version: In(version), canticle: true })
  }

  async getPsalm(number : string, version : string) : Promise<Psalm[]> {
    return await this.repo.find({ number, version })
  }

  async getPsalmMultiversion(number : string, versions : string[]) : Promise<Psalm[]> {
    return await this.repo.find({ number, version: In(versions) })
  }

  async getVersions() : Promise<string[]> {
    const all : Psalm[] = await this.repo.find({ canticle: Not(true) });
    return all.map(p => p.version)
      .reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], []);
  }

  async getPsalmNumbers(version : string) : Promise<string[]> {
    const all : Psalm[] = await this.repo.find({ version });
    return all.map(p => p.number)
      .reduce((uniques, item) => uniques.includes(item) ? uniques : [...uniques, item], []);
  }
}
