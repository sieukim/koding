import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordRequestDto {
  @IsString()
  @ApiProperty({
    description: "본인 확인용 현재 비밀번호",
  })
  currentPassword: string;

  @IsString()
  @ApiProperty({
    description: "새로운 비밀번호",
  })
  newPassword: string;
}
