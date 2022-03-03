import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Expose } from "class-transformer";
import { Post } from "./post.entity";
import { UUIDColumn } from "./utils/uuid-column.decorator";
import { BoardTypeColumn } from "./utils/board-type-column.decorator";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import { User } from "./user.entity";
import { getCurrentTime } from "../common/utils/time.util";
import { TableName } from "./table-name.enum";
import { PostBoardType } from "./post-board.type";

@Entity({ name: TableName.PostReport })
export class PostReport {
  @Expose()
  @UUIDColumn({ primary: true })
  postId: string;

  @Expose()
  @BoardTypeColumn()
  boardType: PostBoardType;

  @Expose()
  @JoinColumn({ name: "postId", referencedColumnName: "postId" })
  @ManyToOne(() => Post, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  post?: Post;

  @Expose()
  @NicknameColumn({ primary: true })
  nickname: string;
  @Expose()
  @JoinColumn({ name: "nickname", referencedColumnName: "nickname" })
  @ManyToOne(() => User, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  user?: User;
  @Expose()
  @Column("varchar", { length: 100 })
  reportReason: string;
  @Expose()
  @Column("timestamp")
  createdAt: Date;

  constructor(param?: {
    postId: string;
    nickname: string;
    boardType: PostBoardType;
    reportReason: string;
  }) {
    if (param) {
      this.postId = param.postId;
      this.nickname = param.nickname;
      this.boardType = param.boardType;
      this.reportReason = param.reportReason;
      this.createdAt = getCurrentTime();
    }
  }
}
