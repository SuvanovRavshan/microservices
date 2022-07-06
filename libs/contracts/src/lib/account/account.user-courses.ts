import { IsMongoId, IsNotEmpty } from 'class-validator';
import { IUserCourses } from '@purple/interfaces';

export namespace AccountUserCourses {
  export const topic = 'account.user-courses.query';

  export class Request {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
  }

  export class Response {
    courses: IUserCourses[];
  }
}


