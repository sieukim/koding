import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { SignupLocalCommand } from "../signup-local.command";
import { UsersRepository } from "../../users.repository";
import { User } from "../../../models/user.model";
import { ConflictException, Logger } from "@nestjs/common";

@CommandHandler(SignupLocalCommand)
export class SignupLocalHandler implements ICommandHandler<SignupLocalCommand> {
  private readonly logger = new Logger(SignupLocalHandler.name);
  private readonly EmailUser: typeof User;

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly publisher: EventPublisher,
  ) {
    this.EmailUser = this.publisher.mergeClassContext(User);
  }

  async execute(command: SignupLocalCommand): Promise<User> {
    const { signupLocalRequest } = command;
    const {
      email,
      nickname,
      password,
      blogUrl,
      githubUrl,
      portfolioUrl,
      avatarUrl,
    } = signupLocalRequest;
    const users = await Promise.all([
      this.userRepository.findByNickname(nickname),
      this.userRepository.findByEmail(email),
    ]);
    if (users.find((user) => user !== null))
      throw new ConflictException("이미 존재하는 사용자입니다");
    const user = new this.EmailUser({
      email,
      nickname,
      password,
      blogUrl,
      githubUrl,
      portfolioUrl,
      avatarUrl,
      isEmailUser: true,
    });
    await user.hashPassword();
    await this.userRepository.persist(user);
    user.commit();
    this.logger.log(user);
    return user;
  }
}
