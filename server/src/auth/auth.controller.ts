import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './guard/github-auth.guard';
import { User } from '../schemas/user.schema';
import { LogoutGuard } from './guard/logout.guard';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LoginLocalDto } from './dto/login-local.dto';
import { LoggedInGuard } from './guard/logged-in.guard';
import { KakaoAuthGuard } from './guard/kakao-auth.guard';
import { LoginUser } from 'src/common/decorator/login-user.decorator';
import { LoginResultDto } from '../users/dto/login-result.dto';

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
  @ApiOkResponse({
    description: '로그인/회원가입 성공',
    type: LoginResultDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 실패',
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  public localLogin(@LoginUser() user: User) {
    return new LoginResultDto(user);
  }

  @ApiOperation({
    summary: '깃허브 로그인/회원가입',
    description: '깃허브 OAuth Access Token 을 이용해 로그인/회원가입',
  })
  @ApiQuery({
    name: 'code',
    description: '깃허브 인증 토큰',
    example: '22th2e1th8ec1296ab50',
  })
  @ApiOkResponse({
    description: '로그인/회원가입 성공',
    type: LoginResultDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 실패',
  })
  @UseGuards(GithubAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/github/callback')
  public async githubLogin(@LoginUser() user: User) {
    return new LoginResultDto(user);
  }

  @ApiOperation({
    summary: '카카오 로그인/회원가입',
    description: '카카오 OAuth Access Token 을 이용해 로그인/회원가입',
  })
  @ApiQuery({
    name: 'code',
    description: '카카오 인증 토큰',
    example: '22th2e1th8ec1296ab50',
  })
  @ApiOkResponse({
    description: '로그인/회원가입 성공',
    type: LoginResultDto,
  })
  @ApiUnauthorizedResponse({
    description: '로그인 실패',
  })
  @UseGuards(KakaoAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/kakao/callback')
  public async kakaoLogin(@LoginUser() user: User) {
    return new LoginResultDto(user);
  }

  @ApiOperation({
    summary: '로그인 유저 정보 확인',
  })
  @ApiOkResponse({
    description: '유저 정보 확인 성공',
    type: LoginResultDto,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoggedInGuard)
  @Get()
  public getCurrentUser(@LoginUser() user: User) {
    return new LoginResultDto(user);
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
