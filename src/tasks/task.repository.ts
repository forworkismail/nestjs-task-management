import { EntityRepository, Repository } from 'typeorm';
import { User } from '../auth/user/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilterDto, createdByUserId: string): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: createdByUserId });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto, createdByUser: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.createdBy = createdByUser;
    task.userId = createdByUser.id;
    task.createdAt = new Date();

    await task.save();

    delete task.createdBy;

    return task;
  }
}
