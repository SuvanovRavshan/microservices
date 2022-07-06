import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.model';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async createUser(user: UserEntity): Promise<User> {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async updateUser({ _id, ...rest }: UserEntity): Promise<User> {
    return this.userModel.findByIdAndUpdate(_id, rest, { new: true }).exec();
  }

  async findUser(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string): Promise<User> {
    return this.userModel.findById(id).select(['-passwordHash']).exec();
  }

  async deleteUser(email: string) {
    return this.userModel.deleteOne({ email }).exec();
  }
}
