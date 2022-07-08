import { IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export namespace PaymentGenerateLink {
  export const topic = 'payment.generate-link.command';

  export class Request {
    @IsMongoId()
    @IsNotEmpty()
    courseId: string;

    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    sum: number;
  }

  export class Response {
    paymentLink: string;
  }
}


