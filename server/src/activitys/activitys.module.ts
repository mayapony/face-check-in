import { Module } from '@nestjs/common';
import { ActivitysService } from './activitys.service';
import { ActivitysController } from './activitys.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  controllers: [ActivitysController],
  providers: [ActivitysService],
  exports: [ActivitysService, ActivitysModule],
})
export class ActivitysModule {}
