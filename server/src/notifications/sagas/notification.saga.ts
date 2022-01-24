import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { filter, map, mergeMap, Observable } from "rxjs";
import { CommentAddedEvent } from "../../comments/events/comment-added.event";
import { AddNotificationCommand } from "../commands/add-notification.command";
import {
  CommentNotificationData,
  FollowNotificationData,
  MentionNotificationData,
} from "../../models/notification.model";
import { UserFollowedEvent } from "../../users/events/user-followed.event";

@Injectable()
export class NotificationSaga {
  @Saga()
  commentNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentAddedEvent),
      filter(
        // 본인 게시글에 본인이 댓글을 단 경우는 알람에서 제외
        ({ commentWriterNickname, postWriterNickname }) =>
          commentWriterNickname !== postWriterNickname,
      ),
      map(
        ({
          commentContent,
          commentWriterNickname,
          postWriterNickname,
          postIdentifier: { postId, boardType },
          postTitle,
        }) =>
          new AddNotificationCommand(
            postWriterNickname,
            new CommentNotificationData({
              postTitle,
              boardType,
              postId,
              commentContent,
              commentWriterNickname,
            }),
          ),
      ),
    );

  @Saga()
  mentionNotification = ($events: Observable<any>) =>
    $events.pipe(
      ofType(CommentAddedEvent),
      mergeMap(
        ({
          mentionedUserNicknames,
          commentWriterNickname,
          commentContent,
          postTitle,
          postIdentifier: { postId, boardType },
          commentId,
        }) =>
          mentionedUserNicknames.map(
            (mentionedNickname) =>
              new AddNotificationCommand(
                mentionedNickname,
                new MentionNotificationData({
                  postId,
                  postTitle,
                  commentContent,
                  commentId,
                  commentWriterNickname,
                  boardType,
                }),
              ),
          ),
      ),
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
}
