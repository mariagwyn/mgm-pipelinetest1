import { Test, TestingModule } from '@nestjs/testing';
import { PrayService } from './pray.service';

describe('PrayService', () => {
  let service: PrayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrayService],
    }).compile();

    service = module.get<PrayService>(PrayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
