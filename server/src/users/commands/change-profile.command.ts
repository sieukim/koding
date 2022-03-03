import { ICommand } from "@nestjs/cqrs";
import { ChangeProfileRequestDto } from "../dto/change-profile-request.dto";

export class ChangeProfileCommand implements ICommand {
  constructor(
    public readonly nickname: string,
    public readonly request: ChangeProfileRequestDto,
  ) {}
}
