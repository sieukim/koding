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

  private async updateByField(
    user: User,
    fieldName: keyof UserDocument,
    upsert: boolean,
  ): Promise<User> {
    const userDocument = UserDocument.fromModel(user, this.userModel);
    const {
      _id,
      nickname,
      email,
      isEmailUser,
      isGithubUser,
      githubUserInfo,
      githubUserIdentifier,
      githubUrl,
      followerNicknames,
      followingNicknames,
      createdAt,
      passwordResetToken,
      githubSignupVerified,
      githubSignupVerifyToken,
      password,
      portfolioUrl,
      blogUrl,
      emailSignupVerified,
      emailSignupVerifyToken,
    } = userDocument.toJSON();
    const set = {
      nickname,
      email,
      isEmailUser,
      isGithubUser,
      githubUserInfo,
      githubUserIdentifier,
      githubUrl,
      followerNicknames,
      followingNicknames,
      createdAt,
      passwordResetToken,
      githubSignupVerified,
      githubSignupVerifyToken,
      password,
      portfolioUrl,
      blogUrl,
      emailSignupVerified,
      emailSignupVerifyToken,
    };
    const unset = {};
    if (set[fieldName]) delete set[fieldName];
    if (upsert === false)
      for (const key in set) {
        if (set[key] === undefined) {
          delete set[key];
          unset[key] = "";
        }
      }

    await this.userModel
      .updateOne(
        { [fieldName]: userDocument[fieldName] },
        {
          $set: set,
          $unset: unset,
        },
        { upsert },
      )
      .exec();
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
