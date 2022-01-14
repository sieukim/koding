import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CommandBus } from "@nestjs/cqrs";
import { DeleteUnusedFilesCommand } from "./commands/delete-unused-files.command";
import { TemporaryUploadedFile } from "../schemas/temporary-uploaded-file.schema";

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async deleteUnusedTemporaryFile() {
    await this.commandBus.execute(new DeleteUnusedFilesCommand());
    this.logger.log(
      `unused(during ${TemporaryUploadedFile.EXPIRE_HOUR} hour) temporary files deleted`,
    );
  }
}
