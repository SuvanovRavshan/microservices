import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getJwtConfig = (): JwtModuleAsyncOptions => {
  return {
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
}
