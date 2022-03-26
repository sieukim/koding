import { Injectable } from "@nestjs/common";
import { filter, map, Observable } from "rxjs";
import { Saga } from "@nestjs/cqrs";
import { PostDeletedEvent } from "../../posts/events/post-deleted.event";
import { PostDeletedByAdminEvent } from "../../admin/events/post-deleted-by-admin.event";
import { DeletePostElasticsearchCommand } from "../commands/delete-post-elasticsearch.command";

@Injectable()
export class PostSearchSaga {
  @Saga()
  syncDeletePost = ($events: Observable<any>) =>
    $events.pipe(
      filter(
        (event): event is PostDeletedEvent | PostDeletedByAdminEvent =>
          event instanceof PostDeletedEvent ||
          event instanceof PostDeletedByAdminEvent,
      ),
      map((event) => {
        if (event instanceof PostDeletedEvent)
          return new DeletePostElasticsearchCommand(event.postIdentifier);
        else
          return new DeletePostElasticsearchCommand({
            postId: event.post.postId,
            boardType: event.post.boardType,
          });
      }),
    );
}
