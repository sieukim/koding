import { PostBoardType } from "../../schemas/post.schema";
import { WritePostRequestDto } from "../dto/write-post-request.dto";
import { ICommand } from "@nestjs/cqrs";

export class WritePostCommand implements ICommand {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly writerNickname: string,
    public readonly writePostRequest: WritePostRequestDto,
  ) {}
}
