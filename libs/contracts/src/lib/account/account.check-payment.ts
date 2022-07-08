import { IsMongoId, IsNotEmpty } from 'class-validator';
import { PurchaseState } from '@purple/interfaces';

export namespace AccountCheckPayment {
  export const topic = 'account.check-payment.command';

  export class Request {
    @IsMongoId()
    @IsNotEmpty()
    userId: string;

    @IsMongoId()
    @IsNotEmpty()
    courseId: string;
  }

  export class Response {
    status: PurchaseState;
  }
}


