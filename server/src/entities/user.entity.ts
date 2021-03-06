import { AggregateRoot } from "@nestjs/cqrs";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { getCurrentTime } from "../common/utils/time.util";
import { compare, hash } from "bcrypt";
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ResetPasswordRequestedEvent } from "../users/events/reset-password-requested.event";
import {
  ArrayMaxSize,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Min,
} from "class-validator";
import { ChangeProfileRequestDto } from "../users/dto/change-profile-request.dto";
import {
  classToPlain,
  Expose,
  plainToClass,
  Transform,
  Type,
} from "class-transformer";
import { Role } from "./role.enum";
import { ProfileAvatarChangedEvent } from "../upload/event/profile-avatar-changed.event";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { DelimiterArrayColumn } from "./utils/delimiter-array-column.decorator";
import { Follow } from "./follow.entity";
import { PostLike } from "./post-like.entity";
import { Notification } from "./notification.entity";
import { UserFollowedEvent } from "../users/events/user-followed.event";
import { createRandomDigits } from "../common/utils/create-random-digits";
import { Comment } from "./comment.entity";
import { Post } from "./post.entity";
import { TableName } from "./table-name.enum";

export class PasswordResetToken {
  public static readonly EXPIRE_MINUTES = 15;
  @Expose()
  @Column("varchar", { length: 50 })
  email: string;

  @Expose()
  @Column("char", { length: 6 })
  verifyToken: string;

  @Expose()
  @Column("timestamp")
  createdAt: Date;

  constructor(param?: { email: string }) {
    if (param) {
      this.email = param.email;
      this.verifyToken = createRandomDigits(6);
      this.createdAt = getCurrentTime();
    }
  }

  verify(verifyToken: string) {
    if (verifyToken !== this.verifyToken)
      // ????????? ??????
      throw new BadRequestException("????????? ??????");
    const now = getCurrentTime();
    now.setMinutes(now.getMinutes() + PasswordResetToken.EXPIRE_MINUTES);
    if (now.getTime() < this.createdAt.getTime()) {
      // ?????? ??????
      throw new BadRequestException("????????? ??????");
    }
  }
}

export class GithubRepositoryInfo {
  @ApiProperty({
    description: "??????????????? ??????",
    example: "koding",
  })
  name: string;

  @IsUrl()
  @ApiProperty({
    description: "??????????????? ??????",
    example: "koding",
  })
  htmlUrl: string;

  @ApiProperty({
    description: "??????????????? ??????",
    example: "????????? ???????????? ????",
  })
  description?: string;

  @Min(0)
  @IsNumber()
  @ApiProperty({
    description: "??????????????? ?????? ???",
    example: 23,
  })
  starCount: number;
}

export class GithubUserInfo {
  githubId: string;

  @IsUrl()
  @ApiProperty({
    description: "????????? ????????? ?????? url",
    example: "https://avatars.githubusercontent.com/u/11111111",
  })
  avatarUrl: string;

  @ApiProperty({
    description: "????????? ??????",
    example: "?????????",
  })
  name?: string;

  @IsEmail()
  @ApiProperty({
    description: "????????? ???????????? ?????????",
    example: "test@test.com",
  })
  email: string;

  @ApiProperty({
    description: "????????? ????????????????????? ??????",
    type: [GithubRepositoryInfo],
  })
  repositories: GithubRepositoryInfo[];
}

@Index(["email"], { unique: true })
@Entity({ name: TableName.User })
export class User extends AggregateRoot {
  private static readonly ROUND = 10;

  @Expose()
  @IsString()
  @Length(2, 10)
  @Matches("[A-Za-z0-9???-???]*")
  @ApiProperty({
    example: "testNick",
    description: "????????? ?????????, ?????? ??????",
    pattern: "[A-Za-z0-9???-???]*",
    minLength: 2,
    maxLength: 10,
    type: String,
  })
  @NicknameColumn({ primary: true })
  nickname: string;

