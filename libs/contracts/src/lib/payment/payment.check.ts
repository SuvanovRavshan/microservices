import { IsMongoId, IsNotEmpty } from 'class-validator';

export namespace PaymentCheck {
  export const topic = 'payment.check.query';

  export class Request {
    @IsMongoId()
    @IsNotEmpty()
    courseId: string;

    @IsMongoId()
    @IsNotEmpty()
    userId: string;
  }

  export class Response {
    state: 'canceled' | 'success' | 'progress';
  }
}


