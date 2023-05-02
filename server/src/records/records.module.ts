import { Module } from '@nestjs/common';
import { RecordsService } from './records.service';
import { RecordsController } from './records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Activity } from 'src/activitys/entities/activity.entity';
import { Record } from './entities/record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Activity, Record])],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
