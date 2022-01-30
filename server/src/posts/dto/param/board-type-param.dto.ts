import { IsEnum } from "class-validator";
import { PostBoardType } from "../../../models/post.model";

export class BoardTypeParamDto {
  /*
   * 게시글의 게시판
   */
  @IsEnum(PostBoardType)
  boardType: PostBoardType;
}
