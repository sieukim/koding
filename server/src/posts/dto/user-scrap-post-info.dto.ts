import { IntersectionType } from "@nestjs/swagger";
import { NicknameParamDto } from "../../users/dto/param/nickname-param.dto";
import { PostIdentifierParamDto } from "./param/post-identifier-param.dto";
import { PostIdentifier } from "../../entities/post.entity";

export class UserScrapPostInfoDto extends IntersectionType(
  NicknameParamDto,
  PostIdentifierParamDto,
) {
  /*
   * 게시글에 대한 사용자의 스크랩 여부
   */
  scrapped: boolean;

  constructor(
    { boardType, postId }: PostIdentifier,
    nickname: string,
    scrapped: boolean,
  ) {
    super();
    this.boardType = boardType;
    this.postId = postId;
    this.nickname = nickname;
    this.scrapped = scrapped;
  }
}
