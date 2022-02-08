import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { filter, map, mergeAll, mergeMap, Observable } from "rxjs";
import { CommentAddedEvent } from "../../comments/events/comment-added.event";
import { AddNotificationCommand } from "../commands/add-notification.command";
import {
  CommentDeletedNotificationData,
  CommentNotificationData,
  FollowNotificationData,
  MentionNotificationData,
  PostDeletedNotificationData,
} from "../../models/notification.model";
import { UserFollowedEvent } from "../../users/events/user-followed.event";
import { PostDeletedByAdminEvent } from "../../admin/events/post-deleted-by-admin.event";
import { CommentDeletedByAdminEvent } from "../../admin/events/comment-deleted-by-admin.event";
import { CommentsRepository } from "../../comments/comments.repository";
import { PostsRepository } from "../../posts/posts.repository";

@Injectable()
export class NotificationSaga {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly postsRepository: PostsRepository,
  ) {}

  @Saga()
  commentNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentAddedEvent),
      mergeMap(async ({ postIdentifier: { postId, boardType }, commentId }) => {
        const [comment, post] = await Promise.all([
          this.commentsRepository.findByCommentId(commentId),
          this.postsRepository.findByPostId({ postId, boardType }),
        ]);
        if (comment.writerNickname !== post.writerNickname) {
          // 본인 게시글에 본인이 댓글을 단 경우는 알람에서 제외
          return null;
        }
        return new AddNotificationCommand(
          post.writerNickname,
          new CommentNotificationData({
            commentId,
            boardType,
            postId,
            commentContent: comment.content,
            commentWriterNickname: comment.writerNickname,
            postTitle: post.title,
          }),
        );
      }),
      filter((value) => value instanceof AddNotificationCommand),
    );

  @Saga()
  mentionNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentAddedEvent),
      mergeMap(async ({ postIdentifier: { postId, boardType }, commentId }) => {
        const [comment, post] = await Promise.all([
          this.commentsRepository.findByCommentId(commentId),
          this.postsRepository.findByPostId({ postId, boardType }),
        ]);
        return comment.mentionedNicknames.map(
          (mentionedNickname) =>
            new AddNotificationCommand(
              mentionedNickname,
              new MentionNotificationData({
                postId,
                postTitle: post.title,
                commentContent: comment.content,
                commentId,
                commentWriterNickname: comment.writerNickname,
                boardType,
              }),
            ),
        );
      }),
      mergeAll(), // 배열 flat
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
      map(
        ({ post: { postId, boardType, writerNickname, title } }) =>
          new AddNotificationCommand(
            writerNickname,
            new PostDeletedNotificationData({ postId, boardType, title }),
          ),
      ),
    );

  @Saga()
  commentDeletedNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentDeletedByAdminEvent),
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
          const post = await this.postsRepository.findByPostId({
            postId,
            boardType,
          });
          return new AddNotificationCommand(
            commentWriterNickname,
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
    );
}
