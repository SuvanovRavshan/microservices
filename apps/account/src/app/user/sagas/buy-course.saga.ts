import { UserEntity } from '../entities/user.entity';
import { RMQService } from 'nestjs-rmq';
import { PurchaseState } from '@purple/interfaces';
import { BuyCourseSagaState } from './buy-course.state';

export class BuyCourseSaga {
  private state: BuyCourseSagaState;

  constructor(private user: UserEntity, private courseId: string, private rmqService: RMQService) {

  }

  setState(state: PurchaseState) {
    switch (state) {
      case PurchaseState.Started: {
        break;
      }
      case PurchaseState.WaitingForPayment: {
        break;
      }
      case PurchaseState.Purchased: {
        break;
      }
      case PurchaseState.Cancelled:{
        break;
      }
    }
    this.state.setContext(this);
    this.user.updateCourseStatus(this.courseId, state);
  }

  getState() {
    return this.state;
  }
}
