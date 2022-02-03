import { EventPublisher, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadPostQuery } from "../read-post.query";
import { PostWithAroundInfoDto } from "../../dto/post-with-around-info.dto";
import { PostsRepository } from "../../posts.repository";
import { NotFoundException } from "@nestjs/common";
import { Post } from "../../../models/post.model";
import { SortType } from "../../../common/repository/sort-option";
import { PostLikeService } from "../../services/post-like.service";

@QueryHandler(ReadPostQuery)
export class ReadPostHandler implements IQueryHandler<ReadPostQuery> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly postLikeService: PostLikeService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(query: ReadPostQuery): Promise<PostWithAroundInfoDto> {
    const {
      postIdentifier: { postId, boardType },
      readerNickname,
    } = query;
    let post = (await this.postRepository.findOneWith(
      {
        boardType: { eq: boardType },
        postId: { eq: postId },
      },
      ["writer"],
    )) as Post;
    if (!post) throw new NotFoundException("잘못된 게시글 아이디");
    post = this.publisher.mergeObjectContext(post);
    post.increaseReadCount();
    const [liked, prevPost, nextPost] = await Promise.all([
      readerNickname
        ? this.postLikeService.isUserLikePost(
            { postId, boardType },
            readerNickname,
          )
        : false,
      this.postRepository.findOne(
        {
          boardType: { eq: boardType },
          postId: { gt: postId },
        },
        { postId: SortType.ASC },
      ),
      this.postRepository.findOne(
        {
          boardType: { eq: boardType },
          postId: { lt: postId },
        },
        { postId: SortType.DESC },
      ),
    ]);
    post.commit();
    return new PostWithAroundInfoDto(post, liked, prevPost, nextPost);
  }
}
