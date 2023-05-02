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
import { UsersService } from './users.service';
import { GlobalService } from '../utils/global.service';
import { JoinActivityDto } from './dto/join-activity.dto';
import * as faceapi from 'face-api.js';
import sizeOf from 'image-size';
import { Canvas, createCanvas, loadImage } from 'canvas';
import { TNetInput } from 'face-api.js';

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

  @Get('one/:id')
  async findOne(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.usersService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const name = file.originalname.split('.')[0];
    if (!name) return false;
    try {
      const filePath = file.path;
      const dimensions = (await sizeOf(filePath)) as {
        height: number;
        width: number;
        type: string;
      };
      console.log(dimensions);

      // source from: https://github.com/justadudewhohacks/face-api.js/issues/729
      const canvas = createCanvas(dimensions.width, dimensions.height);
      const ctx = canvas.getContext('2d');
      const img = await loadImage(filePath);
      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

      // const img = new Image();
      // img.src = filePath;
      const fullFaceDescription = await faceapi
        .detectSingleFace(canvas as Canvas as any as TNetInput)
        .withFaceLandmarks()
        .withFaceDescriptor();
      if (!fullFaceDescription) {
        throw new Error(`no faces detected`);
      }
      const faceDescriptors = [fullFaceDescription.descriptor];
      // GlobalService.labeledFaceDescriptors.push(
      //   new faceapi.LabeledFaceDescriptors(user.name, faceDescriptors),
      // );

      console.log({
        name,
        faceDescriptors,
      });

      const labeledFaceDescriptors = new faceapi.LabeledFaceDescriptors(
        name,
        faceDescriptors,
      );
      console.log(GlobalService.labeledFaceDescriptors);
      GlobalService.labeledFaceDescriptors =
        GlobalService.labeledFaceDescriptors.concat(labeledFaceDescriptors);
      console.log(GlobalService.labeledFaceDescriptors);
      console.log(`add ${name}'s label success!`);
    } catch (err) {
      console.log(err);
    }

    return true;
  }

  @Get('descriptors')
  findDescriptors() {
    return GlobalService.labeledFaceDescriptors;
  }

  @Post('join')
  join(@Body() joinActivityDto: JoinActivityDto) {
    console.log(joinActivityDto);
    return this.usersService.join(joinActivityDto);
  }
}
