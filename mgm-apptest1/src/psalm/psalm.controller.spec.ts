import { Test, TestingModule } from '@nestjs/testing';
import { PsalmController } from './psalm.controller';

describe('Psalm Controller', () => {
  let controller: PsalmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PsalmController],
    }).compile();

    controller = module.get<PsalmController>(PsalmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
