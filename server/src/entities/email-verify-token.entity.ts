import { createRandomDigits } from "../common/utils/create-random-digits";
import { Column, Entity, PrimaryColumn } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { getCurrentTime } from "../common/utils/time.util";
import { AggregateRoot } from "@nestjs/cqrs";
import { EmailVerifyTokenCreatedEvent } from "../users/events/email-verify-token-created.event";
import { TableName } from "./table-name.enum";

@Entity({ name: TableName.EmailVerifyToken })
export class EmailVerifyToken extends AggregateRoot {
  public static readonly EXPIRE_MINUTES = 15;
  @ApiProperty({ description: "이메일" })
  @PrimaryColumn("varchar", { length: 50 })
  email: string;

  @ApiProperty({ description: "인증 토큰" })
  @Column("char", { length: 6 })
  verifyToken: string;
  @Column("timestamp")
  createdAt: Date;

  constructor(param?: { email: string }) {
    super();
    if (param) {
      this.email = param.email;
      this.createVerifyToken();
      this.createdAt = getCurrentTime();
    }
  }

  verify(verifyToken: string) {
    if (verifyToken !== this.verifyToken)
      throw new BadRequestException("잘못된 토큰");
    const now = getCurrentTime();
    now.setMinutes(now.getMinutes() + EmailVerifyToken.EXPIRE_MINUTES);
    if (now.getTime() < this.createdAt.getTime()) {
      // 토큰 만료
      throw new BadRequestException("잘못된 토큰");
    }
  }

  createVerifyToken() {
    this.verifyToken = createRandomDigits(6);
    this.apply(new EmailVerifyTokenCreatedEvent(this.email, this.verifyToken));
  }
}
