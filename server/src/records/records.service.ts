import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { IResponse } from 'src/utils/IResponse';
import { Repository } from 'typeorm';
import { Record } from './entities/record.entity';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private recordsRepository: Repository<Record>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async sign(name: string) {
    const user = await this.usersRepository.findOne({
      where: {
        name,
      },
      relations: {
        activity: true,
      },
    });

    if (!user) return new IResponse<null>(0, '用户不存在');

    const record = await this.recordsRepository.findOne({
      where: {
        user,
        activity: user.activity,
      },
    });

    if (!record) {
      const record = this.recordsRepository.create({
        user,
        activity: user.activity,
      });
      try {
        await this.recordsRepository.save(record);
      } catch (error) {
        console.log(error);
      }

      return new IResponse<string>(2, '签到成功！', user.activity.name);
    } else {
      return new IResponse<null>(1, '您已签到!');
    }
  }

  create() {
    return 'This action adds a new record';
  }

  findAll() {
    return this.recordsRepository.find({
      relations: {
        user: true,
        activity: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  update(id: number) {
    return `This action updates a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
