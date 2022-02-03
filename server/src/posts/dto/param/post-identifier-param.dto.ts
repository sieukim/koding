import { BoardTypeParamDto } from "./board-type-param.dto";

export class PostIdentifierParamDto extends BoardTypeParamDto {
  /*
   * 게시글 아이디
   */
  postId: string;
}
