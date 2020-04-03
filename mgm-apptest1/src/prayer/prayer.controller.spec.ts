import { Test, TestingModule } from '@nestjs/testing';
import { PrayerController } from './prayer.controller';

describe('Prayer Controller', () => {
  let controller: PrayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrayerController],
    }).compile();

    controller = module.get<PrayerController>(PrayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
