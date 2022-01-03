import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GithubRepositoryInfo, GithubUserInfo, User, UserDocument } from "../schemas/user.schema";
import { Model } from "mongoose";
import { SignupLocalDto } from "./dto/signup-local.dto";
import { EmailService } from "../email/email.service";
import axios from "axios";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService
  ) {
  }

  async signupLocal(signupLocalDto: SignupLocalDto) {
    const { email, nickname } = signupLocalDto;
    let user = await this.userModel
      .findOne({
        $or: [{ email }, { nickname }]
      })
      .exec();

    if (user) throw new ConflictException("이미 존재하는 사용자입니다");
    user = new this.userModel(signupLocalDto);
    user.setNewEmailSignupVerifyToken();
    await user.hashPassword();
    await user.save();

    await this.emailService.sendVerificationEmail(
      user.nickname,
      user.email,
      user.emailSignupVerifyToken
    );
    return user as User;
  }

  async signupGithub(profile: any) {
    const {
      id,
      login: githubId,
      email,
      name,
      avatar_url: avatarUrl,
      repos_url
    } = profile._json;

    const githubUserIdentifier = id as number;

    let user = await this.findUserByField({ githubUserIdentifier });
    if (user)
      return user as User;


    const rawRepositories: Array<any> = (await axios.get(repos_url)).data;

    const repositories = rawRepositories.map(
      ({ name, html_url: htmlUrl, description, stargazers_count: starCount }) =>
        ({ name, htmlUrl, description, starCount } as GithubRepositoryInfo)
    );

    const githubUserInfo = {
      githubId,
      email,
      name,
      avatarUrl,
      repositories
    } as GithubUserInfo;

    user = await this.findUserByEmail(email, false);

    if (user) {
      user.githubUserIdentifier = githubUserIdentifier;
      user.githubUserInfo = githubUserInfo;
      user.githubSignupVerified = true;
      await user.save();
    } else {
      user = new this.userModel({
        email,
        emailSignupVerified: true,
        githubSignupVerified: false,
        githubUserInfo,
        githubUserIdentifier: githubUserIdentifier
      });
      user.setNewGithubSignupVerifyToken();
      await user.save();
    }
    return user as User;
  }

  async verifyEmailSignup(nickname: string, verifyToken: string) {
    const user = await this.findUserByNickname(nickname);
    if (!user) throw new NotFoundException("없는 사용자입니다");
    if (user.emailSignupVerifyToken !== verifyToken)
      throw new BadRequestException("잘못된 인증 토큰입니다");
    user.emailSignupVerifyToken = undefined;
    user.emailSignupVerified = true;
    await user.save();
  }


  findUserByNickname(nickname: string, includePassword = false) {
    return this.findUserByField({ nickname }, includePassword);
  }

  findUserByEmail?(email: string, includePassword = false) {
    return this.findUserByField({ email }, includePassword);
  }

  async checkExistence(key: "nickname" | "email", value: string) {
    const user = await this.userModel.findOne({ [key]: value }).exec();
    console.log(user);
    if (user) return true;
    return false;
  }

  private findUserByField(condition: Partial<User>, includePassword = false) {
    if (includePassword) return this.userModel.findOne(condition).exec();
    return this.userModel.findOne(condition).select("-password").exec();
  }
}
