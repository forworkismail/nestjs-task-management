import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/user/user.entity';
import { TaskStatus } from '../task-status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(() => User, (user) => user.tasks, { eager: false })
  createdBy: User;

  @Column()
  userId: string;

  @Column({ type: 'timestamptz' })
  createdAt: Date;
}
