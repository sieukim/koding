import { IntersectionType } from "@nestjs/swagger";
import { NicknameParamDto } from "../../users/dto/param/nickname-param.dto";
import { PostIdentifierParamDto } from "./param/post-identifier-param.dto";
import { PostIdentifier } from "../../models/post.model";

export class UserScrapPostInfoDto extends IntersectionType(
  NicknameParamDto,
  PostIdentifierParamDto,
) {
  /*
   * 게시글에 대한 사용자의 스크랩 여부
   */
  scraped: boolean;

  constructor(
    { boardType, postId }: PostIdentifier,
    nickname: string,
    scraped: boolean,
  ) {
    super();
    this.boardType = boardType;
    this.postId = postId;
    this.nickname = nickname;
    this.scraped = scraped;
  }
}
