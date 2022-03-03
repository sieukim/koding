import { WritePostRequestDto } from "../dto/write-post-request.dto";
import { ICommand } from "@nestjs/cqrs";
import { PostBoardType } from "../../entities/post-board.type";

export class WritePostCommand implements ICommand {
  constructor(
    public readonly boardType: PostBoardType,
    public readonly writerNickname: string,
    public readonly writePostRequest: WritePostRequestDto,
  ) {}
}
