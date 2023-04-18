import { Test, TestingModule } from '@nestjs/testing';
import { ActivitysService } from './activitys.service';

describe('ActivitysService', () => {
  let service: ActivitysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivitysService],
    }).compile();

    service = module.get<ActivitysService>(ActivitysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
