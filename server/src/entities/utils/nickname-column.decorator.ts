import { Column } from "typeorm";
import { ColumnCommonOptions } from "typeorm/decorator/options/ColumnCommonOptions";

export const NicknameColumn = (options: ColumnCommonOptions = {}) =>
  Column("varchar", {
    length: 20,
    ...options,
  });
