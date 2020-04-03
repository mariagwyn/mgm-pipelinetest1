import { Test, TestingModule } from '@nestjs/testing';
import { LectionaryService } from './lectionary.service';

describe('LectionaryService', () => {
  let service: LectionaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectionaryService],
    }).compile();

    service = module.get<LectionaryService>(LectionaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
