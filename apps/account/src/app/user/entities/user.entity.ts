import { IUser, IUserCourses, PurchaseState, UserRole } from '@purple/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';

export class UserEntity implements IUser {
  _id?: string;
  displayName: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  courses: IUserCourses[];

  constructor(user:IUser) {
    this._id = user._id;
    this.displayName = user.displayName;
    this.passwordHash = user.passwordHash;
    this.email = user.email;
    this.role = user.role;
    this.courses = user.courses;
  }

  public addCourse(courseId: string) {
    const exist = this.courses.find(course => course._id === courseId);
    if (exist) {
      throw new Error('Course already added');
    }
    this.courses.push({
      courseId,
      purchaseState: PurchaseState.Started,
    });
  }

  public deleteCourse(courseId: string) {
    const exist = this.courses.filter(course => course._id === courseId);
    if (!exist) {
      throw new Error('Course not found');
    }
    this.courses = this.courses.filter(course => course._id !== courseId);
  }

  public updateCourseStatus(courseId: string, state: PurchaseState) {
    this.courses = this.courses.map(course => {
      if (course._id === courseId) {
        course.purchaseState = state;
      }
      return course;
    });
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
