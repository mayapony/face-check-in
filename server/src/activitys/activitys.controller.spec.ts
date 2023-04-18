import { Test, TestingModule } from '@nestjs/testing';
import { ActivitysController } from './activitys.controller';
import { ActivitysService } from './activitys.service';

describe('ActivitysController', () => {
  let controller: ActivitysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitysController],
      providers: [ActivitysService],
    }).compile();

    controller = module.get<ActivitysController>(ActivitysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
