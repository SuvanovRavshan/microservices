import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor() {}


  @Post('info')
  @UseGuards(JwtAuthGuard)
  async info(@UserId() userId: string){

  }
}
