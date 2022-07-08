import { BuyCourseSagaState } from './buy-course.state';
import { UserEntity } from '../entities/user.entity';
import { CourseGetCourse, PaymentCheck, PaymentGenerateLink } from '@purple/contracts';
import { PurchaseState } from '@purple/interfaces';

export class BuyCourseSagaStateStarted extends BuyCourseSagaState {
  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Cancelled, this.saga.courseId);
    return { user: this.saga.user };
  }

  public async checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('The payment is not yet started');
  }

  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    const {course} = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
      id: this.saga.courseId,
    });
    if (!course) {
      throw new Error('The course does not exist');
    }
    if(course.price === 0) {
      this.saga.setState(PurchaseState.Purchased, course._id);
      return { paymentLink: null, user: this.saga.user };
    }
    const { paymentLink } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      userId: this.saga.user._id,
      courseId: course._id,
      sum: course.price,
    });
    this.saga.setState(PurchaseState.WaitingForPayment, course._id);
    return { paymentLink, user: this.saga.user };
  }
}

export class BuyCourseSagaStateWaitingForPayment extends BuyCourseSagaState {
  cancel(): Promise<{ user: UserEntity }> {
    throw new Error('The payment in progress. Can not cancel');
  }

  public async checkPayment(): Promise<{ user: UserEntity }> {
    const { state } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId,
    });
    if (state === 'canceled') {
      this.saga.setState(PurchaseState.Cancelled, this.saga.courseId);
      return { user: this.saga.user };
    }
    if(state !== 'success') {
      return { user: this.saga.user };
    }
    this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    return { user: this.saga.user };
  }

  pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('The payment in progress. Can not create link');
  }

}

export class BuyCourseSagaStatePurchased extends BuyCourseSagaState {
  cancel(): Promise<{ user: UserEntity }> {
    throw new Error('The payment is finished. Can not cancel');
  }

  public async checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Must not check payment after payment is finished');
  }

  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('The payment is already paid');
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSagaState {
  cancel(): Promise<{ user: UserEntity }> {
    throw new Error('The payment is finished. Can not cancel');
  }

  public async checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Must not check payment after payment is canceled');
  }

  public async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }
}
