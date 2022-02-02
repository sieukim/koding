import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetWritingPostsQuery } from "../get-writing-posts.query";
import { PostsRepository } from "../../../posts/posts.repository";
import { PostBoardType, PostBoardTypes } from "../../../models/post.model";
import { PostInfoDto } from "../../../posts/dto/post-info.dto";
import { SortType } from "../../../common/repository/sort-option";
import { WritingPostsInfoDto } from "../../dto/writing-posts-info.dto";

@QueryHandler(GetWritingPostsQuery)
export class GetWritingPostsHandler
  implements IQueryHandler<GetWritingPostsQuery, WritingPostsInfoDto>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(query: GetWritingPostsQuery): Promise<WritingPostsInfoDto> {
    const { nickname } = query;
    const posts = await this.postsRepository.findAll(
      {
        writerNickname: { eq: nickname },
      },
      { postId: SortType.DESC },
    );
    const boardPosts = PostBoardTypes.map((boardType) => ({
      [boardType]: [],
    })).reduce((result, obj) => ({ ...result, ...obj }), {}) as Record<
      PostBoardType,
      PostInfoDto[]
    >;
    for (const post of posts) {
      boardPosts[post.boardType].push(post);
    }
    return WritingPostsInfoDto.fromJson(boardPosts);
  }
}
