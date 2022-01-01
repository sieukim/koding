import {Document} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {compare, hash} from 'bcrypt';
import {v1} from 'uuid';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';

export class GithubRepositoryInfo {
  @ApiProperty({
    description: "리포지토리 이름",
    example: "koding"
  })
  @Prop()
  name: string;

  @ApiProperty({
    description: "리포지토리 주소",
    example: "koding"
  })
  @Prop()
  htmlUrl: string;

  @ApiProperty({
    description: "리포지토리 설명",
    example: "개발자 커뮤니티 🐾"
  })
  @Prop()
  description?: string;

  @ApiProperty({
    description: "리포지토리 스타 수",
    example: 23
  })
  @Prop()
  starCount: number;
}

export class GithubUserInfo {

  @Prop()
  githubId: string;

  @Prop()
  avatarUrl: string;

  @Prop()
  name: string;

  @ApiProperty({
    description: "깃허브 회원가입 이메일",
    example: "test@test.com"
  })
  @Prop()
  email: string;

  @ApiProperty({
    description: "소유한 리포지토리들의 정보",
  })
  @Prop({type: [GithubRepositoryInfo]})
  repositories: GithubRepositoryInfo[];
}

export type UserDocument = User & Document;

@Schema({ id: false, _id: true, versionKey: false })
export class User {
  private static readonly round = 10;

  @ApiProperty({
    example: 'test@test.com',
    description: '유저 이메일, 중복 불가',
  })
  @Prop({ unique: true, index: { unique: true } })
  email: string;

  @ApiProperty({
    example: 'testId123',
    description: '유저 아이디, 중복 불가',
  })
  @Prop()
  id: string;

  @ApiProperty({
    example: 'testNickname123',
    description: '유저 닉네임, 중복 불가',
  })
  @Prop()
  nickname: string;

  @ApiProperty({
    example: 'abcd1234',
    description: '유저 비밀번호',
  })
  @Prop()
  password?: string;

  @ApiPropertyOptional({
    example: 'https://blog.naver.com/test',
    description: '유저 블로그 주소',
  })
  @Prop({ required: false })
  blogUrl?: string;

  @ApiPropertyOptional({
    example: 'https://test.github.com',
    description: '유저 깃허브 주소',
  })
  @Prop({ required: false })
  githubUrl?: string;

  @ApiPropertyOptional({
    example: 'https://linktr.ee/test',
    description: '유저 포트폴리오 주소',
  })
  @Prop({ required: false })
  portfolioUrl?: string;

  @Prop({ required: false, unique: true })
  githubUserIdentifier?: number;

  @Prop({required: false, type: GithubUserInfo})
  githubUserInfo?: GithubUserInfo;

  @Prop({ required: false, unique: true })
  kakaoUserIdentifier?: number;

  @Prop({ default: () => v1() })
  verifyToken?: string;

  @Prop({ default: false })
  verified: boolean;

  async hashPassword() {
    if (this.password) this.password = await hash(this.password, User.round);
    return this;
  }

  verifyPassword(password: string) {
    return compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
// UserSchema.pre<User>('save', async function hashPassword(next) {
//   await this.hashPassword();
//   next();
// });
UserSchema.loadClass(User);
