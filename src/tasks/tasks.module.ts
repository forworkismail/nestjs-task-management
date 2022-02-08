import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UserRepository } from '../auth/user/user.repository';
import { TaskRepository } from './task.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository, UserRepository]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
