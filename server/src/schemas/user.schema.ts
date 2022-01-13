import { Document, Model, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsUrl, Min } from "class-validator";
import { currentTime } from "../common/utils/current-time.util";
import { PartialUser, User } from "../models/user.model";

export class GithubRepositoryInfo {
  @ApiProperty({
    description: "리포지토리 이름",
    example: "koding",
  })
  @Prop()
  name: string;

  @IsUrl()
  @ApiProperty({
    description: "리포지토리 주소",
    example: "koding",
  })
  @Prop()
  htmlUrl: string;

  @ApiProperty({
    description: "리포지토리 설명",
    example: "개발자 커뮤니티 🐾",
  })
  @Prop()
  description?: string;

  @Min(0)
  @IsNumber()
  @ApiProperty({
    description: "리포지토리 스타 수",
    example: 23,
  })
  @Prop()
  starCount: number;
}

export class GithubUserInfo {
  @Prop()
  githubId: string;

  @IsUrl()
  @ApiProperty({
    description: "깃허브 프로필 사진 url",
    example: "https://avatars.githubusercontent.com/u/11111111",
  })
  @Prop()
  avatarUrl: string;

  @ApiProperty({
    description: "유저 이름",
    example: "홍길동",
  })
  @Prop()
  name?: string;

  @IsEmail()
  @ApiProperty({
    description: "깃허브 회원가입 이메일",
    example: "test@test.com",
  })
  @Prop()
  email: string;

  @ApiProperty({
    description: "소유한 리포지토리들의 정보",
    type: [GithubRepositoryInfo],
  })
  @Prop({ type: [GithubRepositoryInfo] })
  repositories: GithubRepositoryInfo[];
}

@Schema({
  id: false,
  _id: true,
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: true, updatedAt: false, currentTime: currentTime },
})
export class UserDocument extends Document {
  private static readonly round = 10;

  _id: Types.ObjectId;

  @Prop({ required: false, index: { unique: true, sparse: true } })
  nickname: string;

  @Prop({ unique: true, index: { unique: true } })
  email: string;

  @Prop()
  password?: string;

  @Prop({ required: false })
  blogUrl?: string;

  @Prop({ required: false })
  githubUrl?: string;

  @Prop({ required: false })
  portfolioUrl?: string;

  @Prop({ default: false })
  isGithubUser: boolean;

  @Prop({ default: false })
  isEmailUser: boolean;

  @Prop({
    required: false,
    // index: { unique: true, sparse:true }
  })
  githubUserIdentifier?: number;

  @Prop({ required: false, type: GithubUserInfo })
  githubUserInfo?: GithubUserInfo;

  @Prop({ required: false })
  emailSignupVerifyToken?: string;

  @Prop({ default: false })
  emailSignupVerified: boolean;

  @Prop({ required: false })
  githubSignupVerifyToken?: string;

  @Prop({ default: false })
  githubSignupVerified: boolean;

  @Prop()
  passwordResetToken?: string;
  글;

  createdAt: Date;

  @Prop({
    type: [
      {
        type: String,
      },
    ],
    default: [],
  })
  followingNicknames: string[];

  followings?: UserDocument[];

  @Prop({
    type: [
      {
        type: String,
      },
    ],
    default: [],
  })
  followerNicknames: string[];

  followers?: UserDocument[];

  static toModel(userDocument: UserDocument): User {
    const {
      followings,
      followers,
      followingNicknames,
      followerNicknames,
      password,
      passwordResetToken,
      isEmailUser,
      email,
      isGithubUser,
      githubUserInfo,
      githubUserIdentifier,
      githubUrl,
      nickname,
      blogUrl,
      emailSignupVerifyToken,
      githubSignupVerifyToken,
      emailSignupVerified,
      githubSignupVerified,
      portfolioUrl,
      createdAt,
    } = userDocument;
    return new User({
      password,
      passwordResetToken,
      isEmailUser,
      email,
      isGithubUser,
      githubUserInfo,
      githubUserIdentifier,
      githubUrl,
      nickname,
      blogUrl,
      emailSignupVerifyToken,
      githubSignupVerifyToken,
      emailSignupVerified,
      githubSignupVerified,
      portfolioUrl,
      createdAt,
      followings: followings
        ? followings.map(UserDocument.toModel)
        : followingNicknames.map((nickname) => new PartialUser({ nickname })),
      followers: followers
        ? followers.map(UserDocument.toModel)
        : followerNicknames.map((nickname) => new PartialUser({ nickname })),
    });
  }

  static fromModel(user: User, model: Model<UserDocument>): UserDocument {
    const {
      followings,
      followers,
      emailSignupVerifyToken,
      githubSignupVerifyToken,
      emailSignupVerified,
      githubSignupVerified,
      isEmailUser,
      email,
      isGithubUser,
      githubUserInfo,
      githubUserIdentifier,
      githubUrl,
      nickname,
      blogUrl,
      createdAt,
      portfolioUrl,
      password,
      passwordResetToken,
    } = user;
    return new model({
      emailSignupVerifyToken,
      githubSignupVerifyToken,
      emailSignupVerified,
      githubSignupVerified,
      isEmailUser,
      email,
      isGithubUser,
      githubUserInfo,
      githubUserIdentifier,
      githubUrl,
      nickname,
      blogUrl,
      createdAt,
      portfolioUrl,
      password,
      passwordResetToken,
      followingNicknames: followings.map(({ nickname }) => nickname),
      followerNicknames: followers.map(({ nickname }) => nickname),
    });
  }
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);

UserSchema.virtual("followings", {
  ref: UserDocument.name,
  foreignField: "nickname",
  localField: "followingNicknames",
});
UserSchema.virtual("followers", {
  ref: UserDocument.name,
  foreignField: "nickname",
  localField: "followerNicknames",
});
// UserSchema.virtual("nickname")
//   .get(function () {
//     return this._id;
//   })
//   .set(function (value) {
//     this._id = value;
//   });
UserSchema.set("toObject", { virtuals: true });
UserSchema.set("toJSON", { virtuals: true });
