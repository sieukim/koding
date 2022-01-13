import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SendEmailCommand } from "../send-email.command";
import { EmailService } from "../../email.service";
import { Logger } from "@nestjs/common";

@CommandHandler(SendEmailCommand)
export class SendEmailHandler implements ICommandHandler<SendEmailCommand> {
  private readonly logger = new Logger(SendEmailHandler.name);

  constructor(private readonly emailService: EmailService) {}

  async execute(command: SendEmailCommand) {
    const { email, content, title } = command;
    await this.emailService.send({
      to: email,
      subject: title,
      html: content,
    });
    this.logger.log(`email sent to ${email}, with content ${content}`);
  }
}
