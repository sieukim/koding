import { Column } from "typeorm";
import { ColumnCommonOptions } from "typeorm/decorator/options/ColumnCommonOptions";
import { ColumnWithLengthOptions } from "typeorm/decorator/options/ColumnWithLengthOptions";
import { arrayMinSize, isNotEmpty, isString } from "class-validator";

export const DelimiterArrayColumn = (
  options: Omit<ColumnCommonOptions, "transformer"> &
    ColumnWithLengthOptions = {},
  delimiter = ",",
) =>
  Column("varchar", {
    length: 100,
    nullable: true,
    transformer: {
      to: (value: any[]) =>
        arrayMinSize(value, 1) ? value.join(delimiter) : null,
      from: (value: string | null) =>
        isString(value) ? value.split(delimiter).filter(isNotEmpty) : [],
    },
    ...options,
  });
