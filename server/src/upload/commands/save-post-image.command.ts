import { ICommand } from "@nestjs/cqrs";

export class SavePostImageCommand implements ICommand {
  constructor(
    public readonly uploaderNickname: string,
    public readonly file: Express.MulterS3.File,
  ) {}
}
