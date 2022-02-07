import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { getCurrentTime } from "../common/utils/time.util";
import { compare, hash } from "bcrypt";
import { v1 } from "uuid";
import { randomInt } from "crypto";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { EmailUserSignedUpEvent } from "../users/events/email-user-signed-up.event";
import { ResetPasswordRequestedEvent } from "../users/events/reset-password-requested.event";
import { GithubUserInfo } from "../schemas/user.schema";
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
} from "class-validator";
import { ChangeProfileRequestDto } from "../users/dto/change-profile-request.dto";
import { Expose, Transform, Type } from "class-transformer";
import { Role } from "./role.enum";
import { ProfileAvatarChangedEvent } from "../upload/event/profile-avatar-changed.event";

export class User extends AggregateRoot {
  private static readonly ROUND = 10;

  @Expose()
  @IsEmail()
  @ApiProperty({
    example: "vvsos1@hotmail.co.kr",
    description: "사용자 이메일, 중복 불가",
    type: String,
  })
  email: string;

  @Expose()
  @IsString()
  @Length(2, 10)
  @Matches("[A-Za-z0-9가-힣]*")
  @ApiProperty({
    example: "testNick",
    description: "사용자 닉네임, 중복 불가",
    pattern: "[A-Za-z0-9가-힣]*",
    minLength: 2,
    maxLength: 10,
    type: String,
  })
  nickname: string;

  @Expose()
  @Length(8, 16)
  @IsString()
  @ApiProperty({
    example: "11111111",
    description: "사용자 비밀번호",
    minLength: 8,
    maxLength: 16,
    type: String,
  })
  password?: string;

  @Expose()
  @IsBoolean()
  @ApiPropertyOptional({
    description: "사용자 블로그 주소 공개여부",
    type: Boolean,
    default: false,
  })
  isBlogUrlPublic: boolean;

