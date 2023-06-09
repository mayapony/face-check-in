import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/activitys/entities/activity.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { JoinActivityDto } from './dto/join-activity.dto';
import { LoginUserDto } from './dto/login-user';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  login(loginUser: LoginUserDto) {
    return this.usersRepository.findOneBy({
      phoneNumber: loginUser.phoneNumber,
      password: loginUser.password,
      isAdmin: loginUser.isAdmin,
    });
  }

  create(createUser: CreateUserDto) {
    const user = this.usersRepository.create(createUser);
    const result = this.usersRepository.save(user);
    return result;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: {
        activity: true,
      },
    });
  }

  async findOne(id: number): Promise<User | null> {
    const user = this.usersRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        activity: true,
      },
    });

    return user;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async join(joinActivityDto: JoinActivityDto) {
    const user = await this.usersRepository.findOneBy({
      id: +joinActivityDto.userID,
    });
    const activity = await this.activityRepository.findOneBy({
      id: +joinActivityDto.activityID,
    });
    if (activity.users) {
      activity.users.push(user);
    } else {
      activity.users = [user];
    }
    return this.activityRepository.save(activity);
  }
}
