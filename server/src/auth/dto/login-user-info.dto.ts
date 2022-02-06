import { MyUserInfoDto } from "../../users/dto/my-user-info.dto";

export class LoginUserInfoDto {
  /*
   * 로그인한 사용자 정보. 로그인한 상태가 아닌 경우 값 없음
   */
  loginUser?: MyUserInfoDto;

  constructor(myUserInfo?: MyUserInfoDto) {
    this.loginUser = myUserInfo;
  }
}
