import { Transform } from "class-transformer";
import { BadRequestException } from "@nestjs/common";

export const BooleanTransform = (orThrow = false) =>
  Transform(({ value, key }) => {
    switch (value) {
      case "true":
      case true:
        return true;
      case "false":
      case false:
        return false;
      default:
        if (orThrow)
          throw new BadRequestException(
            `${key} 는 boolean 타입이어야 합니다. ${value}`,
          );
        return value;
    }
  });
