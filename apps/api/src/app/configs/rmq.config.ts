import { IRMQServiceAsyncOptions } from 'nestjs-rmq/dist/interfaces/rmq-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    exchangeName: configService.get('AMQP_EXCHANGE'),
    connections: [
      {
        login: configService.get('AMQP_USER') ?? '',
        password: configService.get('AMQP_PASSWORD') ?? '',
        host: configService.get('AMQP_HOST') ?? '',
      }
    ],
    prefetchCount: Number(configService.get('AMQP_PREFETCH_COUNT')) ?? 30,
    serviceName: configService.get('AMQP_SERVICE_NAME') ?? '',
  })
})
