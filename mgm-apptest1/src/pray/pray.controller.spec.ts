import { Test, TestingModule } from '@nestjs/testing';
import { PrayController } from './pray.controller';

describe('Pray Controller', () => {
  let controller: PrayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayController],
    }).compile();

    controller = module.get<PrayController>(PrayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
