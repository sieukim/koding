import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from "class-validator";

export class SignupGithubRequestDto {
  @IsNumber()
  githubUserIdentifier: number;
  @IsNotEmpty()
  @IsString()
  githubId: string;
  @IsNotEmpty({ message: "깃허브의 이메일 정보가 없습니다." })
  @IsEmail()
  email: string;
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;
  @IsOptional()
  @IsUrl()
  avatarUrl: string;
  @IsUrl()
  reposUrl: string;

  constructor(param: {
    githubUserIdentifier: number;
    githubId: string;
    email: string;
    name?: string;
    avatarUrl: string;
    reposUrl: string;
  }) {
    this.githubUserIdentifier = param.githubUserIdentifier;
    this.githubId = param.githubId;
    this.email = param.email;
    this.name = param.name;
    this.avatarUrl = param.avatarUrl;
    this.reposUrl = param.reposUrl;
  }
}
