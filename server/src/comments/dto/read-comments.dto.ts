import { CommentInfoDto } from "./comment-info.dto";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Comment } from "../../models/comment.model";
import { IsOptional, IsString } from "class-validator";

export class ReadCommentsDto {
  @ApiProperty({
    description: "게시글의 댓글들",
    type: [CommentInfoDto],
  })
  comments: CommentInfoDto[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "다음 페이지를 가져오기 위한 커서 query 값. 마지막 페이지인 경우는 값 없음",
    example: "61d7238b7d7a9ad823c8d8a9",
  })
  nextPageCursor?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description:
      "이전 페이지를 가져오기 위한 커서 query 값. 첫 페이지인 경우는 값 없음",
    example: "61d7238b7d7a9ad823c8d8a9",
  })
  prevPageCursor?: string;

  constructor(
    comments: Comment[],
    prevPageCursor?: string,
    nextPageCursor?: string,
  ) {
    this.prevPageCursor = prevPageCursor;
    this.nextPageCursor = nextPageCursor;
    this.comments = comments.map(CommentInfoDto.fromModel);
  }
}