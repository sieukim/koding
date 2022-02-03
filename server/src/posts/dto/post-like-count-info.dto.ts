import { PostIdentifierParamDto } from "./param/post-identifier-param.dto";
import { PostIdentifier } from "../../models/post.model";
import { Min } from "class-validator";

export class PostLikeCountInfoDto extends PostIdentifierParamDto {
  /*
   * 게시글 좋아요 수
   */
  @Min(0)
  likeCount: number;

  constructor({ postId, boardType }: PostIdentifier, likeCount: number) {
    super();
    this.likeCount = likeCount;
    this.postId = postId;
    this.boardType = boardType;
  }
}
