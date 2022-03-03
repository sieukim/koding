import { ApiProperty, PickType } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { TemporaryGithubUser } from "../../entities/temporary-github-user.entity";

export class SignupGithubResult extends PickType(TemporaryGithubUser, [
  "email",
  "verifyToken",
]) {
  @Expose()
  @ApiProperty({
    description: "이메일",
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: "신규 유저의 깃허브 회원가입 인증 시 사용할 인증 토큰",
    example: "9ad4af90-6976-11ec-9730-131e1ddb758c",
  })
  verifyToken: string;

  static fromModel(user: TemporaryGithubUser) {
    return plainToClass(SignupGithubResult, user, {
      excludeExtraneousValues: true,
    });
  }
}
