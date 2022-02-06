import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GithubAuthGuard } from "./guard/github-auth.guard";
import { LogoutGuard } from "./guard/authorization/logout.guard";
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { LoginLocalRequest } from "./dto/login-local-request";
import { LoginUser } from "../common/decorator/login-user.decorator";
import { UserInfoDto } from "../users/dto/user-info.dto";
import { Response } from "express";
import { SignupGithubVerifyRequestDto } from "./dto/signup-github-verify-request.dto";
import { SignupGithubResult } from "./dto/signup-github-result";
import { PasswordResetEmailRequestDto } from "./dto/password-reset-email-request.dto";
import { PasswordResetRequestDto } from "./dto/password-reset.request.dto";
import { PasswordResetTokenVerifyRequestDto } from "./dto/password-reset-token-verify-request.dto";
import { User } from "../models/user.model";
import { QueryBus } from "@nestjs/cqrs";
import { MyUserInfoDto } from "../users/dto/my-user-info.dto";
import { GithubUserGuard } from "./guard/authorization/github-user.guard";
import { LoginUserInfoDto } from "./dto/login-user-info.dto";

@ApiTags("AUTH")
@Controller("api/auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({
    summary: "이메일 로그인",
  })
  @ApiBody({ type: LoginLocalRequest })
  @ApiOkResponse({
    description: "로그인 & 회원가입 성공",
    type: MyUserInfoDto,
  })
  @ApiUnauthorizedResponse({
    description: "로그인 실패",
  })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post()
  public localLogin(@LoginUser() user: User) {
    return MyUserInfoDto.fromModel(user);
  }

  @ApiOperation({
    summary: "깃허브 로그인 & 회원가입",
    description: "깃허브 OAuth Access Token 을 이용해 로그인 & 회원가입",
  })
  @ApiQuery({
    name: "code",
    description: "깃허브 인증 토큰",
    example: "22th2e1th8ec1296ab50",
  })
  @ApiOkResponse({
    description: "기존 사용자 로그인 성공",
    type: MyUserInfoDto,
  })
  @ApiCreatedResponse({
    description: "신규 사용자 회원가입 & 로그인 성공",
    type: SignupGithubResult,
  })
  @ApiUnauthorizedResponse({
    description: "유효하지 않은 토큰",
  })
  @UseGuards(GithubAuthGuard)
  @Get("/github/callback")
  async githubLogin(
    @LoginUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (user.githubSignupVerified) {
      // 기존 사용자
      res.status(HttpStatus.OK);
      return MyUserInfoDto.fromModel(user);
    } else {
      // 신규 사용자
      res.status(HttpStatus.CREATED);
      return SignupGithubResult.fromModel(user);
    }
  }

  @ApiOperation({
    summary: "깃허브 회원가입 인증",
    description: "깃허브 회원가입 시 필요한 추가적인 정보인 닉네임 설정",
  })
  @ApiBody({
    type: SignupGithubVerifyRequestDto,
  })
  @ApiOkResponse({
    description: "닉네임 설정 성공",
    type: MyUserInfoDto,
  })
  @ApiBadRequestResponse({
    description: "유효하지 않은 토큰",
  })
  @ApiNotFoundResponse({
    description: "가입하지 않은 이메일",
  })
  @UseGuards(GithubUserGuard)
  @HttpCode(HttpStatus.OK)
  @Post("/github/verify")
  async verifyGithubSignup(@Body() body: SignupGithubVerifyRequestDto) {
    const { email, nickname, verifyToken } = body;
    const user = await this.authService.verifyGithubSignupUser({
      email,
      nickname,
      verifyToken,
    });
    return UserInfoDto.fromModel(user);
  }

  @ApiOperation({
    summary: "로그인 여부 확인",
  })
  @ApiOkResponse({
    description: "로그인 여부 확인 성공",
    type: LoginUserInfoDto,
  })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCurrentUser(@LoginUser() user?: User) {
    if (!user) return new LoginUserInfoDto();
    const myUserInfo = MyUserInfoDto.fromModel(user);
    return new LoginUserInfoDto(myUserInfo);
  }

  @ApiOperation({
    summary: "로그아웃",
  })
  @ApiNoContentResponse({
    description: "로그아웃 성공",
  })
  @UseGuards(LogoutGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  logout() {
    return;
  }

  @ApiOperation({
    summary: "비밀번호 찾기 요청",
    description: "이메일로 비밀번호 초기화 토큰 전송",
  })
  @ApiBody({
    type: PasswordResetEmailRequestDto,
  })
  @ApiAcceptedResponse({
    description: "비밀번호 초기화 메일 전송 완료",
  })
  @ApiForbiddenResponse({
    description: "이메일로 가입한 사용자가 아님",
  })
  @ApiNotFoundResponse({
    description: "가입한 적 없는 이메일",
  })
  @HttpCode(HttpStatus.ACCEPTED)
  @Delete("/email/password")
  async requestResetPassword(@Body() body: PasswordResetEmailRequestDto) {
    const { email } = body;
    await this.authService.sendPasswordResetToken({ email });
  }

  @ApiOperation({
    summary: "비밀번호 초기화 토큰 검증",
  })
  @ApiBody({
    type: PasswordResetTokenVerifyRequestDto,
  })
  @ApiBadRequestResponse({
    description: "유효하지 않은 토큰",
  })
  @ApiForbiddenResponse({
    description: "이메일로 가입한 사용자가 아님",
  })
  @ApiNotFoundResponse({
    description: "가입한 적 없는 이메일",
  })
  @ApiNoContentResponse({
    description: "유효한 토큰",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("/email/password/verifyToken")
  async checkPasswordTokenValidity(
    @Body() body: PasswordResetTokenVerifyRequestDto,
  ) {
    const { email, verifyToken } = body;
    await this.authService.checkPasswordTokenValidity({ email, verifyToken });
  }

  @ApiOperation({
    summary: "비밀번호 초기화",
    description: "비밀번호 찾기 요청을 통해 이메일로 받은 토큰를 이용해 초기화",
  })
  @ApiBody({
    type: PasswordResetRequestDto,
  })
  @ApiBadRequestResponse({
    description: "유효하지 않은 토큰",
  })
  @ApiForbiddenResponse({
    description: "이메일로 가입한 사용자가 아님",
  })
  @ApiNotFoundResponse({
    description: "가입한 적 없는 이메일",
  })
  @ApiNoContentResponse({
    description: "비밀번호 초기화 완료",
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("/email/password")
  async resetPassword(@Body() body: PasswordResetRequestDto) {
    const { email, password, verifyToken } = body;
    await this.authService.resetPassword({ email, password, verifyToken });
  }
}
