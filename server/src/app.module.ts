import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './users/entities/user.entity';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

import { join } from 'path';
import { ActivitysModule } from './activitys/activitys.module';
import { ActivitysController } from './activitys/activitys.controller';
import { Activity } from './activitys/entities/activity.entity';
import { RecordsModule } from './records/records.module';
import { Record } from './records/entities/record.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: 'admin',
      database: 'face',
      entities: [User, Activity, Record],
      synchronize: true,
    }),
    UsersModule,
    // source from https://stackoverflow.com/questions/63429380/how-to-serve-static-images-in-nestjs
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'),
    }),
    ActivitysModule,
    RecordsModule,
  ],
  controllers: [AppController, UsersController, ActivitysController],
  providers: [AppService],
})
export class AppModule {}
