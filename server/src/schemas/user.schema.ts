import { Document, Model, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsUrl, Min } from "class-validator";
import { currentTime } from "../common/utils/current-time.util";
import { User } from "../models/user.model";
import { Expose, plainToClass, Transform, Type } from "class-transformer";
import { Role } from "../models/role.enum";

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

@Expose({ toClassOnly: true })
@Schema({
  id: false,
  _id: true,
  versionKey: false,
  autoIndex: true,
  timestamps: { createdAt: true, updatedAt: false, currentTime: currentTime },
})
export class UserDocument extends Document {
  _id: Types.ObjectId;

  @Prop({ required: false, index: { unique: true, sparse: true } })
  nickname: string;

  @Prop({ unique: true, index: { unique: true } })
  email: string;

  @Prop()
  password?: string;

  @Prop({ type: Boolean, default: false })
  isBlogUrlPublic: boolean;

  @Prop({ required: false })
  blogUrl?: string;

  @Prop({ type: Boolean, default: false })
  isGithubUrlPublic: boolean;

  @Prop({ required: false })
  githubUrl?: string;

  @Prop({ type: Boolean, default: false })
  isPortfolioUrlPublic: boolean;

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

  @Prop({ required: false })
  passwordResetToken?: string;

  @Prop({
    type: [{ type: String, enum: Object.values(Role) }],
    default: [Role.User],
  })
  roles: Role[];

  @Prop({
    type: Date,
    required: false,
  })
  accountSuspendedUntil: Date;

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

  @Type(() => UserDocument)
  @Transform(
    ({ value }) =>
      value instanceof UserDocument ? UserDocument.toModel(value) : value,
    { toClassOnly: true },
  )
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

  @Type(() => UserDocument)
  @Transform(
    ({ value }) =>
      value instanceof UserDocument ? UserDocument.toModel(value) : value,
    { toClassOnly: true },
  )
  followers?: UserDocument[];

  static toModel(userDocument: UserDocument): User {
    return plainToClass(User, userDocument, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  static fromModel(user: User, model: Model<UserDocument>): UserDocument {
    return new model(user);
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
