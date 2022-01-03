import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Head,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query
} from "@nestjs/common";
import { SignupLocalDto } from "./dto/signup-local.dto";
import { UsersService } from "./users.service";
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { LoginResultDto } from "../auth/dto/login-result.dto";

@ApiTags("USER")
@ApiUnauthorizedResponse({
  description: "인증 실패"
})
@Controller("api/users")
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {
  }

  @ApiOperation({ summary: "회원가입" })
  @ApiCreatedResponse({
    description: "회원가입 성공, 확인 이메일 발송",
    type: LoginResultDto
  })
  @ApiConflictResponse({
    description: "회원가입 실패. 중복 있음"
  })
  @Post()
  async joinUser(@Body() signupUserDto: SignupLocalDto) {
    const user = await this.usersService.signupLocal(signupUserDto);
    return new LoginResultDto(user);
  }

  @ApiQuery({
    name: "key",
    required: true,
    description: "중복 확인하고 싶은 속성 키",
    example: "email",
    schema: {
      oneOf: [
        { type: "string", example: "email" },
        { type: "string", example: "nickname" }
      ]
    }
  })
  @ApiQuery({
    name: "value",
    required: true,
    description: "중복 확인하고 싶은 속성 값",
    example: "test@test.com",
    type: String
  })
  @ApiOperation({ summary: "중복 확인" })
  @ApiNoContentResponse({
    description: "중복 없음"
  })
  @ApiConflictResponse({
    description: "중복 있음"
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Head()
  async checkConflictUser(
    @Query("key") key: string,
    @Query("value") value: string
  ) {
    if (!["nickname", "email"].includes(key))
      throw new BadRequestException();
    if (
      await this.usersService.checkExistence(
        key as "nickname" | "email",
        value
      )
    )
      throw new ConflictException();
  }

  @ApiOperation({
    summary: "회원가입 이메일 인증"
  })
  @ApiQuery({
    name: "verifyToken",
    example: "9ad4af90-6976-11ec-9730-131e1ddb758c",
    description: "이메일 링크에 포함된 인증 토큰"
  })
  @ApiParam({
    name: "nickname",
    example: "testNickname123",
    description: "이메일 인증을 할 사용자 닉네임"
  })
  @ApiNoContentResponse({
    description: "이메일 인증 성공"
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get(":nickname/verify")
  async verifySignup(
    @Param("nickname") nickname: string,
    @Query("verifyToken") verifyToken: string
  ) {
    this.logger.log(`nickname: ${nickname}, verifyToken: ${verifyToken}`);
    await this.usersService.verifyEmailSignup(nickname, verifyToken);
  }
}
