import { Column } from "typeorm";
import { ColumnCommonOptions } from "typeorm/decorator/options/ColumnCommonOptions";

export const UUIDColumn = (options: ColumnCommonOptions = {}) =>
  Column("char", {
    length: 36,
    ...options,
  });

export const UUIDPrimaryColumn = (options: ColumnCommonOptions = {}) =>
  UUIDColumn({
    ...options,
    primary: true,
  });
