import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPostListQuery } from "../get-post-list.query";
import { PostsRepository } from "../../posts.repository";
import { Post } from "../../../models/post.model";
import { SortType } from "../../../common/repository/sort-option";
import { PostListDto } from "../../dto/post-list.dto";

@QueryHandler(GetPostListQuery)
export class GetPostListHandler implements IQueryHandler<GetPostListQuery> {
  constructor(private readonly postRepository: PostsRepository) {}

  async execute(query: GetPostListQuery) {
    const { boardType, cursor, searchQuery, pageSize } = query;
    const searchOption = searchQuery?.tags
      ? { tags: { in: searchQuery.tags } }
      : {};
    let posts: Post[];
    let nextPageCursor: string | undefined;
    let prevPageCursor: string | undefined;
    if (!cursor) {
      // 첫페이지인 경우
      posts = await this.postRepository.findAll(
        {
          boardType: { eq: boardType },
          ...searchOption,
        },
        {
          postId: SortType.DESC,
        },
        pageSize + 1,
      );
    } else {
      posts = await this.postRepository.findAll(
        {
          boardType: { eq: boardType },
          postId: { lte: cursor },
          ...searchOption,
        },
        {
          postId: SortType.DESC,
        },
        pageSize + 1,
      );
      const prevPosts = await this.postRepository.findAll(
        {
          boardType: { eq: boardType },
          postId: { gt: cursor },
          ...searchOption,
        },
        {
          postId: SortType.ASC,
        },
        pageSize,
      );
      if (prevPosts.length > 0)
        prevPageCursor = prevPosts[prevPosts.length - 1].postId;
    }
    if (posts.length === pageSize + 1) {
      const nextCursorPost = posts.pop();
      nextPageCursor = nextCursorPost.postId;
    }
    return new PostListDto(posts, prevPageCursor, nextPageCursor);
  }
}
