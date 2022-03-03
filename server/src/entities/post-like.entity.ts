import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Post } from "./post.entity";
import { UUIDColumn } from "./utils/uuid-column.decorator";
import { BoardTypeColumn } from "./utils/board-type-column.decorator";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import { User } from "./user.entity";
import { getCurrentTime } from "../common/utils/time.util";
import { TableName } from "./table-name.enum";
import { PostBoardType } from "./post-board.type";

@Index(["nickname", "createdAt"]) // 사용자가 좋아요한 게시글들 조회 시
@Entity({ name: TableName.PostLike })
export class PostLike {
  @UUIDColumn({ primary: true })
  postId: string;
  @BoardTypeColumn()
  boardType: PostBoardType;
  @JoinColumn({ name: "postId", referencedColumnName: "postId" })
  @ManyToOne(() => Post, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  post?: Post;
  @NicknameColumn({ primary: true })
  nickname: string;
  @JoinColumn({ name: "nickname", referencedColumnName: "nickname" })
  @ManyToOne(() => User, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  user?: User;
  @Column("timestamp")
  createdAt: Date;

  constructor(param?: {
    postId: string;
    boardType: PostBoardType;
    nickname: string;
  }) {
    if (param) {
      this.postId = param.postId;
      this.boardType = param.boardType;
      this.nickname = param.nickname;
      this.createdAt = getCurrentTime();
    }
  }
}
