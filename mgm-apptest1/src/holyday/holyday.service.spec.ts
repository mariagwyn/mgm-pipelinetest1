import { Test, TestingModule } from '@nestjs/testing';
import { HolydayService } from './holyday.service';

describe('HolydayService', () => {
  let service: HolydayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HolydayService],
    }).compile();

    service = module.get<HolydayService>(HolydayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
