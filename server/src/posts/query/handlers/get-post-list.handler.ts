import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPostListQuery } from "../get-post-list.query";
import { PostsRepository } from "../../posts.repository";
import { Post } from "../../../models/post.model";
import { SortType } from "../../../common/repository/sort-option";
import { PostListWithCursorDto } from "../../dto/post-list-with-cursor.dto";
import { PostMetadataInfoDto } from "../../dto/post-metadata-info.dto";

@QueryHandler(GetPostListQuery)
export class GetPostListHandler implements IQueryHandler<GetPostListQuery> {
  constructor(private readonly postRepository: PostsRepository) {}

  async execute(query: GetPostListQuery) {
    const { boardType, cursor, searchQuery, pageSize } = query;
    let searchOption = {};
    if (searchQuery?.tags)
      searchOption = { ...searchOption, tags: { in: searchQuery.tags } };
    if (searchQuery?.writer)
      searchOption = {
        ...searchOption,
        writerNickname: { eq: searchQuery.writer },
      };

    let posts: Post[];
    let nextPageCursor: string | undefined;
    let prevPageCursor: string | undefined;
    let totalCount: number;
    const totalCountPromise = this.postRepository.count({
      boardType: { eq: boardType },
      ...searchOption,
    });
    if (!cursor) {
      // 첫페이지인 경우
      [posts, totalCount] = await Promise.all([
        this.postRepository.findAll(
          {
            boardType: { eq: boardType },
            ...searchOption,
          },
          {
            postId: SortType.DESC,
          },
          pageSize + 1,
        ),
        totalCountPromise,
      ]);
    } else {
      let prevPosts;
      [posts, prevPosts, totalCount] = await Promise.all([
        this.postRepository.findAll(
          {
            boardType: { eq: boardType },
            postId: { lte: cursor },
            ...searchOption,
          },
          {
            postId: SortType.DESC,
          },
          pageSize + 1,
        ),
        this.postRepository.findAll(
          {
            boardType: { eq: boardType },
            postId: { gt: cursor },
            ...searchOption,
          },
          {
            postId: SortType.ASC,
          },
          pageSize,
        ),
        totalCountPromise,
      ]);
      if (prevPosts.length > 0)
        prevPageCursor = prevPosts[prevPosts.length - 1].postId;
    }
    if (posts.length === pageSize + 1) {
      const nextCursorPost = posts.pop();
      nextPageCursor = nextCursorPost.postId;
    }
    return new PostListWithCursorDto({
      posts: posts.map(PostMetadataInfoDto.fromModel),
      prevPageCursor,
      nextPageCursor,
      totalCount,
    });
  }
}
