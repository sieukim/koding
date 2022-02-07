import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ProfileAvatarChangedEvent } from "../profile-avatar-changed.event";
import { ProfileAvatarUploadService } from "../../services/profile-avatar-upload.service";

@EventsHandler(ProfileAvatarChangedEvent)
export class ProfileAvatarChangedHandler
  implements IEventHandler<ProfileAvatarChangedEvent>
{
  constructor(
    private readonly profileAvatarUploadService: ProfileAvatarUploadService,
  ) {}

  async handle(event: ProfileAvatarChangedEvent) {
    const { changedImageUrl, prevImageUrl, nickname } = event;
    const promises: Promise<any>[] = [];
    if (prevImageUrl)
      promises.push(
        this.profileAvatarUploadService.removeProfileAvatarInfo(prevImageUrl),
      );
    if (changedImageUrl)
      promises.push(
        this.profileAvatarUploadService.setOwnerOfProfileAvatarInfo(
          changedImageUrl,
          nickname,
        ),
      );
    await Promise.all(promises);
  }
}
