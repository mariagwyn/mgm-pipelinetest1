import { Test, TestingModule } from '@nestjs/testing';
import { HolydayController } from './holyday.controller';

describe('Holyday Controller', () => {
  let controller: HolydayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolydayController],
    }).compile();

    controller = module.get<HolydayController>(HolydayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
