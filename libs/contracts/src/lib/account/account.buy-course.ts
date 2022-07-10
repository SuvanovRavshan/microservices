import { IsMongoId, IsNotEmpty } from 'class-validator';

export namespace AccountBuyCourse {
  export const topic = 'account.buy-course.command';

  export class Request {
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @IsMongoId()
    @IsNotEmpty()
    courseId: string;
  }

  export class Response {
    paymentLink: string;
  }
}


