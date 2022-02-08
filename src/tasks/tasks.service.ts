import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user/user.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository
  ) {}

  async getTaskById(id: string, createdByUserId: string): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: createdByUserId }
    });

    if (!found) {
      throw new NotFoundException(`Task with ID: ${id} not found`);
    }

    return found;
  }

  getTasks(filterDto: GetTasksFilterDto, createdByUserId: string): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, createdByUserId);
  }

  async createTask(createTaskDto: CreateTaskDto, createdByUserId: string): Promise<Task> {
    const createdByUser = await this.userRepository.findOne({
      id: createdByUserId
    });
    return this.taskRepository.createTask(createTaskDto, createdByUser);
  }

  async deleteTask(id: string, createdByUserId: string): Promise<void> {
    const result = await this.taskRepository.delete({
      id,
      userId: createdByUserId
    });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus, createdByUserId: string): Promise<Task> {
    const task = await this.getTaskById(id, createdByUserId);
    task.status = status;
    await task.save();
    return task;
  }
}
