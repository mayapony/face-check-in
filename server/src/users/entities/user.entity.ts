import { Activity } from 'src/activitys/entities/activity.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  isAdmin: number;

  @ManyToOne(() => Activity, (activity) => activity.users)
  activity: Activity;
}
