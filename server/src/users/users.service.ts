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
    const {
      login: githubId,
      email,
      name,
      avatar_url: avatarUrl,
      repos_url,
    } = profile._json;

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

    let user = await this.userModel.findOne({ email }).exec();

    if (user) {
      user.githubUserInfo = githubUserInfo;
      await user.save();
    } else {
      user = new this.userModel({
        email,
        verified: true,
        githubUserInfo,
      });
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

  async findUserById(id: string, includePassword = false) {
    return this.userModel
      .findOne({ id }, { password: includePassword ? 1 : 0 })
      .exec();
  }

  async findUserByEmail(email: string, includePassword = false) {
    return this.userModel
      .findOne({ email }, { password: includePassword ? 1 : 0 })
      .exec();
  }

  async checkExistence(key: 'id' | 'nickname' | 'email', value: string) {
    const user = await this.userModel.findOne({ [key]: value }).exec();
    console.log(user);
    if (user) return true;
    return false;
  }

  async signupKakao(profile: any) {
    console.log(profile);
    return null;
  }
}
