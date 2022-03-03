import { IsEnum } from "class-validator";
import { PostBoardType } from "../../../entities/post-board.type";

export class BoardTypeParamDto {
  /*
   * 게시글의 게시판
   */
  @IsEnum(PostBoardType)
  boardType: PostBoardType;
}
