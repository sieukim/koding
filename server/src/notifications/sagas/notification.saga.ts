import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import {
  catchError,
  EMPTY,
  filter,
  map,
  mergeAll,
  mergeMap,
  Observable,
} from "rxjs";
import { CommentAddedEvent } from "../../comments/events/comment-added.event";
import { AddNotificationCommand } from "../commands/add-notification.command";
import {
  CommentDeletedNotificationData,
  CommentNotificationData,
  FollowNotificationData,
  MentionNotificationData,
  PostDeletedNotificationData,
} from "../../entities/notification.entity";
import { UserFollowedEvent } from "../../users/events/user-followed.event";
import { PostDeletedByAdminEvent } from "../../admin/events/post-deleted-by-admin.event";
import { CommentDeletedByAdminEvent } from "../../admin/events/comment-deleted-by-admin.event";
import { EntityManager } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";
import { Comment } from "../../entities/comment.entity";
import { Post } from "../../entities/post.entity";
import { Fetched } from "../../common/types/fetched.type";

@Injectable()
export class NotificationSaga {
  constructor(@InjectEntityManager() private readonly em: EntityManager) {}

  @Saga()
  commentNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentAddedEvent),
      mergeMap(async ({ postIdentifier, commentId }) => {
        const comment = (await this.em.findOneOrFail(Comment, {
          where: { commentId },
          relations: ["post"],
        })) as Fetched<Comment, "post">;
        comment.verifyOwnerPost(postIdentifier);
        return { post: comment.post, comment };
      }),
      catchError(() => EMPTY),
      filter(
        // 본인 게시글에 본인이 댓글을 단 경우는 알림에서 제외
        ({ post, comment }) => comment.writerNickname !== post.writerNickname,
      ),
      filter(
        // 게시글 혹은 댓글 작성자가 탈퇴한 경우는 알림에서 제외
        ({ post, comment }) =>
          post.writerNickname !== null && comment.writerNickname !== null,
      ),
      map(
        ({ post, comment }) =>
          new AddNotificationCommand(
            post.writerNickname!,
            new CommentNotificationData({
              commentId: comment.commentId,
              boardType: post.boardType,
              postId: post.postId,
              commentContent: comment.content,
              commentWriterNickname: comment.writerNickname!,
              postTitle: post.title,
            }),
          ),
      ),
    );

  @Saga()
  mentionNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentAddedEvent),
      mergeMap(async ({ postIdentifier, commentId }) => {
        const comment = (await this.em.findOneOrFail(Comment, {
          where: { commentId },
          relations: ["post"],
        })) as Fetched<Comment, "post">;
        comment.verifyOwnerPost(postIdentifier);
        return { post: comment.post, comment };
      }),
      catchError(() => EMPTY),
      filter(
        // 댓글 작성자가 탈퇴한 경우는 알림에서 제외
        ({ comment }) => comment.writerNickname !== null,
      ),
      map(({ post, comment }) =>
        comment.mentionedNicknames.map(
          (mentionedNickname) =>
            new AddNotificationCommand(
              mentionedNickname,
              new MentionNotificationData({
                postId: post.postId,
                postTitle: post.title,
                commentContent: comment.content,
                commentId: comment.commentId,
                commentWriterNickname: comment.writerNickname!,
                boardType: post.boardType,
              }),
            ),
        ),
      ),
      mergeAll(),
    );

  @Saga()
  followNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(UserFollowedEvent),
      map(
        (event) =>
          new AddNotificationCommand(
            event.toNickname,
            new FollowNotificationData({
              followerNickname: event.fromNickname,
            }),
          ),
      ),
    );

  @Saga()
  postDeletedNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(PostDeletedByAdminEvent),
      filter(({ post: { writerNickname } }) => writerNickname !== null),
      map(
        ({ post: { postId, boardType, writerNickname, title } }) =>
          new AddNotificationCommand(
            writerNickname!,
            new PostDeletedNotificationData({ postId, boardType, title }),
          ),
      ),
    );

  @Saga()
  commentDeletedNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentDeletedByAdminEvent),
      filter(({ comment: { writerNickname } }) => writerNickname !== null),
      mergeMap(
        async ({
          comment: {
            writerNickname: commentWriterNickname,
            commentId,
            postId,
            boardType,
            content,
          },
        }) => {
          const post = await this.em.findOneOrFail(Post, {
            where: { postId, boardType },
          });
          return new AddNotificationCommand(
            commentWriterNickname!,
            new CommentDeletedNotificationData({
              postId,
              boardType,
              commentId,
              postTitle: post.title,
              content,
            }),
          );
        },
      ),
      catchError(() => EMPTY),
    );
}
