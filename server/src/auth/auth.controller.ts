import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Res,
  UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GithubAuthGuard } from "./guard/github-auth.guard";
import { User } from "../schemas/user.schema";
import { LogoutGuard } from "./guard/logout.guard";
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { LoginLocalRequest } from "./dto/login-local-request";
import { LoggedInGuard } from "./guard/logged-in.guard";
import { LoginUser } from "src/common/decorator/login-user.decorator";
import { LoginResultDto } from "./dto/login-result.dto";
import { Response } from "express";
import { SignupGithubVerifyRequestDto } from "./dto/signup-github-verify-request.dto";
import { SignupGithubResult } from "./dto/signup-github-result";

@ApiTags("AUTH")
@ApiUnauthorizedResponse({
  description: "인증 실패"
})
@Controller("api/auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {
  }

  @ApiOperation({
    summary: "이메일 로그인"
  })
  @ApiBody({ type: LoginLocalRequest })
  @ApiOkResponse({
    description: "로그인 & 회원가입 성공",
    type: LoginResultDto
  })
  @ApiUnauthorizedResponse({
    description: "로그인 실패"
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  public localLogin(@LoginUser() user: User) {
    return new LoginResultDto(user);
  }

  @ApiOperation({
    summary: "깃허브 로그인 & 회원가입",
    description: "깃허브 OAuth Access Token 을 이용해 로그인 & 회원가입"
  })
  @ApiQuery({
    name: "code",
    description: "깃허브 인증 토큰",
    example: "22th2e1th8ec1296ab50"
  })
  @ApiOkResponse({
    description: "기존 사용자 로그인 성공",
    type: LoginResultDto
  })
  @ApiCreatedResponse({
    description: "신규 사용자 회원가입 & 로그인 성공",
    type: SignupGithubResult
  })
  @ApiUnauthorizedResponse({
    description: "로그인 실패"
  })
  @UseGuards(GithubAuthGuard)
  @Get("/github/callback")
  public async githubLogin(@LoginUser() user: User, @Res({ passthrough: true }) res: Response) {

    if (user.githubSignupVerified) {
      // 기존 유저
      res.status(HttpStatus.OK);
      return new LoginResultDto(user);
    } else {
      // 신규 유저
      res.status(HttpStatus.CREATED);
      return new SignupGithubResult(user);
    }
  }


  @ApiOperation({
    summary: "깃허브 회원가입 인증",
    description: "깃허브 회원가입 시 필요한 추가적인 정보인 닉네임 설정"
  })
  @ApiBody({
    type: SignupGithubVerifyRequestDto
  })
  @ApiOkResponse({
    description: "닉네임 설정 성공",
    type: LoginResultDto
  })
  @ApiBadRequestResponse({
    description: "잘못된 verifyToken"
  })
  @ApiNotFoundResponse({
    description: "없는 email"
  })
  @HttpCode(HttpStatus.OK)
  @Post("/github/verify")
  async verifyGithubSignup(@Body() githubSignupVerifyDto: SignupGithubVerifyRequestDto) {
    const user = await this.authService.verifyGithubSignupUser(githubSignupVerifyDto);
    if (!user)
      throw new NotFoundException();
    return new LoginResultDto(user);
  }

  @ApiOperation({
    summary: "로그인 유저 정보 확인"
  })
  @ApiOkResponse({
    description: "유저 정보 확인 성공",
    type: LoginResultDto
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LoggedInGuard)
  @Get()
  public getCurrentUser(@LoginUser() user: User) {
    return new LoginResultDto(user);
  }

  @ApiOperation({
    summary: "로그아웃"
  })
  @ApiNoContentResponse({
    description: "로그아웃 성공"
  })
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
