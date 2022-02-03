import { PostIdentifierParamDto } from "../../../posts/dto/param/post-identifier-param.dto";

export class CommentIdentifierParamDto extends PostIdentifierParamDto {
  /*
   * 댓글 아이디
   */
  commentId: string;
}
