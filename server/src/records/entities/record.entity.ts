import { User } from 'src/users/entities/user.entity';
import { Activity } from 'src/activitys/entities/activity.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Activity)
  @JoinColumn()
  activity: Activity;

  @CreateDateColumn()
  createDate: Date;
}
