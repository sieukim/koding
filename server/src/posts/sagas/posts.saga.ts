import { Injectable } from "@nestjs/common";
import { ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { UserDeletedEvent } from "../../users/events/user-deleted.event";
import { RenamePostWriterToNullCommand } from "../commands/rename-post-writer-to-null.command";

@Injectable()
export class PostsSaga {
  @Saga()
  updatePostWriterToNull = ($events: Observable<any>) =>
    $events.pipe(
      ofType(UserDeletedEvent),
      map(({ nickname }) => new RenamePostWriterToNullCommand(nickname)),
    );
}
