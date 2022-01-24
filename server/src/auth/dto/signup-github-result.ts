import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../models/user.model";
import { MyUserInfoDto } from "../../users/dto/my-user-info.dto";
import { Expose, plainToClass } from "class-transformer";

export class SignupGithubResult extends MyUserInfoDto {
  @Expose({ name: "githubSignupVerifyToken", toClassOnly: true })
  @ApiProperty({
    description: "신규 유저의 깃허브 회원가입 인증 시 사용할 인증 토큰",
    example: "9ad4af90-6976-11ec-9730-131e1ddb758c",
  })
  verifyToken: string;

  static fromModel(user: User) {
    return plainToClass(SignupGithubResult, user, {
      excludeExtraneousValues: true,
    });
  }
}
