import { Test, TestingModule } from '@nestjs/testing';
import { LectionaryController } from './lectionary.controller';

describe('Lectionary Controller', () => {
  let controller: LectionaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LectionaryController],
    }).compile();

    controller = module.get<LectionaryController>(LectionaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
