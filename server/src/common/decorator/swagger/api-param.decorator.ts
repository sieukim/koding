import { ApiParam } from "@nestjs/swagger";
import { postBoardTypes } from "../../../schemas/post.schema";


export const ApiParamBoardType = ({ name, description } = { name: "boardType", description: "게시판 종류" }) => ApiParam({
  name,
  description,
  enum: postBoardTypes
});

export const ApiParamPostId = ({ name, description } = { name: "postId", description: "게시글 아이디" }) => ApiParam({
  name,
  description
});