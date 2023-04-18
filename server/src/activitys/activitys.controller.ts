import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActivitysService } from './activitys.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('activitys')
export class ActivitysController {
  constructor(private readonly activitysService: ActivitysService) {}

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitysService.create(createActivityDto);
  }

  @Get()
  findAll() {
    return this.activitysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.activitysService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activitysService.remove(+id);
  }
}
