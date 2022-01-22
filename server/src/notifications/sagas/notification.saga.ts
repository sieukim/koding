import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, mergeMap, Observable } from "rxjs";
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
      map(
        (event) =>
          new AddNotificationCommand(
            event.postWriterNickname,
            new CommentNotificationData({
              boardType: event.postIdentifier.boardType,
              postId: event.postIdentifier.postId,
              commentContent: event.commentContent,
              commentWriterNickname: event.commentWriterNickname,
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
          postWriterNickname,
          postIdentifier: { postId, boardType },
          commentId,
        }) =>
          mentionedUserNicknames.map(
            (mentionedNickname) =>
              new AddNotificationCommand(
                mentionedNickname,
                new MentionNotificationData({
                  postId,
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
            event.fromNickname,
            new FollowNotificationData({ followerNickname: event.toNickname }),
          ),
      ),
    );
}
