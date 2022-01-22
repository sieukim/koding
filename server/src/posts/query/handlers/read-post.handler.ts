import { EventPublisher, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadPostQuery } from "../read-post.query";
import { PostWithAroundInfoDto } from "../../dto/post-with-around-info.dto";
import { PostsRepository } from "../../posts.repository";
import { NotFoundException } from "@nestjs/common";
import { Post } from "../../../models/post.model";
import { User } from "../../../models/user.model";
import { SortType } from "../../../common/repository/sort-option";

@QueryHandler(ReadPostQuery)
export class ReadPostHandler implements IQueryHandler<ReadPostQuery> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(query: ReadPostQuery): Promise<PostWithAroundInfoDto> {
    const {
      postIdentifier: { postId, boardType },
    } = query;
    let post = (await this.postRepository.findOneWith(
      {
        boardType: { eq: boardType },
        postId: { eq: postId },
      },
      ["writer"],
    )) as Post & { writer: User };
    if (!post) throw new NotFoundException("잘못된 게시글 아이디");
    post = this.publisher.mergeObjectContext(post);
    post.increaseReadCount();
    post.commit();
    const prevPost: Post | null = await this.postRepository.findOne(
      {
        boardType: { eq: boardType },
        postId: { gt: postId },
      },
      { postId: SortType.ASC },
    );
    const nextPost: Post | null = await this.postRepository.findOne(
      {
        boardType: { eq: boardType },
        postId: { lt: postId },
      },
      { postId: SortType.DESC },
    );
    return new PostWithAroundInfoDto(post, prevPost, nextPost);
  }
}
