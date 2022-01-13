import { AggregateRoot } from "@nestjs/cqrs";
import { PickType } from "@nestjs/swagger";
import { currentTime } from "../common/utils/current-time.util";
import { compare, hash } from "bcrypt";
import { v1 } from "uuid";
import crypto from "crypto";
import { BadRequestException } from "@nestjs/common";
import { SendVerificationEmailEvent } from "../users/events/send-verification-email.event";
import { SendPasswordResetEmailEvent } from "../users/events/send-password-reset-email.event";
import { GithubUserInfo } from "../schemas/user.schema";

// export class GithubRepositoryInfo {
//   @ApiProperty({
//     description: "리포지토리 이름",
//     example: "koding",
//   })
//   @Prop()
//   name: string;
//
//   @IsUrl()
//   @ApiProperty({
//     description: "리포지토리 주소",
//     example: "koding",
//   })
//   @Prop()
//   htmlUrl: string;
//
//   @ApiProperty({
//     description: "리포지토리 설명",
//     example: "개발자 커뮤니티 🐾",
//   })
//   @Prop()
//   description?: string;
//
//   @Min(0)
//   @IsNumber()
//   @ApiProperty({
//     description: "리포지토리 스타 수",
//     example: 23,
//   })
//   @Prop()
//   starCount: number;
// }
//
// export class GithubUserInfo {
//   @Prop()
//   githubId: string;
//
//   @IsUrl()
//   @ApiProperty({
//     description: "깃허브 프로필 사진 url",
//     example: "https://avatars.githubusercontent.com/u/11111111",
//   })
//   @Prop()
//   avatarUrl: string;
//
//   @ApiProperty({
//     description: "유저 이름",
//     example: "홍길동",
//   })
//   @Prop()
//   name?: string;
//
//   @IsEmail()
//   @ApiProperty({
//     description: "깃허브 회원가입 이메일",
//     example: "test@test.com",
//   })
//   @Prop()
//   email: string;
//
//   @ApiProperty({
//     description: "소유한 리포지토리들의 정보",
//     type: [GithubRepositoryInfo],
//   })
//   @Prop({ type: [GithubRepositoryInfo] })
//   repositories: GithubRepositoryInfo[];
// }

export class User extends AggregateRoot {
  private static readonly round = 10;
  email: string;
  nickname: string;
  password?: string;
  blogUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  isGithubUser: boolean;
  isEmailUser: boolean;
  githubUserIdentifier?: number;
  githubUserInfo?: GithubUserInfo;
  emailSignupVerifyToken?: string;
  emailSignupVerified: boolean;
  githubSignupVerifyToken?: string;
  githubSignupVerified: boolean;
  passwordResetToken?: string;
  createdAt: Date;
  followings: (PartialUser | User)[];
  followers: (PartialUser | User)[];

  constructor(param: {
    email: string;
    nickname: string;
    password?: string;
    blogUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    isEmailUser: boolean;
  });

  constructor(param: {
    email: string;
    isGithubUser: boolean;
    githubUserIdentifier?: number;
    githubUserInfo?: GithubUserInfo;
  });

  constructor(param: {
    email: string;
    nickname: string;
    password?: string;
    blogUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    isGithubUser: boolean;
    isEmailUser: boolean;
    githubUserIdentifier?: number;
    githubUserInfo?: GithubUserInfo;
    emailSignupVerifyToken?: string;
    emailSignupVerified: boolean;
    githubSignupVerifyToken?: string;
    githubSignupVerified: boolean;
    passwordResetToken?: string;
    createdAt: Date;
    followings: (PartialUser | User)[];
    followers: (PartialUser | User)[];
  });

