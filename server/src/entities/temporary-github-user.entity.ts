import { Column, Entity, Index, PrimaryColumn } from "typeorm";
import { GithubUserInfo } from "./user.entity";
import { createRandomDigits } from "../common/utils/create-random-digits";
import { BadRequestException } from "@nestjs/common";
import { TableName } from "./table-name.enum";

@Index(["email"], { unique: true })
@Entity({ name: TableName.TemporaryGithubUser })
export class TemporaryGithubUser {
  @PrimaryColumn("varchar", { length: 50 })
  email: string;
  @Column("int")
  githubUserIdentifier: number;
  @Column("json")
  githubUserInfo: GithubUserInfo;
  // 깃허브 회원가입 인증 토큰
  @Column("char", { length: 6 })
  verifyToken: string;

  constructor(param?: {
    email: string;
    githubUserIdentifier: number;
    githubUserInfo: GithubUserInfo;
  }) {
    if (param) {
      this.email = param.email;
      this.githubUserInfo = param.githubUserInfo;
      this.githubUserIdentifier = param.githubUserIdentifier;
      this.verifyToken = createRandomDigits(6);
    }
  }

  verify(verifyToken: string) {
    if (this.verifyToken !== verifyToken)
      throw new BadRequestException("유효하지 않은 토큰");
  }
}
