import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CheckUserLikePostQuery } from "../check-user-like-post.query";
import { UserLikePostInfoDto } from "../../dto/user-like-post-info.dto";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { PostLike } from "../../../entities/post-like.entity";

@QueryHandler(CheckUserLikePostQuery)
export class CheckUserLikePostHandler
  implements IQueryHandler<CheckUserLikePostQuery>
{
  @Transaction()
  async execute(
    query: CheckUserLikePostQuery,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const {
      postIdentifier: { postId, boardType },
      nickname,
    } = query;
    const isUserLiked = await em
      .findOne(PostLike, { where: { postId, nickname } })
      .then((postLike) => !!postLike);
    return new UserLikePostInfoDto(
      { postId, boardType },
      nickname,
      isUserLiked,
    );
  }
}
