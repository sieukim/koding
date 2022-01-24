import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "../schemas/user.schema";
import { Model, Types } from "mongoose";
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
    return this.updateByField(user, "nickname", true);
  }

  async persistByEmail(user: User): Promise<User> {
    return this.updateByField(user, "email", true);
  }

  async update(user: User): Promise<User> {
    return this.updateByField(user, "nickname", false);
  }

  async updateByEmail(user: User): Promise<User> {
    return this.updateByField(user, "email", false);
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

  async remove(user: User): Promise<boolean> {
    const deleteResult = await this.userModel
      .deleteOne({ nickname: user.nickname })
      .exec();
    return deleteResult.deletedCount === 1;
  }

  private async updateByField(
    user: User,
    fieldName: keyof UserDocument,
    upsert: boolean,
  ): Promise<User> {
    // TODO: 유저 모델과 스키마에 _id 를 추가하여 replace 를 위한 _id 조회를 없애기
    const userDocument = this.fromModel(user, this.userModel);
    const prevUserDocument = await this.userModel
      .findOne({
        [fieldName]: userDocument[fieldName],
      })
      .exec();
    userDocument._id = prevUserDocument?.get("_id") ?? new Types.ObjectId();
    await this.userModel
      .replaceOne({ _id: userDocument._id }, userDocument, {
        upsert,
      })
      .exec();
    return user;
  }
}
