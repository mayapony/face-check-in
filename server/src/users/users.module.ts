import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as multer from 'multer';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GlobalService } from '../utils/global.service';
import { ActivitysModule } from 'src/activitys/activitys.module';
import { Activity } from 'src/activitys/entities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Activity]),
    MulterModule.register({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'files');
        },
        filename: function (req, file, cb) {
          cb(null, file.originalname);
        },
      }),
    }),
    ActivitysModule,
    GlobalService,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  // need export MulterModule, source: https://bytemeta.vip/repo/nestjs/nest/issues/11179
  exports: [UsersService, MulterModule],
})
export class UsersModule {}
