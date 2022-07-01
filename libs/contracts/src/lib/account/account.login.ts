import { IsEmail, IsNotEmpty } from 'class-validator';

export namespace AccountLogin {
  export const topic = 'account.login.command';

  export class Request {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
  }

  export class Response {
    access_token: string;
  }
}


