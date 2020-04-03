import { Test, TestingModule } from '@nestjs/testing';
import { BulletinController } from './bulletin.controller';

describe('Bulletin Controller', () => {
  let controller: BulletinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulletinController],
    }).compile();

    controller = module.get<BulletinController>(BulletinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
