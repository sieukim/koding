import { ApiParam } from "@nestjs/swagger";
import { PostBoardType } from "../../../models/post.model";

export const ApiParamBoardType = ({
  name = "boardType",
  description = "게시판 종류",
}: {
  name?: string;
  description?: string;
} = {}) =>
  ApiParam({
    name,
    description,
    enum: PostBoardType,
  });

export const ApiParamPostId = ({
  name = "postId",
  description = "게시글 아이디",
}: {
  name?: string;
  description?: string;
} = {}) =>
  ApiParam({
    name,
    description,
  });
