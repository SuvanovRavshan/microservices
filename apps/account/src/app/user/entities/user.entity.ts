import { IDomainEvent, IUser, IUserCourses, PurchaseState, UserRole } from '@purple/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';
import { AccountChangedCourse } from '@purple/contracts';

export class UserEntity implements IUser {
  _id?: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses: IUserCourses[];
  events: IDomainEvent[] = [];

  constructor(user:IUser) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.passwordHash = user.passwordHash;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public setCourseStatus(courseId: string, state: PurchaseState) {
    const exist = this.courses.find(course => course.courseId === courseId);
    if(!exist) {
      this.courses.push({
        courseId,
        purchaseState: state,
      });
      return this;
    }
    if(state === PurchaseState.Cancelled) {
      this.courses = this.courses.filter(course => course.courseId !== courseId);
      return this;
    }
    this.courses = this.courses.map(course => {
      if (course.courseId === courseId) {
        course.purchaseState = state;
      }
      return course;
    });
    this.events.push({
      data: {
        courseId,
        userId: this._id,
        state,
      },
      topic: AccountChangedCourse.topic
    });
    return this;
  }

  getCourseState(courseId: string): PurchaseState {
    const course = this.courses.find(course => course.courseId === courseId);
    return course ? course.purchaseState : PurchaseState.Started;
  }

  public async setPassword(password: string): Promise<this> {
    const salt = await genSalt(10);
    this.passwordHash = await hash(password, salt);
    return this;
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName,
    }
  }

  public async validatePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }
}
