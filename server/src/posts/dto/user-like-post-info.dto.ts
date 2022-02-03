import { IntersectionType } from "@nestjs/swagger";
import { NicknameParamDto } from "../../users/dto/param/nickname-param.dto";
import { PostIdentifierParamDto } from "./param/post-identifier-param.dto";
import { PostIdentifier } from "../../models/post.model";

export class UserLikePostInfoDto extends IntersectionType(
  NicknameParamDto,
  PostIdentifierParamDto,
) {
  /*
   * 게시글에 대한 사용자의 좋아요 여부
   */
  liked: boolean;

  constructor(
    { boardType, postId }: PostIdentifier,
    nickname: string,
    liked: boolean,
  ) {
    super();
    this.boardType = boardType;
    this.postId = postId;
    this.nickname = nickname;
    this.liked = liked;
  }
}
