import { ApiForbiddenResponse } from "@nestjs/swagger";


export const ApiForbiddenGithubUserResponse = ApiForbiddenResponse({
  description: "깃허브 연동 유저가 아님"
});

export const ApiForbiddenEmailUserResponse = ApiForbiddenResponse({
  description: "이메일로 가입한 유저가 아님"
});

export const ApiForbiddenLoggedInUserResponse = ApiForbiddenResponse({
  description: "로그인한 유저가 아님"
});

export const ApiForbiddenLoggedOutUserResponse = ApiForbiddenResponse({
  description: "로그인하지 않은 유저가 아님"
});
