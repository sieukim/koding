import { Transform } from "class-transformer";
import { isString } from "class-validator";

export const StringToStringArrayTransform = (delimiter = ",") =>
  Transform(
    ({ value }) => {
      if (isString(value)) return value.split(delimiter).map((s) => s.trim());
      else return value;
    },
    { toClassOnly: true },
  );
