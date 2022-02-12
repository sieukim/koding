import { PickType } from "@nestjs/swagger";
import { PostDocument } from "../../schemas/post.schema";
import { PostReportDocument } from "../../schemas/post-report.schema";
import { Expose, plainToClass, Type } from "class-transformer";
import { WithNextCursorDto } from "../../common/dto/with-next-cursor.dto";

export class ReportInfoDto extends PickType(PostReportDocument, [
  "reportReason",
  "nickname",
] as const) {}

export class PostWithReportsDto extends PickType(PostDocument, [
  "postId",
  "boardType",
  "title",
  "markdownContent",
  "tags",
  "writerNickname",
  "imageUrls",
  "reportCount",
  "commentCount",
  "readCount",
  "likeCount",
  "scrapCount",
] as const) {
  @Expose()
  @Type(() => ReportInfoDto)
  reports: ReportInfoDto[];

  static fromJson(json: Readonly<PostWithReportsDto>) {
    return plainToClass(PostWithReportsDto, json, {
      excludeExtraneousValues: true,
    });
  }
}

export class GetReportedPostsResultDto extends WithNextCursorDto {
  @Expose()
  @Type(() => PostWithReportsDto)
  posts: PostWithReportsDto[];

  static fromJsonArray(
    jsons: Array<Readonly<PostWithReportsDto>>,
    nextPageCursor?: string,
  ) {
    return plainToClass(
      GetReportedPostsResultDto,
      {
        posts: jsons.map(PostWithReportsDto.fromJson),
        nextPageCursor,
      },
      { excludeExtraneousValues: true },
    );
  }
}
