import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetScrapPostsQuery } from "../get-scrap-posts.query";
import { PostListDto } from "../../../posts/dto/post-list.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostScrap } from "../../../entities/post-scrap.entity";
import { Post } from "../../../entities/post.entity";

@QueryHandler(GetScrapPostsQuery)
export class GetScrapPostsHandler implements IQueryHandler<GetScrapPostsQuery> {
  @Transaction()
  async execute(
    query: GetScrapPostsQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname } = query;
    const postScraps = (await em.find(PostScrap, {
      where: { nickname },
      relations: ["post"],
      order: { createdAt: "ASC" },
    })) as Array<PostScrap & { post: Post }>;
    const posts = postScraps.map((postScrap) => postScrap.post);
    return PostListDto.fromModel(posts, posts.length);
  }
}
