import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  GithubRepositoryInfo,
  GithubUserInfo,
  User,
  UserDocument,
} from '../schemas/user.schema';
import { Model } from 'mongoose';
import { SignupLocalDto } from './dto/signup-local.dto';
import { EmailService } from '../email/email.service';
import axios from 'axios';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly emailService: EmailService,
  ) {}

  async signupLocal(signupLocalDto: SignupLocalDto) {
    const { id, email, nickname } = signupLocalDto;
    let user = await this.userModel
      .findOne({
        $or: [{ id }, { email }, { nickname }],
      })
      .exec();

    if (user) throw new ConflictException('이미 존재하는 사용자입니다');
    user = new this.userModel(signupLocalDto);
    await user.hashPassword();
    await user.save();

    await this.emailService.sendVerificationEmail(
      user.id,
      user.email,
      user.verifyToken,
    );
    return user;
  }

  async signupGithub(profile: any) {
    console.log(profile);
    const {
      id,
      login: githubId,
      email,
      name,
      avatar_url: avatarUrl,
      repos_url,
    } = profile._json;

    const githubUserIdentifier = id as number;

    const rawRepositories: Array<any> = (await axios.get(repos_url)).data;

    const repositories = rawRepositories.map(
      ({ name, html_url: htmlUrl, description, stargazers_count: starCount }) =>
        ({ name, htmlUrl, description, starCount } as GithubRepositoryInfo),
    );

    const githubUserInfo = {
      githubId,
      email,
      name,
      avatarUrl,
      repositories,
    } as GithubUserInfo;

    let user = await this.findUserByEmail(email, false);

    if (user) {
      user.githubUserIdentifier = githubUserIdentifier;
      user.githubUserInfo = githubUserInfo;
      await user.save();
    } else {
      user = new this.userModel({
        email,
        verified: true,
        githubUserInfo,
        githubUserIdentifier: githubUserIdentifier,
      });
      await user.save();
    }
    return user;
  }

  async signupKakao(profile: any) {
    console.log(profile);
    const id = profile._json.id as number;
    const hasEmail = profile._json.has_email as boolean;

    if (!hasEmail)
      throw new BadRequestException('이메일 수집 동의가 필요합니다');

    const email = profile._json.email as string;

    let user = await this.findUserByEmail(email, false);
    if (user) {
      user.kakaoUserIdentifier = id;
      await user.save();
    } else {
      user = new this.userModel({ email, kakaoUserIdentifier: id });
      await user.save();
    }
    return user;
  }

  async verifySignup(id: string, verifyToken: string) {
    const user = await this.userModel.findOne({ id }).exec();
    if (!user) throw new NotFoundException('없는 사용자입니다');
    if (user.verifyToken !== verifyToken)
      throw new BadRequestException('잘못된 인증 토큰입니다');
    user.verifyToken = undefined;
    user.verified = true;
    await user.save();
  }

  findUserById(id: string, includePassword = false) {
    return this.findUserByField({ id }, includePassword);
  }

  findUserByEmail(email: string, includePassword = false) {
    return this.findUserByField({ email }, includePassword);
  }

  private findUserByField(condition: Partial<User>, includePassword = false) {
    if (includePassword) return this.userModel.findOne(condition).exec();
    return this.userModel.findOne(condition).select('-password').exec();
  }

  async checkExistence(key: 'id' | 'nickname' | 'email', value: string) {
    const user = await this.userModel.findOne({ [key]: value }).exec();
    console.log(user);
    if (user) return true;
    return false;
  }
}
