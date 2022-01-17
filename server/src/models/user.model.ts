import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty, ApiPropertyOptional, PickType } from "@nestjs/swagger";
import { currentTime } from "../common/utils/current-time.util";
import { compare, hash } from "bcrypt";
import { v1 } from "uuid";
import { randomInt } from "crypto";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { EmailUserSignedUpEvent } from "../users/events/email-user-signed-up.event";
import { ResetPasswordRequestedEvent } from "../users/events/reset-password-requested.event";
import { GithubUserInfo } from "../schemas/user.schema";
import { IsBoolean, IsDate, IsEmail, IsNumber, IsOptional, IsString, IsUrl, Length, Matches } from "class-validator";
import { ChangeProfileRequestDto } from "../users/dto/change-profile-request.dto";

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

  @IsEmail()
  @ApiProperty({
    example: "test@test.com",
    description: "유저 이메일, 중복 불가",
    type: String,
  })
  email: string;

  @IsString()
  @Length(2, 10)
  @Matches("[A-Za-z0-9가-힣]*")
  @ApiProperty({
    example: "testNick",
    description: "유저 닉네임, 중복 불가",
    pattern: "[A-Za-z0-9가-힣]*",
    minLength: 2,
    maxLength: 10,
    type: String,
  })
  nickname: string;

  @Length(8, 16)
  @IsString()
  @ApiProperty({
    example: "abcd1234",
    description: "유저 비밀번호",
    minLength: 8,
    maxLength: 16,
    type: String,
  })
  password?: string;

  @IsBoolean()
  @ApiPropertyOptional({
    description: "유저 블로그 주소 공개여부",
    type: Boolean,
    default: false,
  })
  isBlogUrlPublic: boolean;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://blog.naver.com/test",
    description: "유저 블로그 주소. 공개 여부에 따라 값이 없을 수 있음",
    type: String,
  })
  blogUrl?: string;

  @IsBoolean()
  @ApiPropertyOptional({
    description: "유저 깃허브 주소 공개여부",
    type: Boolean,
    default: false,
  })
  isGithubUrlPublic: boolean;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://test.github.com",
    description: "유저 깃허브 주소. 공개 여부에 따라 값이 없을 수 있음",
    type: String,
  })
  githubUrl?: string;

  @IsBoolean()
  @ApiPropertyOptional({
    description: "유저 포트폴리오 주소 공개여부",
    type: Boolean,
    default: false,
  })
  isPortfolioUrlPublic: boolean;

  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://linktr.ee/test",
    description: "유저 포트폴리오 주소. 공개 여부에 따라 값이 없을 수 있음",
    type: String,
  })
  portfolioUrl?: string;

  @ApiProperty({
    description: "깃허브 연동 유저 여부",
    type: Boolean,
  })
  isGithubUser: boolean;

  @ApiProperty({
    description: "이메일 가입 유저 여부",
    type: Boolean,
  })
  isEmailUser: boolean;

  @ApiProperty({
    description: "깃허브 API에서 제공하는 깃허브 유저 고유 넘버",
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  githubUserIdentifier?: number;

  @IsOptional()
  @ApiProperty({
    description: "깃허브 연동 정보",
    type: GithubUserInfo,
  })
  githubUserInfo?: GithubUserInfo;

  @IsString()
  emailSignupVerifyToken?: string;

  @ApiProperty({
    description: "이메일 사용자인 경우, 이메일 인증 여부",
    type: Boolean,
  })
  emailSignupVerified: boolean;

  @IsString()
  githubSignupVerifyToken?: string;

  @ApiProperty({
    description: "깃허브 사용자인 경우, 닉네임 설정 여부",
    type: Boolean,
  })
  githubSignupVerified: boolean;

  @IsString()
  passwordResetToken?: string;

  @IsDate()
  @ApiProperty({
    description: "가입일",
    type: Date,
  })
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
    isBlogUrlPublic: boolean;
    blogUrl?: string;
    isGithubUrlPublic: boolean;
    githubUrl?: string;
    isPortfolioUrlPublic: boolean;
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
    isBlogUrlPublic?: boolean;
    blogUrl?: string;
    isGithubUrlPublic?: boolean;
    githubUrl?: string;
    isPortfolioUrlPublic?: boolean;
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
    this.isBlogUrlPublic = param.isBlogUrlPublic ?? false;
    this.blogUrl = param.blogUrl;
    this.isGithubUrlPublic = param.isGithubUrlPublic ?? false;
    this.githubUrl = param.githubUrl;
    this.isPortfolioUrlPublic = param.isPortfolioUrlPublic ?? false;
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

  @ApiProperty({
    description: "팔로우 하는 사용자 수",
    type: Number,
    minimum: 0,
  })
  get followingsCount() {
    return this.followings.length;
  }

  @ApiProperty({
    description: "팔로워 수",
    type: Number,
    minimum: 0,
  })
  get followersCount() {
    return this.followers.length;
  }

  @ApiProperty({ description: "회원가입 인증 여부", type: Boolean })
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

  async changeProfile(requestUser: User, request: ChangeProfileRequestDto) {
    this.verifySameUser(requestUser);
    const {
      githubUrl,
      isGithubUrlPublic,
      isBlogUrlPublic,
      blogUrl,
      isPortfolioUrlPublic,
      portfolioUrl,
    } = request;
    this.githubUrl = githubUrl ?? this.githubUrl;
    this.blogUrl = blogUrl ?? this.blogUrl;
    this.portfolioUrl = portfolioUrl ?? this.portfolioUrl;
    this.isGithubUrlPublic = isGithubUrlPublic ?? this.isGithubUrlPublic;
    this.isBlogUrlPublic = isBlogUrlPublic ?? this.isBlogUrlPublic;
    this.isPortfolioUrlPublic =
      isPortfolioUrlPublic ?? this.isPortfolioUrlPublic;
  }

  private verifySameUser(user: User) {
    if (this.nickname !== user.nickname)
      throw new ForbiddenException("사용자에 대한 권한이 없습니다");
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
      new EmailUserSignedUpEvent(
        this.email,
        this.nickname,
        this.emailSignupVerifyToken,
      ),
    );
  }

  sendPasswordResetEmail() {
    this.setNewPasswordResetToken();
    this.apply(
      new ResetPasswordRequestedEvent(
        this.email,
        this.nickname,
        this.passwordResetToken,
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
    const randomDigits = Array.from({ length: 6 }, () => randomInt(0, 9));
    this.passwordResetToken = randomDigits.join("");
  }

  private setNewEmailSignupVerifyToken() {
    this.emailSignupVerifyToken = v1();
  }

  async changePassword(
    requestUser: User,
    currentPassword: string,
    newPassword: string,
  ) {
    this.verifySameUser(requestUser);
    if (!(await this.comparePassword(currentPassword)))
      throw new BadRequestException("잘못된 확인 비밀번호");
  }
}

export class PartialUser extends PickType(User, ["nickname"] as const) {
  constructor(param: { nickname: string }) {
    super();
    this.nickname = param.nickname;
  }
}
