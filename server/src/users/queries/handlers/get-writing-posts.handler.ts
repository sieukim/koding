import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetWritingPostsQuery } from "../get-writing-posts.query";
import { PostsRepository } from "../../../posts/posts.repository";
import { Post } from "../../../models/post.model";
import { SortOrder } from "../../../common/repository/sort-option";
import { WritingPostsInfoDto } from "../../dto/writing-posts-info.dto";
import { FindOption } from "../../../common/repository/find-option";

@QueryHandler(GetWritingPostsQuery)
export class GetWritingPostsHandler
  implements IQueryHandler<GetWritingPostsQuery>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(query: GetWritingPostsQuery) {
    const { nickname, boardType, pageSize, cursor } = query;
    const findOption: FindOption<Post> = {
      writerNickname: { eq: nickname },
      boardType: { eq: boardType },
    };
    if (cursor) findOption.postId = { lte: cursor };
    const posts = await this.postsRepository.findAll(
      findOption,
      { postId: SortOrder.DESC },
      pageSize + 1,
    );
    let nextPageCursor: string | undefined;
    if (posts.length === pageSize + 1) {
      nextPageCursor = posts.pop().postId;
    }
    return new WritingPostsInfoDto(posts, nextPageCursor);
  }
}
