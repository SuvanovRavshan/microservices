import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export namespace AccountRegister {
  export const topic = 'account.register.command';

  export class Request {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsOptional()
    displayName?: string;
  }

  export class Response {
    email: string;
  }
}


