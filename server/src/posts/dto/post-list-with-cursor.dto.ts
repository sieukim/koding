import { IntersectionType } from "@nestjs/swagger";
import { PostListDto } from "./post-list.dto";
import { WithCursorResponseDto } from "../../common/dto/with-cursor-response.dto";

export class PostListWithCursorDto extends IntersectionType(
  PostListDto,
  WithCursorResponseDto,
) {
  constructor(param?: Readonly<PostListWithCursorDto>) {
    super();
    if (param) Object.assign(this, param);
  }
}
