import { Test, TestingModule } from '@nestjs/testing';
import { PsalmService } from './psalm.service';

describe('PsalmService', () => {
  let service: PsalmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PsalmService],
    }).compile();

    service = module.get<PsalmService>(PsalmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
