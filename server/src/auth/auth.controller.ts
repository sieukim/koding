import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './guard/github-auth.guard';
import { Request } from 'express';
import { User } from '../schemas/user.schema';
import { LogoutGuard } from './guard/logout.guard';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LoginLocalDto } from './dto/login-local.dto';
import { LoggedInGuard } from './guard/logged-in.guard';

@ApiTags('AUTH')
@ApiUnauthorizedResponse({
  description: '인증 실패',
})
@Controller('api/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '이메일 로그인',
  })
  @ApiBody({ type: LoginLocalDto })
  @ApiNoContentResponse({
    description: '로그인 성공',
  })
  @ApiUnauthorizedResponse({
    description: '로그인 실패',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post()
  public localLogin() {
    return;
  }

  @ApiOperation({
    summary: '깃허브 회원가입',
    description: '깃허브 OAuth Access Token 을 이용해 로그인/회원가입',
  })
  @ApiQuery({
    name: 'code',
    description: '깃허브 인증 토큰',
    example: '22th2e1th8ec1296ab50',
  })
  @ApiNoContentResponse({
    description: '로그인/회원가입 성공',
  })
  @UseGuards(GithubAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/github/callback')
  public async getGithubInfo() {
    return;
  }

  @ApiOperation({
    summary: '로그인 유저 정보 확인',
  })
  @ApiOkResponse({
    description: '유저 정보 확인 성공',
    type: User,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  public getCurrentUser(@Req() req: Request) {
    if (!req.user) return ['hi'];
    if ((req.user as User).password) {
      const { password, ...rest } = req.user as User;
      return rest;
    } else return req.user;
  }

  @UseGuards(LoggedInGuard, LogoutGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  public logout() {
    return;
  }

  // @Post('/github/callback')
  // public async getGithubInfo(@Body() githubCodeDto: GithubCodeDto) {
  //   const user = await this.authService.getGithubInfo(githubCodeDto);
  //   return user;
  // }
}
