import { Transform } from "class-transformer";
import { isNotEmpty, isString } from "class-validator";

export const StringToStringArrayTransform = ({
  delimiter = ",",
  defaultValue,
}: {
  delimiter?: string;
  defaultValue?: string[];
} = {}) =>
  Transform(
    ({ value }) => {
      if (isString(value))
        return value
          .split(delimiter)
          .map((s) => s.trim())
          .filter(isNotEmpty);
      else return value ?? defaultValue;
    },
    { toClassOnly: true },
  );
