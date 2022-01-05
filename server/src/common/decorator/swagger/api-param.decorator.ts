import { ApiParam } from "@nestjs/swagger";
import { postBoardTypes } from "../../../schemas/post.schema";


export const ApiParamBoardType = ApiParam({
  name: "boardType",
  description: "게시판 종류",
  enum: postBoardTypes
});