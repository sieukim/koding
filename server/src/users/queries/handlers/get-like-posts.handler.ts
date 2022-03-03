import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetLikePostsQuery } from "../get-like-posts.query";
import { PostListDto } from "../../../posts/dto/post-list.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostLike } from "../../../entities/post-like.entity";
import { Post } from "../../../entities/post.entity";

@QueryHandler(GetLikePostsQuery)
export class GetLikePostsHandler implements IQueryHandler<GetLikePostsQuery> {
  @Transaction({ isolation: "READ UNCOMMITTED" })
  async execute(
    query: GetLikePostsQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { nickname } = query;

    const postLikes = (await em.find(PostLike, {
      where: { nickname },
      relations: ["post"],
      order: { createdAt: "ASC" },
    })) as Array<PostLike & { post: Post }>;
    const posts = postLikes.map((postLike) => postLike.post);
    return PostListDto.fromModel(posts, posts.length);
  }
}
