import { IsNotEmpty, IsString } from "class-validator";

export class NicknameParamDto {
  /*
   * 사용자 닉네임
   */
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
