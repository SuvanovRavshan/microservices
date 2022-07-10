import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { PurchaseState } from '@purple/interfaces';

export namespace AccountChangedCourse {
  export const topic = 'account.changed-course.event';

  export class Request {
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @IsMongoId()
    @IsNotEmpty()
    courseId: string;

    @IsString()
    state: PurchaseState;
  }
}


