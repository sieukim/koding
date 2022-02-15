import { EventPublisher, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ReadPostQuery } from "../read-post.query";
import { PostWithAroundInfoDto } from "../../dto/post-with-around-info.dto";
import { PostsRepository } from "../../posts.repository";
import { CACHE_MANAGER, Inject, NotFoundException } from "@nestjs/common";
import { Post, PostIdentifier } from "../../../models/post.model";
import { SortOrder } from "../../../common/repository/sort-option";
import { PostLikeService } from "../../services/post-like.service";
import { PostScrapService } from "../../services/post-scrap.service";
import { Cache } from "cache-manager";
import { PostReportService } from "../../services/post-report.service";

@QueryHandler(ReadPostQuery)
export class ReadPostHandler implements IQueryHandler<ReadPostQuery> {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly postRepository: PostsRepository,
    private readonly postLikeService: PostLikeService,
    private readonly postScrapService: PostScrapService,
    private readonly postReportService: PostReportService,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(query: ReadPostQuery): Promise<PostWithAroundInfoDto> {
    const { postIdentifier, readerNickname, readerIp } = query;
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
    if (await this.shouldIncreaseReadCount(postIdentifier, readerIp))
      post.increaseReadCount();
    const [liked, scrapped, reported, prevPost, nextPost] = await Promise.all([
      readerNickname
        ? this.postLikeService.isUserLikePost(postIdentifier, readerNickname)
        : false,
      readerNickname
        ? this.postScrapService.isUserScrapPost(postIdentifier, readerNickname)
        : false,
      readerNickname
        ? this.postReportService.isUserReportPost(
            postIdentifier,
            readerNickname,
          )
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
    return new PostWithAroundInfoDto(
      post,
      liked,
      scrapped,
      reported,
      prevPost,
      nextPost,
    );
  }

  private async shouldIncreaseReadCount(
    postIdentifier: PostIdentifier,
    ip: string,
  ) {
    const key = postIdentifier.postId + "/" + ip;
    const isUserReadPost = (await this.cacheManager.get(key)) ?? false;
    console.log(`isUserReadPost: ${isUserReadPost}, ${key}`);
    if (isUserReadPost) {
      return false;
    } else {
      // 읽음 표시
      await this.cacheManager.set(key, true, { ttl: 24 * 60 * 60 }); // 하루
      return true;
    }
  }
}
