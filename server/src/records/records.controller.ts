import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RecordsService } from './records.service';

@Controller('records')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  create() {
    return this.recordsService.create();
  }

  @Post('sign')
  sign(@Body() { name }: { name: string }) {
    return this.recordsService.sign(name);
  }

  @Get()
  findAll() {
    return this.recordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recordsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.recordsService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordsService.remove(+id);
  }
}
