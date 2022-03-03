import { IntersectionType } from "@nestjs/swagger";
import { PostListDto } from "./post-list.dto";
import { WithNextCursorDto } from "../../common/dto/with-next-cursor.dto";

export class PostListWithCursorDto extends IntersectionType(
  PostListDto,
  WithNextCursorDto,
) {
  constructor(param?: Readonly<PostListWithCursorDto>) {
    super();
    if (param) Object.assign(this, param);
  }
}