  constructor(param: {
    email: string;
    nickname: string;
    password?: string;
    blogUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    isGithubUser: boolean;
    isEmailUser: boolean;
    githubUserIdentifier?: number;
    githubUserInfo?: GithubUserInfo;
    emailSignupVerifyToken?: string;
    emailSignupVerified?: boolean;
    githubSignupVerifyToken?: string;
    githubSignupVerified?: boolean;
    passwordResetToken?: string;
    createdAt?: Date;
    followings?: (PartialUser | User)[];
    followers?: (PartialUser | User)[];
  }) {
    super();
    this.email = param.email;
    this.nickname = param.nickname;
    this.password = param.password;
    this.blogUrl = param.blogUrl;
    this.githubUrl = param.githubUrl;
    this.portfolioUrl = param.portfolioUrl;
    this.isGithubUser = param.isGithubUser;
    this.isEmailUser = param.isEmailUser;
    this.githubUserIdentifier = param.githubUserIdentifier;
    this.githubUserInfo = param.githubUserInfo;
    this.emailSignupVerifyToken = param.emailSignupVerifyToken;
    this.emailSignupVerified = param.emailSignupVerified ?? false;
    this.githubSignupVerifyToken = param.githubSignupVerifyToken;
    this.githubSignupVerified = param.githubSignupVerified ?? false;
    this.passwordResetToken = param.passwordResetToken;
    this.createdAt = param.createdAt ?? currentTime();
    this.followings = param.followings ?? [];
    this.followers = param.followers ?? [];
  }

  get followingsCount() {
    return this.followings.length;
  }

  get followersCount() {
    return this.followers.length;
  }

  get isVerifiedUser(): boolean {
    // 이메일 유저 & 이메일 인증 완료
    if (this.isEmailUser && this.emailSignupVerified) return true;
    // 깃허브 유저 & 깃허브 인증 완료
    if (this.isGithubUser && this.githubSignupVerified) return true;
    return false;
  }

  async hashPassword() {
    if (this.password) this.password = await hash(this.password, User.round);
    return this;
  }

  async comparePassword(password: string) {
    return compare(password, this.password);
  }

  setNewGithubSignupVerifyToken() {
    this.githubSignupVerifyToken = v1();
  }

  verifyGithubSignup({
    verifyToken,
    newNickname,
  }: {
    verifyToken: string;
    newNickname: string;
  }) {
    if (!this.isGithubUser)
      throw new BadRequestException("깃허브 연동 사용자가 아닙니다");
    if (this.githubSignupVerifyToken !== verifyToken)
      throw new BadRequestException("유효하지 않은 토큰");
    this.nickname = newNickname;
    this.githubSignupVerified = true;
    this.githubSignupVerifyToken = undefined;
  }

  verifyPasswordResetToken(verifyToken: string) {
    if (this.passwordResetToken !== verifyToken)
      throw new BadRequestException("유효하지 않은 토큰");
  }

  async verifyResetPassword({
    verifyToken,
    newPassword,
  }: {
    verifyToken: string;
    newPassword: string;
  }) {
    this.verifyPasswordResetToken(verifyToken);
    this.password = newPassword;
    this.passwordResetToken = undefined;
    await this.hashPassword();
  }

  sendVerificationEmail() {
    this.setNewEmailSignupVerifyToken();
    this.apply(
      new SendVerificationEmailEvent(
        this.email,
        this.nickname,
        this.emailSignupVerifyToken,
      ),
    );
  }

  sendPasswordResetEmail() {
    this.setNewPasswordResetToken();
    this.apply(
      new SendPasswordResetEmailEvent(
        this.email,
        this.nickname,
        this.emailSignupVerifyToken,
      ),
    );
  }

  linkAccountWithGithub(
    githubUserIdentifier: number,
    githubUserInfo: GithubUserInfo,
  ) {
    this.githubUserIdentifier = githubUserIdentifier;
    this.githubUserInfo = githubUserInfo;
    this.githubSignupVerified = true;
    this.isGithubUser = true;
  }

  verifyEmailSignup(verifyToken: string) {
    if (!this.isEmailUser)
      throw new BadRequestException("이메일 가입 유저가 아닙니다");
    console.log(
      "this:",
      this.emailSignupVerifyToken,
      "verifyToken:",
      verifyToken,
    );
    if (this.emailSignupVerifyToken !== verifyToken)
      throw new BadRequestException("잘못된 인증 토큰입니다");
    this.emailSignupVerifyToken = undefined;
    this.emailSignupVerified = true;
  }

  private setNewPasswordResetToken() {
    const randomDigits = Array.from({ length: 6 }, () =>
      crypto.randomInt(0, 9),
    );
    this.passwordResetToken = randomDigits.join("");
  }

  private setNewEmailSignupVerifyToken() {
    this.emailSignupVerifyToken = v1();
  }
}

export class PartialUser extends PickType(User, ["nickname"] as const) {
  constructor(param: { nickname: string }) {
    super();
    this.nickname = param.nickname;
  }
}
