import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from '../auth/user/user.entity';
import { UserRepository } from '../auth/user/user.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn()
});

const mockUserRepository = () => ({
  signUp: jest.fn(),
  findOne: jest.fn()
});

const mockUserId = '123123';

const mockUser = new User();
mockUser.id = '123123';
mockUser.username = 'abc';
mockUser.password = 'password';
mockUser.salt = 'salt';

describe('TaskService', () => {
  let tasksService: TasksService;
  let taskRepository: ReturnType<typeof mockTaskRepository>;
  let userRepository: ReturnType<typeof mockUserRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
        { provide: UserRepository, useFactory: mockUserRepository }
      ]
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get(TaskRepository);
    userRepository = await module.get(UserRepository);
  });

  describe('getTasks', () => {
    it('should get all tasks from repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filters: GetTasksFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'some search term'
      };

      // call tasksService.getTasks
      const result = await tasksService.getTasks(filters, mockUserId);

      // expect taskRepository.getTasks to have been called
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    const taskOfUser = { id: '1', createdByUserId: mockUserId };

    it('calls taskRepository.findOne() and successfully retrieves and return the task', async () => {
      const mockTask = { title: 'Test task', description: 'Test description' };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(taskOfUser.id, taskOfUser.createdByUserId);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskOfUser.id, userId: taskOfUser.createdByUserId }
      });
    });

    it('throws an error when the task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(taskOfUser.id, taskOfUser.createdByUserId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.createTask() and returns the value', async () => {
      taskRepository.createTask.mockResolvedValue('someTask');
      userRepository.findOne.mockResolvedValue(mockUser);

      expect(taskRepository.createTask).not.toHaveBeenCalled();
      const createTaskDto = { title: 'someTask', description: 'someDesc' };
      const result = await tasksService.createTask(createTaskDto, mockUserId);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        id: mockUserId
      });
      expect(result).toEqual('someTask');
      expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
    });
  });

  describe('deleteTask', () => {
    it('calls taskRepository.deleteTask to delete a task', async () => {
      taskRepository.delete.mockResolvedValue({ affected: 1 });
      expect(taskRepository.delete).not.toHaveBeenCalled();
      await tasksService.deleteTask('1', mockUserId);
      expect(taskRepository.delete).toHaveBeenCalledWith({ id: '1', userId: mockUserId });
    });

    it('throws error if task not found', () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });
      expect(tasksService.deleteTask('1', mockUserId)).rejects.toThrow(NotFoundException);
    });
  });
});
