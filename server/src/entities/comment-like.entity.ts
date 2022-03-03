import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Post } from "./post.entity";
import { UUIDColumn } from "./utils/uuid-column.decorator";
import { BoardTypeColumn } from "./utils/board-type-column.decorator";
import { NicknameColumn } from "./utils/nickname-column.decorator";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";
import { TableName } from "./table-name.enum";
import { PostBoardType } from "./post-board.type";

@Index(["nickname", "createdAt"]) // 사용자가 좋아요한 댓글들 조회 시
@Entity({ name: TableName.CommentLike })
export class CommentLike {
  @UUIDColumn({ primary: true })
  commentId: string;
  @JoinColumn({ name: "commentId", referencedColumnName: "commentId" })
  @ManyToOne(() => Comment, {
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  comment?: Comment;
  @UUIDColumn()
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
    commentId: string;
    postId: string;
    boardType: PostBoardType;
    nickname: string;
  }) {
    if (param) {
      this.commentId = param.commentId;
      this.postId = param.postId;
      this.boardType = param.boardType;
      this.nickname = param.nickname;
    }
  }
}
