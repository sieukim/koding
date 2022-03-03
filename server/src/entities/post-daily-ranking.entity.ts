import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { UUIDColumn, UUIDPrimaryColumn } from "./utils/uuid-column.decorator";
import { v4 } from "uuid";
import { Post } from "./post.entity";
import { getCurrentDate } from "../common/utils/time.util";
import { BoardTypeColumn } from "./utils/board-type-column.decorator";
import { TableName } from "./table-name.enum";
import { PostBoardType } from "./post-board.type";

@Index(["postId", "aggregateDate"], { unique: true })
@Index(["aggregateDate", "boardType", "popularity"])
@Entity({ name: TableName.PostDailyRanking })
export class PostDailyRanking {
  @UUIDPrimaryColumn()
  id: string = v4();
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
  @Column("int")
  popularity = 0;
  @Column("int")
  readCount = 0;
  @Column("int")
  likeCount = 0;
  @Column("int")
  commentCount = 0;
  @Column("int")
  scrapCount = 0;
  // 집계 날짜. 분,초 정보 없이 연,월,일 정보만 저장
  @Column("date")
  aggregateDate: Date = getCurrentDate();

  constructor(param?: {
    postId: string;
    boardType: PostBoardType;
    aggregateDate: Date;
  }) {
    if (param) {
      this.id = v4();
      this.postId = param.postId;
      this.boardType = param.boardType;
      this.aggregateDate = param.aggregateDate;
      this.popularity = 0;
      this.readCount = 0;
      this.likeCount = 0;
      this.commentCount = 0;
      this.scrapCount = 0;
    }
  }
}
