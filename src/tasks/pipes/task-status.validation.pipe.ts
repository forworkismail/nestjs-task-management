import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  private readonly taskStatus = Object.values(TaskStatus);

  transform(value: any) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new BadRequestException(`Status should be string`);
    }

    value = value.toUpperCase();

    if (this.taskStatus.indexOf(value) === -1) {
      throw new BadRequestException(`${value} is an invalid status`);
    }

    return value;
  }
}
