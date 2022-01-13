import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "../schemas/user.schema";
import { Model } from "mongoose";
import { User } from "../models/user.model";
import { MongooseBaseRepository } from "../common/repository/mongoose-base.repository";

@Injectable()
export class UsersRepository extends MongooseBaseRepository<
  User,
  UserDocument
> {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
  ) {
    super(UserDocument.toModel, UserDocument.fromModel, userModel);
  }

  async persist(user: User): Promise<User> {
    const userDocument = UserDocument.fromModel(user, this.userModel);
    const { _id, nickname, ...rest } = userDocument.toJSON();
    await this.userModel.updateOne({ nickname }, rest, { upsert: true });
    return user;
  }

  async persistByEmail(user: User): Promise<User> {
    const userDocument = UserDocument.fromModel(user, this.userModel);
    const { _id, email, ...rest } = userDocument.toJSON();
    await this.userModel.updateOne({ email }, rest, { upsert: true });
    return user;
  }

  async update(user: User): Promise<User> {
    const userDocument = UserDocument.fromModel(user, this.userModel);
    const { _id, email, ...rest } = userDocument.toJSON();
    await this.userModel.updateOne({ email }, rest).exec();
    return user;
  }

  async updateByEmail(user: User): Promise<User> {
    const userDocument = UserDocument.fromModel(user, this.userModel);
    const { _id, email, ...rest } = userDocument.toJSON();
    await this.userModel.updateOne({ email }, rest).exec();
    return user;
  }

  async findByNickname(nickname: string, populate?: (keyof User)[]) {
    return this.findOneWith({ nickname: { eq: nickname } }, populate);
  }

  async findByEmail(email: string, populate?: (keyof User)[]) {
    return this.findOneWith({ email: { eq: email } }, populate);
  }

  async followUser(from: User, to: User) {
    const fromUserDocument = await this.userModel
      .findOneAndUpdate(
        { nickname: from.nickname },
        { $addToSet: { followingNicknames: to.nickname } },
      )
      .exec();
    const toUserDocument = await this.userModel
      .findOneAndUpdate(
        { nickname: to.nickname },
        { $addToSet: { followerNicknames: from.nickname } },
      )
      .exec();
    return {
      from: UserDocument.toModel(fromUserDocument),
      to: UserDocument.toModel(toUserDocument),
    };
  }

  async unfollowUser(from: User, to: User) {
    const fromUserDocument = await this.userModel
      .findOneAndUpdate(
        { nickname: from.nickname },
        { $pull: { followingNicknames: to.nickname } },
      )
      .exec();
    const toUserDocument = await this.userModel
      .findOneAndUpdate(
        { nickname: to.nickname },
        { $pull: { followerNicknames: from.nickname } },
      )
      .exec();
    return {
      from: UserDocument.toModel(fromUserDocument),
      to: UserDocument.toModel(toUserDocument),
    };
  }
}
