import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetPostsOfFollowingsQuery } from "../get-posts-of-followings.query";
import { UsersRepository } from "../../../users/users.repository";
import { PostsRepository } from "../../posts.repository";
import { Post } from "../../../models/post.model";
import { SortOrder } from "../../../common/repository/sort-option";
import { PostListWithCursorDto } from "../../dto/post-list-with-cursor.dto";
import { PostWithWriterInfoDto } from "../../dto/post-with-writer-info.dto";
import { FindOption } from "../../../common/repository/find-option";

@QueryHandler(GetPostsOfFollowingsQuery)
export class GetPostsOfFollowingsHandler
  implements IQueryHandler<GetPostsOfFollowingsQuery>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(query: GetPostsOfFollowingsQuery) {
    const { nickname, pageSize, cursor } = query;
    const user = await this.usersRepository.findByNickname(nickname);
    const followingNicknames = user.followingNicknames;

    const findOption: FindOption<Post> = {
      writerNickname: { in: followingNicknames },
    };

    let posts: Post[];
    let nextPageCursor: string | undefined;
    let prevPageCursor: string | undefined;
    let totalCount: number;
    const totalCountPromise = this.postsRepository.count(findOption);
    if (!cursor) {
      // 첫페이지인 경우
      [posts, totalCount] = await Promise.all([
        this.postsRepository.findAllWith(
          findOption,
          ["writer"],
          {
            postId: SortOrder.DESC,
          },
          pageSize + 1,
        ),
        totalCountPromise,
      ]);
    } else {
      let prevPosts;
      [posts, prevPosts, totalCount] = await Promise.all([
        this.postsRepository.findAllWith(
          {
            ...findOption,
            postId: { lte: cursor },
          },
          ["writer"],
          {
            postId: SortOrder.DESC,
          },
          pageSize + 1,
        ),
        this.postsRepository.findAll(
          {
            ...findOption,
            postId: { gt: cursor },
          },
          {
            postId: SortOrder.ASC,
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
      posts: posts.map(PostWithWriterInfoDto.fromModel),
      prevPageCursor,
      nextPageCursor,
      totalCount,
    });
  }
}
