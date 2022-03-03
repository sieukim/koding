import { Column } from "typeorm";
import { ColumnCommonOptions } from "typeorm/decorator/options/ColumnCommonOptions";
import { PostBoardType } from "../post-board.type";

export const BoardTypeColumn = (option: ColumnCommonOptions = {}) =>
  Column("enum", {
    ...option,
    enum: PostBoardType,
  });
