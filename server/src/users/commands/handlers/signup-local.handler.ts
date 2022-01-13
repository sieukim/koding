import { CommandHandler, EventPublisher, ICommandHandler } from "@nestjs/cqrs";
import { SignupLocalCommand } from "../signup-local.command";
import { UsersRepository } from "../../users.repository";
import { User } from "../../../models/user.model";
import { ConflictException, Logger } from "@nestjs/common";

@CommandHandler(SignupLocalCommand)
export class SignupLocalHandler implements ICommandHandler<SignupLocalCommand> {
  private readonly logger = new Logger(SignupLocalHandler.name);

  constructor(
    private readonly userRepository: UsersRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: SignupLocalCommand): Promise<User> {
    const { signupLocalRequest } = command;
    const { email, nickname, password, blogUrl, githubUrl, portfolioUrl } =
      signupLocalRequest;
    const users = await Promise.all([
      this.userRepository.findByNickname(nickname),
      this.userRepository.findByEmail(email),
    ]);
    if (users.find((user) => user !== null))
      throw new ConflictException("이미 존재하는 사용자입니다");
    const user = this.publisher.mergeObjectContext(
      new User({
        email,
        nickname,
        password,
        blogUrl,
        githubUrl,
        portfolioUrl,
        isEmailUser: true,
      }),
    );
    await user.hashPassword();
    await this.userRepository.persist(user);
    user.sendVerificationEmail();
    user.commit();
    this.logger.log(user);
    await this.userRepository.update(user);
    return user;
  }
}
