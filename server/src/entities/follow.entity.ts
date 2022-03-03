import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import { User } from "./user.entity";
import { TableName } from "./table-name.enum";

// @Index(["fromNickname", "toNickname"], { unique: true })
@Entity({
  name: TableName.Follow,
})
export class Follow {
  @NicknameColumn({ primary: true })
  fromNickname: string;
  @NicknameColumn({ primary: true })
  toNickname: string;
  @JoinColumn({ name: "fromNickname", referencedColumnName: "nickname" })
  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  fromUser?: User;
  @JoinColumn({ name: "toNickname", referencedColumnName: "nickname" })
  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  toUser?: User;

  constructor(param?: { fromNickname: string; toNickname: string }) {
    if (param) {
      this.fromNickname = param.fromNickname;
      this.toNickname = param.toNickname;
    }
  }
}