  @Transform(
    ({ value, obj, options }) => {
      if (options?.groups?.includes("myInfo")) return value;
      else if ((obj as User).isBlogUrlPublic) return value;
      return;
    },
    {
      toClassOnly: true,
    },
  )
  @Expose()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://blog.naver.com/test",
    description: "사용자 블로그 주소. 공개 여부에 따라 값이 없을 수 있음",
    type: String,
  })
  blogUrl?: string;

  @Expose()
  @IsBoolean()
  @ApiPropertyOptional({
    description: "사용자 깃허브 주소 공개여부",
    type: Boolean,
    default: false,
  })
  isGithubUrlPublic: boolean;

  @Transform(
    ({ value, obj }: { value?: string; obj: User }) =>
      obj.isGithubUrlPublic ? value : undefined,
    {
      toClassOnly: true,
      groups: ["user"],
    },
  )
  @Expose()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://test.github.com",
    description: "사용자 깃허브 주소. 공개 여부에 따라 값이 없을 수 있음",
    type: String,
  })
  githubUrl?: string;

  @Expose()
  @IsBoolean()
  @ApiPropertyOptional({
    description: "사용자 포트폴리오 주소 공개여부",
    type: Boolean,
    default: false,
  })
  isPortfolioUrlPublic: boolean;

  @Transform(
    ({ value, obj }: { value?: string; obj: User }) =>
      obj.isPortfolioUrlPublic ? value : undefined,
    {
      toClassOnly: true,
      groups: ["user"],
    },
  )
  @Expose()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: "https://linktr.ee/test",
    description: "사용자 포트폴리오 주소. 공개 여부에 따라 값이 없을 수 있음",
    type: String,
  })
  portfolioUrl?: string;

  @Expose()
  @ApiProperty({
    description: "깃허브 연동 사용자 여부",
    type: Boolean,
  })
  isGithubUser: boolean;

  @Expose()
  @ApiProperty({
    description: "이메일 가입 사용자 여부",
    type: Boolean,
  })
  isEmailUser: boolean;

  @Expose()
  @ApiProperty({
    description: "깃허브 API에서 제공하는 깃허브 사용자 고유 넘버",
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  githubUserIdentifier?: number;

  @Type(() => GithubUserInfo)
  @Expose()
  @IsOptional()
  @ApiProperty({
    description: "깃허브 연동 정보",
    type: GithubUserInfo,
  })
  githubUserInfo?: GithubUserInfo;

  @Expose()
  @IsString()
  emailSignupVerifyToken?: string;

  @Expose()
  @ApiProperty({
    description: "이메일 사용자인 경우, 이메일 인증 여부",
    type: Boolean,
  })
  emailSignupVerified: boolean;

  @Expose()
  @IsString()
  githubSignupVerifyToken?: string;

  @Expose()
  @ApiProperty({
    description: "깃허브 사용자인 경우, 닉네임 설정 여부",
    type: Boolean,
  })
  githubSignupVerified: boolean;

  @Expose()
  @IsString()
  passwordResetToken?: string;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "가입일",
    type: Date,
  })
  createdAt: Date;

  @Type(() => String)
  @Expose()
  followingNicknames: string[];

  @Type(() => User)
  @Expose()
  followings?: User[];

  @Type(() => String)
  @Expose()
  followerNicknames: string[];

  @Type(() => User)
  @Expose()
  followers?: User[];

  @Expose()
  @ApiProperty({
    description: "사용자의 권한",
    enum: Object.values(Role),
    isArray: true,
  })
  roles: Role[];

  @Expose()
  @ApiProperty({
    description: "계정 정지 기간",
  })
  accountSuspendedUntil: Date;

  @Expose()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    description: "프로필 사진 URL",
  })
  avatarUrl?: string;

  constructor();
  constructor(param: {
    email: string;
    nickname: string;
    password?: string;
    blogUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    isEmailUser: true;
    avatarUrl?: string;
  });

  constructor(param: {
    email: string;
    isGithubUser: true;
    githubUserIdentifier?: number;
    githubUserInfo?: GithubUserInfo;
  });

  constructor(param?: {
    email: string;
    nickname?: string;
    password?: string;
    blogUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    isEmailUser?: boolean;
    isGithubUser?: boolean;
    githubUserIdentifier?: number;
    githubUserInfo?: GithubUserInfo;
    avatarUrl?: string;
  }) {
    super();
    if (param) {
      this.email = param.email;
      this.nickname = param.nickname;
      this.password = param.password;
      this.isBlogUrlPublic = false;
      this.blogUrl = param.blogUrl;
      this.isGithubUrlPublic = false;
      this.githubUrl = param.githubUrl;
      this.isPortfolioUrlPublic = false;
      this.portfolioUrl = param.portfolioUrl;
      this.isGithubUser = param.isGithubUser;
      this.isEmailUser = param.isEmailUser;
      this.githubUserIdentifier = param.githubUserIdentifier;
      this.githubUserInfo = param.githubUserInfo;
      this.emailSignupVerified = false;
      this.githubSignupVerified = false;
      this.followingNicknames = [];
      this.followerNicknames = [];
      this.avatarUrl = param.avatarUrl;
      this.createdAt = getCurrentTime();
      this.roles = [Role.User];
      if (this.isEmailUser) {
        if (this.avatarUrl)
          this.apply(
            new ProfileAvatarChangedEvent(
              this.nickname,
              undefined,
              this.avatarUrl,
            ),
          );
        this.sendVerificationEmail();
      }
    }
  }

  @Expose()
  @ApiProperty({
    description: "팔로우 하는 사용자 수",
    type: Number,
    minimum: 0,
  })
  get followingsCount() {
    return this.followingNicknames.length;
  }

  @Expose()
  @ApiProperty({
    description: "팔로워 수",
    type: Number,
    minimum: 0,
  })
  get followersCount() {
    return this.followerNicknames.length;
  }

  @Expose({ toClassOnly: true })
  @ApiProperty({ description: "회원가입 인증 여부", type: Boolean })
  get isVerifiedUser(): boolean {
    // 이메일 사용자 & 이메일 인증 완료
    if (this.isEmailUser && this.emailSignupVerified) return true;
    // 깃허브 사용자 & 깃허브 인증 완료
    if (this.isGithubUser && this.githubSignupVerified) return true;
    return false;
  }

  async hashPassword() {
    if (this.password) this.password = await hash(this.password, User.ROUND);
    return this;
  }

  async comparePassword(password: string) {
    return compare(password, this.password);
  }

  changeProfile(requestUser: User, request: ChangeProfileRequestDto) {
    this.verifySameUser(requestUser);
    const {
      githubUrl,
      isGithubUrlPublic,
      isBlogUrlPublic,
      blogUrl,
      isPortfolioUrlPublic,
      portfolioUrl,
      avatarUrl,
    } = request;
    this.githubUrl = githubUrl ?? this.githubUrl;
    this.blogUrl = blogUrl ?? this.blogUrl;
    this.portfolioUrl = portfolioUrl ?? this.portfolioUrl;
    this.isGithubUrlPublic = isGithubUrlPublic ?? this.isGithubUrlPublic;
    this.isBlogUrlPublic = isBlogUrlPublic ?? this.isBlogUrlPublic;
    this.isPortfolioUrlPublic =
      isPortfolioUrlPublic ?? this.isPortfolioUrlPublic;
    if (avatarUrl)
      this.apply(
        new ProfileAvatarChangedEvent(this.nickname, this.avatarUrl, avatarUrl),
      );
    this.avatarUrl = avatarUrl ?? this.avatarUrl;
  }

  verifySameUser(nickname: string);
  verifySameUser(user: User);
  verifySameUser(userOrNickname: User | string) {
    if (userOrNickname instanceof User) {
      if (this.nickname !== userOrNickname.nickname)
        throw new ForbiddenException("사용자에 대한 권한이 없습니다");
    } else {
      if (this.nickname !== userOrNickname)
        throw new ForbiddenException("사용자에 대한 권한이 없습니다");
    }
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
    if (!this.isEmailUser)
      throw new ForbiddenException("이메일로 가입한 사용자가 아닙니다");
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
    if (!this.isEmailUser)
      throw new ForbiddenException("이메일로 가입한 사용자가 아닙니다");
    this.verifyPasswordResetToken(verifyToken);
    this.password = newPassword;
    this.passwordResetToken = undefined;
    await this.hashPassword();
  }

  private sendVerificationEmail() {
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
    if (!this.isEmailUser)
      throw new ForbiddenException("이메일로 가입한 사용자가 아닙니다");
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
      throw new BadRequestException("이메일 가입 사용자가 아닙니다");
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

  async changePassword(
    requestUser: User,
    currentPassword: string,
    newPassword: string,
  ) {
    this.verifySameUser(requestUser);
    if (!(await this.comparePassword(currentPassword)))
      throw new BadRequestException("잘못된 확인 비밀번호");
    this.password = newPassword;
    await this.hashPassword();
  }

  private setNewPasswordResetToken() {
    const randomDigits = Array.from({ length: 6 }, () => randomInt(0, 9));
    this.passwordResetToken = randomDigits.join("");
  }

  private setNewEmailSignupVerifyToken() {
    this.emailSignupVerifyToken = v1();
  }
}
