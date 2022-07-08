import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ICourse } from '@purple/interfaces';

export namespace CourseGetCourse {
  export const topic = 'course.get-course.query';

  export class Request {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
  }

  export class Response {
    course: ICourse | null;
  }
}


