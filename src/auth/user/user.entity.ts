import { hash } from 'bcrypt';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => Task, (task) => task.createdBy, { eager: true })
  tasks: Task[];

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await hash(password, this.salt);
    return hashedPassword === this.password;
  }
}
