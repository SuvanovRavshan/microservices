import { Controller, Get, HttpException, HttpStatus, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { UserId } from '../decorators/user.decorator';
import { RMQService } from 'nestjs-rmq';
import { AccountUserInfo } from '@purple/contracts';
import { Cron } from '@nestjs/schedule';

@Controller('user')
export class UserController {
  constructor(private readonly rmqService: RMQService) {}


  @Get('info')
  @UseGuards(JwtAuthGuard)
  async info(@UserId() id: string){
    try {
      return await this.rmqService.send<AccountUserInfo.Request, AccountUserInfo.Response>(AccountUserInfo.topic, { id });
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  @Cron('*/5 * * * * *')
  async cron() {
    // Logger.log('Done');
  }
}
