import { ICommand } from "@nestjs/cqrs";

export class SavePostImageCommand implements ICommand {
  constructor(
    public readonly uploaderNickname: string,
    public readonly s3FileUrl: string,
    public readonly s3FileKey: string,
  ) {}
}
