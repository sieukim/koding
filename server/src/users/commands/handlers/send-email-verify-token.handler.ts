import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { SendEmailVerifyTokenCommand } from "../send-email-verify-token.command";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { EmailVerifyToken } from "../../../entities/email-verify-token.entity";

@CommandHandler(SendEmailVerifyTokenCommand)
export class SendEmailVerifyTokenHandler
  implements ICommandHandler<SendEmailVerifyTokenCommand>
{
  private readonly MergedEmailVerifyToken: typeof EmailVerifyToken;

  constructor(private readonly publisher: EventPublisher) {
    this.MergedEmailVerifyToken = publisher.mergeClassContext(EmailVerifyToken);
  }

  @Transaction()
  async execute(
    command: SendEmailVerifyTokenCommand,
    @TransactionManager() tm?: EntityManager,
  ) {
    const em = tm!;
    const { email } = command;

    let emailToken = await em.findOne(EmailVerifyToken, { where: { email } });
    if (emailToken) {
      emailToken = this.publisher.mergeObjectContext(emailToken);
      emailToken.createVerifyToken();
    } else {
      emailToken = new this.MergedEmailVerifyToken({ email });
    }
    await em.save(EmailVerifyToken, emailToken, { reload: false });
    emailToken.commit();
  }
}
