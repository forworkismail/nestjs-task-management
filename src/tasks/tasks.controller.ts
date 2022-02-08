import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { GetUserId } from '../auth/decorator/get-userId.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './entities/task.entity';
import { TaskStatusValidationPipe } from './pipes/task-status.validation.pipe';
import { TaskStatus } from './task-status.enum';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  private logger = new Logger(TasksController.name);
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto, @GetUserId() createdByUserId: string): Promise<Task[]> {
    this.logger.verbose(`User "${createdByUserId}" retrieving all tasks. Filters ${JSON.stringify(filterDto)}  `);
    return this.taskService.getTasks(filterDto, createdByUserId);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string, @GetUserId() createdByUserId: string): Promise<Task> {
    return this.taskService.getTaskById(id, createdByUserId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUserId() createdByUserId: string): Promise<Task> {
    this.logger.verbose(`User "${createdByUserId}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
    return this.taskService.createTask(createTaskDto, createdByUserId);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @GetUserId() createdByUserId: string): Promise<void> {
    return this.taskService.deleteTask(id, createdByUserId);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUserId() createdByUserId: string
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status, createdByUserId);
  }
}