  @Expose()
  @IsEmail()
  @ApiProperty({
    example: "vvsos1@hotmail.co.kr",
    description: "????????? ?????????, ?????? ??????",
    type: String,
  })
  @Column("varchar", { length: 50 })
  email: string;

  @Length(8, 16)
  @IsString()
  @ApiProperty({
    example: "11111111",
    description: "????????? ????????????",
    minLength: 8,
    maxLength: 16,
    type: String,
  })
  @Column("varchar", { length: 100, nullable: true }) // ????????? ????????? ????????? null
  password?: string | null;

  @Expose()
  @IsBoolean()
  @ApiPropertyOptional({
    description: "????????? ????????? ?????? ????????????",
    type: Boolean,
    default: false,
  })
  @Column("boolean")
  isBlogUrlPublic = false;

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
    description: "????????? ????????? ??????. ?????? ????????? ?????? ?????? ?????? ??? ??????",
    type: String,
  })
  @Column("varchar", { nullable: true, length: 150 })
  blogUrl: string | null = null;

  @Expose()
  @IsBoolean()
  @ApiPropertyOptional({
    description: "????????? ????????? ?????? ????????????",
    type: Boolean,
    default: false,
  })
  @Column("boolean")
  isGithubUrlPublic = false;

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
    description: "????????? ????????? ??????. ?????? ????????? ?????? ?????? ?????? ??? ??????",
    type: String,
  })
  @Column("varchar", { nullable: true, length: 150 })
  githubUrl: string | null = null;

  @Expose()
  @IsBoolean()
  @ApiPropertyOptional({
    description: "????????? ??????????????? ?????? ????????????",
    type: Boolean,
    default: false,
  })
  @Column("boolean")
  isPortfolioUrlPublic = false;

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
    description: "????????? ??????????????? ??????. ?????? ????????? ?????? ?????? ?????? ??? ??????",
    type: String,
  })
  @Column("varchar", { nullable: true, length: 150 })
  portfolioUrl: string | null = null;

  @Expose()
  @ApiProperty({
    description: "????????? ?????? ????????? ??????",
    type: Boolean,
  })
  @Column("boolean")
  isGithubUser = false;

  @Expose()
  @ApiProperty({
    description: "????????? ?????? ????????? ??????",
    type: Boolean,
  })
  @Column("boolean")
  isEmailUser = false;

  @Expose()
  @ApiProperty({
    description: "????????? API?????? ???????????? ????????? ????????? ?????? ??????",
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  @Column("int", { nullable: true })
  githubUserIdentifier?: number | null = null;

  @Type(() => GithubUserInfo)
  @Expose()
  @IsOptional()
  @ApiProperty({
    description: "????????? ?????? ??????",
    type: GithubUserInfo,
  })
  @Column("json", { nullable: true })
  githubUserInfo: GithubUserInfo | null = null;

  @Column("json", {
    nullable: true,
    transformer: {
      to: (value) => classToPlain(value),
      from: (value) =>
        plainToClass(PasswordResetToken, value, {
          enableImplicitConversion: true,
        }),
    },
  })
  passwordResetToken: PasswordResetToken | null;

  @Expose()
  @IsDate()
  @ApiProperty({
    description: "?????????",
    type: Date,
  })
  @Column("timestamp")
  createdAt: Date;

  // logstash ??? ?????? ??????
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Type(() => Follow)
  @Expose()
  @OneToMany(() => Follow, (followEntity) => followEntity.fromUser, {
    cascade: true,
  })
  followings?: Follow[];

  @Type(() => User)
  @ManyToMany(() => User)
  @JoinTable({
    name: TableName.Follow,
    joinColumn: {
      name: "fromNickname",
      referencedColumnName: "nickname",
    },
    inverseJoinColumn: {
      name: "toNickname",
      referencedColumnName: "nickname",
    },
  })
  followingUsers?: User[];

  @Type(() => Follow)
  @Expose()
  @OneToMany(() => Follow, (followEntity) => followEntity.toUser)
  followers?: Follow[];

  @Type(() => User)
  @Expose()
  @ManyToMany(() => User)
  @JoinTable({
    name: TableName.Follow,
    joinColumn: {
      name: "toNickname",
      referencedColumnName: "nickname",
    },
    inverseJoinColumn: {
      name: "fromNickname",
      referencedColumnName: "nickname",
    },
  })
  followerUsers?: User[];

  @Expose()
  @ApiProperty({
    description: "????????? ?????? ????????? ???",
    type: Number,
    minimum: 0,
  })
  @Column("int")
  followingsCount = 0;

  @Expose()
  @ApiProperty({
    description: "????????? ???",
    type: Number,
    minimum: 0,
  })
  @Column("int")
  followersCount = 0;

  @Expose()
  @ApiProperty({
    description: "???????????? ??????",
    enum: Object.values(Role),
    isArray: true,
  })
  @DelimiterArrayColumn({ length: 100 })
  roles: Role[] = [Role.User];

  @Expose()
  @ApiProperty({
    description: "?????? ?????? ??????",
  })
  @Column("timestamp", { nullable: true })
  accountSuspendedUntil: Date | null = null;

  @Expose()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    description: "????????? ?????? URL",
  })
  @Column("varchar", { nullable: true, length: 150 })
  avatarUrl: string | null = null;

  @Expose()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @ApiProperty({
    description: "?????? ?????????",
  })
  @DelimiterArrayColumn()
  techStack: string[];

  @Expose()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  @ApiProperty({
    description: "?????? ?????????",
  })
  @DelimiterArrayColumn()
  interestTech: string[];

  @OneToMany(() => Notification, (notification) => notification.receiver)
  notifications?: Notification[];

  @OneToMany(() => PostLike, (postLike) => postLike.user)
  postLikes?: PostLike[];

  @OneToMany(() => Post, (post) => post.writer)
  posts?: Post[];

  @OneToMany(() => Comment, (comment) => comment.writer)
  comments?: Comment[];

  constructor();
  constructor(param: {
    email: string;
    nickname: string;
    password: string;
    blogUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    isEmailUser: true;
    avatarUrl?: string;
    techStack?: string[];
    interestTech?: string[];
  });

  constructor(param: {
    email: string;
    nickname: string;
    isGithubUser: true;
    githubUserIdentifier: number;
    githubUserInfo: GithubUserInfo;
  });

  constructor(param?: {
    email: string;
    nickname: string;
    password?: string;
    blogUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    isEmailUser?: boolean;
    isGithubUser?: boolean;
    githubUserIdentifier?: number;
    githubUserInfo?: GithubUserInfo;
    avatarUrl?: string;
    techStack?: string[];
    interestTech?: string[];
  }) {
    super();
    if (param) {
      this.email = param.email;
      this.nickname = param.nickname;
      this.password = param.password;
      this.isBlogUrlPublic = false;
      this.blogUrl = param.blogUrl ?? null;
      this.isGithubUrlPublic = false;
      this.githubUrl = param.githubUrl ?? null;
      this.isPortfolioUrlPublic = false;
      this.portfolioUrl = param.portfolioUrl ?? null;
      this.isGithubUser = param.isGithubUser ?? false;
      this.isEmailUser = param.isEmailUser ?? false;
      this.githubUserIdentifier = param.githubUserIdentifier;
      this.githubUserInfo = param.githubUserInfo ?? null;
      this.avatarUrl = param.avatarUrl ?? null;
      this.techStack = param.techStack ?? [];
      this.interestTech = param.interestTech ?? [];
      this.createdAt = getCurrentTime();
      this.roles = [Role.User];
      if (this.isEmailUser && this.avatarUrl) {
        this.apply(
          new ProfileAvatarChangedEvent(this.nickname, null, this.avatarUrl),
        );
      }
    }
  }

  async hashPassword() {
    if (this.password) this.password = await hash(this.password, User.ROUND);
    return this;
  }

  async comparePassword(password: string) {
    if (this.password) return compare(password, this.password);
    throw Error("User.comparePassword: password ??? ???????????????");
  }

  changeProfile(request: ChangeProfileRequestDto) {
    const {
      githubUrl,
      isGithubUrlPublic,
      isBlogUrlPublic,
      blogUrl,
      isPortfolioUrlPublic,
      portfolioUrl,
      avatarUrl,
      interestTech,
      techStack,
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
    this.techStack = techStack ?? this.techStack;
    this.interestTech = interestTech ?? this.interestTech;
  }

  verifySameUser(nickname: string) {
    if (this.nickname !== nickname)
      throw new ForbiddenException("???????????? ?????? ????????? ????????????");
  }

  verifyPasswordResetToken(verifyToken: string) {
    console.log("passwordResetToken: ", this.passwordResetToken);
    if (!this.isEmailUser)
      throw new ForbiddenException("???????????? ????????? ???????????? ????????????");
    if (!this.passwordResetToken)
      throw new BadRequestException("???????????? ?????? ??????");
    this.passwordResetToken.verify(verifyToken);
  }

  async resetPassword({
    verifyToken,
    newPassword,
  }: {
    verifyToken: string;
    newPassword: string;
  }) {
    if (!this.isEmailUser)
      throw new ForbiddenException("???????????? ????????? ???????????? ????????????");
    console.log("passwordResetToken: ", this.passwordResetToken);
    this.verifyPasswordResetToken(verifyToken);
    this.password = newPassword;
    this.passwordResetToken = null;
    await this.hashPassword();
  }

  sendPasswordResetEmail() {
    if (!this.isEmailUser)
      throw new ForbiddenException("???????????? ????????? ???????????? ????????????");
    this.passwordResetToken = new PasswordResetToken({ email: this.email });
    this.apply(
      new ResetPasswordRequestedEvent(
        this.email,
        this.nickname,
        this.passwordResetToken.verifyToken,
      ),
    );
  }

  linkAccountWithGithub(
    githubUserIdentifier: number,
    githubUserInfo: GithubUserInfo,
  ) {
    this.githubUserIdentifier = githubUserIdentifier;
    this.githubUserInfo = githubUserInfo;
    this.isGithubUser = true;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    if (!(await this.comparePassword(currentPassword)))
      throw new BadRequestException("????????? ?????? ????????????");
    this.password = newPassword;
    await this.hashPassword();
  }

  deleteAvatar() {
    this.apply(
      new ProfileAvatarChangedEvent(this.nickname, this.avatarUrl, null),
    );
    this.avatarUrl = null;
  }

  // followings ??? loading ?????? ????????? ???
  followUser(user: User) {
    if (!this.followings) throw new InternalServerErrorException();
    if (this.followings.some((follow) => follow.toNickname === user.nickname))
      return;

    const follow = new Follow({
      fromNickname: this.nickname,
      toNickname: user.nickname,
    });
    this.followings.push(follow);
    this.followingsCount++;
    user.followersCount++;
    this.apply(new UserFollowedEvent(this.nickname, user.nickname));
  }

  // followings ??? loading ?????? ????????? ???
  unfollowUser(user: User) {
    if (!this.followings) throw new InternalServerErrorException();

    const followIndex = this.followings.findIndex(
      (follow) => follow.toNickname == user.nickname,
    );
    if (followIndex >= 0) {
      this.followings.splice(followIndex, 1);
      this.followingsCount--;
      user.followersCount--;
    }
  }

  suspendAccount(forever: boolean, suspendDay?: number) {
    if (forever) suspendDay = 365 * 1000;
    const suspendDueDate = getCurrentTime();
    suspendDueDate.setDate(suspendDueDate.getDate() + (suspendDay ?? 0));
    this.accountSuspendedUntil = suspendDueDate;
  }

  unsuspendUserAccount() {
    this.accountSuspendedUntil = null;
  }
}
