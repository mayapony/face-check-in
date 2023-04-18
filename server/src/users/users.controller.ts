import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { GlobalService } from '../utils/global.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUser: CreateUserDto) {
    console.log(createUser);
    return this.usersService.create(createUser);
  }

  @Post('login')
  login(@Body() loginUser: LoginUserDto) {
    console.log({
      loginUser,
    });
    return this.usersService.login(loginUser);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file.originalname);
    return true;
  }

  @Get('descriptors')
  findDescriptors() {
    return GlobalService.labeledFaceDescriptors;
  }
}
