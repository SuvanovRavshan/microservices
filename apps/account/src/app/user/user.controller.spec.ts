import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RMQModule, RMQService, RMQTestService } from 'nestjs-rmq';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '../configs/mongo.config';
import { INestApplication } from '@nestjs/common';
import {
  AccountBuyCourse, AccountCheckPayment,
  AccountLogin,
  AccountRegister,
  AccountUserInfo,
  CourseGetCourse, PaymentCheck,
  PaymentGenerateLink,
} from '@purple/contracts';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from './user.module';
import { UserRepository } from './repositories/user.repository';
import { verify } from 'jsonwebtoken';

const authLogin: AccountLogin.Request = {
  email: 'a2@a.ru',
  password: '1',
};

const authRegister: AccountRegister.Request = {
  ...authLogin,
  displayName: '',
};

describe('UserController', () => {
  let app: INestApplication;
  let userRepository: UserRepository;
  let rmqService: RMQTestService;
  let token: string;
  let configService: ConfigService;
  let userId: string;

  const courseId = '507f1f77bcf86cd799439011';


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
        RMQModule.forTest({}),
        MongooseModule.forRootAsync(getMongoConfig()),
        UserModule,
        AuthModule,
      ],
    }).compile();
    app = module.createNestApplication();
    userRepository = app.get<UserRepository>(UserRepository);
    rmqService = app.get(RMQService);
    configService = app.get<ConfigService>(ConfigService);
    await app.init();
    await rmqService.triggerRoute<AccountRegister.Request, AccountRegister.Response>(AccountRegister.topic, authRegister);
    const { access_token } = await rmqService.triggerRoute<AccountLogin.Request, AccountLogin.Response>(AccountLogin.topic, authLogin);
    token = access_token;
    const data = verify(token, configService.get('JWT_SECRET'));
    userId = data['id'];
  });

  it('AccountUserInfo', async () => {
    const res = await rmqService.triggerRoute<AccountUserInfo.Request, AccountUserInfo.Response>(AccountUserInfo.topic, { id: userId });
    expect(res.profile.displayName).toEqual(authRegister.displayName);
  });

  it('BuyCourse', async () => {
    const paymentLink = 'paymentLink';
    rmqService.mockReply<CourseGetCourse.Response>(CourseGetCourse.topic, {
      course: {
        _id: courseId,
        price: 1000,
      },
    });
    rmqService.mockReply<PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      paymentLink: paymentLink,
    });
    const res = await rmqService.triggerRoute<AccountBuyCourse.Request, AccountBuyCourse.Response>(AccountBuyCourse.topic, { userId, courseId });
    expect(res.paymentLink).toEqual(paymentLink);
    await expect(
      rmqService.triggerRoute<AccountBuyCourse.Request, AccountBuyCourse.Response>(AccountBuyCourse.topic, { userId, courseId })
    ).rejects.toThrowError();
  });

  it('CheckPayment', async () => {
    rmqService.mockReply<PaymentCheck.Response>(PaymentCheck.topic, {
      state: 'success',
    });
    const res = await rmqService.triggerRoute<AccountCheckPayment.Request, AccountCheckPayment.Response>(AccountCheckPayment.topic, { userId, courseId });
    expect(res.status).toEqual('success');
  });


  afterAll(async () => {
    await userRepository.deleteUser(authRegister.email);
    await app.close();
  });
});
