import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
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
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { LoginResultDto } from "../auth/dto/login-result.dto";
import { User } from "../schemas/user.schema";
import { FollowUserDto } from "./dto/follow-user.dto";
import { FollowUserResultDto } from "./dto/follow-user-result.dto";
import { UnfollowUserResultDto } from "./dto/unfollow-user-result.dto";

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

  @ApiOperation({
    summary: "유저 팔로우"
  })
  @ApiParam({
    name: "nickname",
    description: "팔로우를 요청한 유저 닉네임"
  })
  @ApiBody({
    type: FollowUserDto
  })
  @ApiNotFoundResponse({
    description: "잘못된 닉네임"
  })
  @ApiOkResponse({
    description: "팔로우 완료(원래 이미 팔로우하고 있었던 경우도 포함)",
    type: FollowUserResultDto
  })
  @HttpCode(HttpStatus.OK)
  @Post(":nickname/followings")
  async followUser(@Param("nickname") nickname: string, @Body() body: FollowUserDto) {
    const { from, to } = await this.usersService.followUser({ nickname }, { nickname: body.nickname });
    return new FollowUserResultDto(from, to);
  }

  @ApiOperation({
    summary: "유저 언팔로우"
  })
  @ApiParam({
    name: "nickname",
    description: "언팔로우를 요청한 유저 닉네임"
  })
  @ApiParam({
    name: "followNickname",
    description: "언팔로우 할 유저 닉네임"
  })
  @ApiNotFoundResponse({
    description: "잘못된 닉네임"
  })
  @ApiOkResponse({
    description: "언팔로우 완료(원래 팔로우하지 않았던 경우도 포함)",
    type: UnfollowUserResultDto
  })
  @HttpCode(HttpStatus.OK)
  @Delete(":nickname/followings/:followNickname")
  async unfollowUser(@Param("nickname") nickname: string, @Param("followNickname") followNickname: string) {
    const { from, to } = await this.usersService.unfollowUser({ nickname }, { nickname: followNickname });
    return new UnfollowUserResultDto(from, to);
  }

  @ApiOperation({
    summary: "유저가 팔로잉하는 유저들 정보"
  })
  @ApiParam({
    name: "유저 닉네임"
  })
  @ApiNotFoundResponse({
    description: "없는 유저 닉네임"
  })
  @ApiOkResponse({
    description: "팔로잉하는 유저들 정보 조회 완료",
    type: [LoginResultDto]
  })
  @Get(":nickname/followings")
  async getFollowings(@Param("nickname") nickname: string) {
    const user = await this.usersService.findUserByNickname(nickname, false, ["followings"]);
    const followings = user.followings as User[];
    return followings.map(following => new LoginResultDto(following));
  }

  @ApiOperation({
    summary: "유저를 팔로우하는 유저들 정보"
  })
  @ApiParam({
    name: "유저 닉네임"
  })
  @ApiNotFoundResponse({
    description: "없는 유저 닉네임"
  })
  @ApiOkResponse({
    description: "팔로우하는 유저들 정보 조회 완료",
    type: [LoginResultDto]
  })
  @Get(":nickname/followers")
  async getFollowers(@Param("nickname") nickname: string) {
    const user = await this.usersService.findUserByNickname(nickname, false, ["followers"]);
    const followers = user.followers as User[];
    return followers.map(follower => new LoginResultDto(follower));
  }


}
