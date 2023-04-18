import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitysService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  create(createActivityDto: CreateActivityDto) {
    const activity = this.activityRepository.create(createActivityDto);
    return this.activityRepository.save(activity);
  }

  findAll() {
    return this.activityRepository.find({
      relations: {
        users: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} activity`;
  }

  update(id: number) {
    return `This action updates a #${id} activity`;
  }

  remove(id: number) {
    return `This action removes a #${id} activity`;
  }
}
