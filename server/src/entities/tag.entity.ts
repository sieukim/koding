import { Column, Entity, Index } from "typeorm";
import { BoardTypeColumn } from "./utils/board-type-column.decorator";
import { TableName } from "./table-name.enum";
import { PostBoardType } from "./post-board.type";

@Index(["boardType", "tag", "refCount"])
@Index(["certified", "boardType"])
@Entity({ name: TableName.Tag })
export class Tag {
  @BoardTypeColumn({ primary: true })
  boardType: PostBoardType;
  @Column("varchar", { length: "30", primary: true })
  tag: string;
  @Column("int")
  refCount = 0;
  @Column("boolean")
  certified = false;

  constructor(param?: {
    boardType: PostBoardType;
    tag: string;
    certified: boolean;
  }) {
    if (param) {
      this.boardType = param.boardType;
      this.tag = param.tag;
      this.refCount = 0;
      this.certified = param.certified;
    }
  }
}
