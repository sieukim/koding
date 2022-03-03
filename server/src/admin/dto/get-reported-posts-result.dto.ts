import { PickType } from "@nestjs/swagger";
import { Expose, plainToClass, Type } from "class-transformer";
import { WithNextCursorDto } from "../../common/dto/with-next-cursor.dto";
import { PostReport } from "../../entities/post-report.entity";
import { Post } from "../../entities/post.entity";
import { Fetched } from "../../common/types/fetched.type";

export class ReportInfoDto extends PickType(PostReport, [
  "reportReason",
  "nickname",
] as const) {
  static fromModel(model: PostReport) {
    return plainToClass(ReportInfoDto, model, {
      excludeExtraneousValues: true,
    });
  }
}

export class PostWithReportsDto extends PickType(Post, [
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

  static fromModel(model: Fetched<Post, "reports">) {
    return plainToClass(PostWithReportsDto, model, {
      excludeExtraneousValues: true,
    });
  }
}

export class GetReportedPostsResultDto extends WithNextCursorDto {
  @Expose()
  @Type(() => PostWithReportsDto)
  posts: PostWithReportsDto[];

  static fromModelArray(
    models: Array<Fetched<Post, "reports">>,
    nextPageCursor?: string,
  ) {
    return plainToClass(
      GetReportedPostsResultDto,
      {
        posts: models.map(PostWithReportsDto.fromModel),
        nextPageCursor,
      },
      { excludeExtraneousValues: true },
    );
  }
}
