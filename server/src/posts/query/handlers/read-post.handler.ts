import { EventPublisher, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadPostQuery } from "../read-post.query";
import { PostWithAroundInfoDto } from "../../dto/post-with-around-info.dto";
import { PostsRepository } from "../../posts.repository";
import { NotFoundException } from "@nestjs/common";
import { Post } from "../../../models/post.model";
import { SortOrder } from "../../../common/repository/sort-option";
import { PostLikeService } from "../../services/post-like.service";
import { PostScrapService } from "../../services/post-scrap.service";

@QueryHandler(ReadPostQuery)
export class ReadPostHandler implements IQueryHandler<ReadPostQuery> {
  constructor(
    private readonly postRepository: PostsRepository,
    private readonly postLikeService: PostLikeService,
    private readonly postScrapService: PostScrapService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(query: ReadPostQuery): Promise<PostWithAroundInfoDto> {
    const { postIdentifier, readerNickname } = query;
    const { postId, boardType } = postIdentifier;
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
    const [liked, scrapped, prevPost, nextPost] = await Promise.all([
      readerNickname
        ? this.postLikeService.isUserLikePost(postIdentifier, readerNickname)
        : false,
      readerNickname
        ? this.postScrapService.isUserScrapPost(postIdentifier, readerNickname)
        : false,
      this.postRepository.findOne(
        {
          boardType: { eq: boardType },
          postId: { gt: postId },
        },
        { postId: SortOrder.ASC },
      ),
      this.postRepository.findOne(
        {
          boardType: { eq: boardType },
          postId: { lt: postId },
        },
        { postId: SortOrder.DESC },
      ),
    ]);
    post.commit();
    return new PostWithAroundInfoDto(post, liked, scrapped, prevPost, nextPost);
  }
}
