import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { SignupLocalCommand } from "../signup-local.command";
import { User } from "../../../entities/user.entity";
import { BadRequestException, ConflictException, Logger } from "@nestjs/common";
import { EntityManager, Transaction, TransactionManager } from "typeorm";
import { EmailVerifyToken } from "../../../entities/email-verify-token.entity";

@CommandHandler(SignupLocalCommand)
export class SignupLocalHandler implements ICommandHandler<SignupLocalCommand> {
  private readonly logger = new Logger(SignupLocalHandler.name);
  private readonly EmailUser: typeof User;

  constructor(private readonly publisher: EventPublisher) {
    this.EmailUser = this.publisher.mergeClassContext(User);
  }

  @Transaction()
  async execute(
    command: SignupLocalCommand,
    @TransactionManager()
    tm?: EntityManager,
  ): Promise<User> {
    const em = tm!;
    const { signupLocalRequest } = command;
    const {
      email,
      nickname,
      password,
      blogUrl,
      githubUrl,
      portfolioUrl,
      avatarUrl,
      techStack,
      interestTech,
      verifyToken,
    } = signupLocalRequest;
    const exists = await em.findOne(User, {
      where: [{ nickname }, { email }],
      select: ["nickname"],
    });
    if (exists) throw new ConflictException("이미 존재하는 사용자입니다");

    const emailToken = await em
      .findOneOrFail(EmailVerifyToken, { where: { email } })
      .catch(() => {
        throw new BadRequestException("잘못된 인증 토큰");
      });
    emailToken.verify(verifyToken);

    const user = new this.EmailUser({
      isEmailUser: true,
      email,
      nickname,
      password,
      blogUrl,
      githubUrl,
      portfolioUrl,
      avatarUrl,
      techStack,
      interestTech,
    });
    await user.hashPassword();
    await Promise.all([
      em.save(User, user, { reload: false }),
      em.remove(emailToken),
    ]);
    user.commit();
    this.logger.log("signup local user", user);
    return user;
  }
}
