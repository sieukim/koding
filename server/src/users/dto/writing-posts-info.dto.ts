import { Post } from "../../entities/post.entity";
import { PostInfoDto } from "../../posts/dto/post-info.dto";

export class WritingPostsInfoDto {
  /*
   * 사용자가 작성한 게시글 리스트
   */
  posts: PostInfoDto[];

  /*
   * 다음 페이지를 가져오기 위한 커서 query 값. 마지막 페이지인 경우는 값 없음
   */
  nextPageCursor?: string;

  constructor(posts: Post[], nextPageCursor?: string) {
    this.posts = posts.map(PostInfoDto.fromModel);
    this.nextPageCursor = nextPageCursor;
  }
}
