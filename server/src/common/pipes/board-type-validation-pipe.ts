import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common";
import { isIn } from "class-validator";
import { PostBoardTypes } from "../../models/post.model";

export class BoardTypeValidationPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isIn(value, PostBoardTypes))
      throw new BadRequestException("잘못된 boardType 입니다");
    return value;
  }
}
