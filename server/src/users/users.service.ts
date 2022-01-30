import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "../schemas/user.schema";
import { FilterQuery, Model } from "mongoose";
import { SignupLocalRequestDto } from "./dto/signup-local-request.dto";
import { EmailService } from "../email/email.service";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { SignupLocalCommand } from "./commands/signup-local.command";
import { SignupGithubCommand } from "./commands/signup-github.command";
import { SignupGithubRequestDto } from "../auth/dto/signup-github-request.dto";
import { validateOrReject } from "class-validator";
import { VerifyEmailSignupCommand } from "./commands/verify-email-signup.command";
import { CheckExistenceQuery } from "./queries/check-existence.query";
import { CheckExistenceHandler } from "./queries/handlers/check-existence.handler";
import { FollowUserCommand } from "./commands/follow-user.command";
import { FollowUserHandler } from "./commands/handlers/follow-user.handler";
import { UnfollowUserCommand } from "./commands/unfollow-user.command";
import { UnfollowUserHandler } from "./commands/handlers/unfollow-user.handler";
import { SignupGithubHandler } from "./commands/handlers/signup-github.handler";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async signupLocal(signupLocalDto: SignupLocalRequestDto) {
    return this.commandBus.execute(new SignupLocalCommand(signupLocalDto));
  }

  async signupGithub(profile: any) {
    const {
      id,
      login: githubId,
      email,
      name,
      avatar_url: avatarUrl,
      repos_url,
    } = profile._json;

    const githubUserIdentifier = id as number;
    const signupGithubRequest = new SignupGithubRequestDto({
      githubId,
      email,
      name,
      reposUrl: repos_url,
      avatarUrl,
      githubUserIdentifier,
    });
    console.log(signupGithubRequest);
    await validateOrReject(signupGithubRequest);
    return (await this.commandBus.execute(
      new SignupGithubCommand(signupGithubRequest),
    )) as Awaited<ReturnType<SignupGithubHandler["execute"]>>;
  }

  async verifyEmailSignup(nickname: string, verifyToken: string) {
    return this.commandBus.execute(
      new VerifyEmailSignupCommand(nickname, verifyToken),
    );
  }

  findUserByNickname(
    nickname: string,
    includePassword = false,
    populate: (keyof UserDocument)[] = [],
  ) {
    if (populate.length <= 0)
      return this.findUserByField({ nickname }, includePassword);
    else return this.findUserByField({ nickname }, includePassword, populate);
  }

  findUserByEmail?(email: string, includePassword = false) {
    return this.findUserByField({ email }, includePassword);
  }

  checkExistence(key: "nickname" | "email", value: string) {
    return this.queryBus.execute(
      new CheckExistenceQuery(key, value),
    ) as ReturnType<CheckExistenceHandler["execute"]>;
  }

  followUser(from: { nickname: string }, to: { nickname: string }) {
    return this.commandBus.execute(
      new FollowUserCommand(from.nickname, to.nickname),
    ) as ReturnType<FollowUserHandler["execute"]>;
  }

  unfollowUser(from: { nickname: string }, to: { nickname: string }) {
    return this.commandBus.execute(
      new UnfollowUserCommand(from.nickname, to.nickname),
    ) as ReturnType<UnfollowUserHandler["execute"]>;
  }

  private findUserByField(
    condition: FilterQuery<UserDocument>,
    includePassword = false,
    populate: (keyof UserDocument)[] = [],
  ) {
    let query = this.userModel.findOne(condition);
    if (!includePassword) query = query.select("-password");
    if (populate.length > 0) query = query.populate(populate);
    return query.exec();
  }
}
