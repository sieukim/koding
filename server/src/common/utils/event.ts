import { EVENT_METADATA } from "@nestjs/cqrs/dist/decorators/constants";
import { v4 } from "uuid";

export const Event = (): ClassDecorator => {
  return (target: object) => {
    if (!Reflect.hasMetadata(EVENT_METADATA, target)) {
      Reflect.defineMetadata(EVENT_METADATA, { id: v4() }, target);
    }
  };
};
