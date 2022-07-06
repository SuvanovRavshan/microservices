import { IsMongoId, IsNotEmpty } from 'class-validator';
import { IUser } from '@purple/interfaces';

export namespace AccountUserInfo {
  export const topic = 'account.user-info.query';

  export class Request {
    @IsMongoId()
    @IsNotEmpty()
    id: string;
  }

  export class Response {
    profile: Omit<IUser,'passwordHash'>;
  }
}


