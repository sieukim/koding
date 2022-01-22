import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { UserDeletedEvent } from "../../users/events/user-deleted.event";
import { RenameCommentWriterToNullCommand } from "../commands/rename-comment-writer-to-null.command";

@Injectable()
export class CommentsSaga {
  @Saga()
  renameWriterToNull = ($events: Observable<any>) =>
    $events.pipe(
      ofType(UserDeletedEvent),
      map(({ nickname }) => new RenameCommentWriterToNullCommand(nickname)),
    );
}
