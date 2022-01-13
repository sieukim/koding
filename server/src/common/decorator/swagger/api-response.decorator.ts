import { ApiForbiddenResponse } from "@nestjs/swagger";

export const ApiForbiddenGithubUserResponse = ApiForbiddenResponse({
  description: "로그인하지 않았거나, 깃허브 연동 유저가 아님",
});

export const ApiForbiddenEmailUserResponse = ApiForbiddenResponse({
  description: "로그인하지 않았거나, 이메일로 가입한 유저가 아님",
});

export const ApiForbiddenVerifiedUserResponse = ApiForbiddenResponse({
  description:
    "로그인하지 않았거나, 회원가입 인증(이메일 인증 혹은 닉네임 설정)을 한 유저가 아님",
});

export const ApiForbiddenLoggedInUserResponse = ApiForbiddenResponse({
  description: "로그인한 유저가 아님",
});

export const ApiForbiddenLoggedOutUserResponse = ApiForbiddenResponse({
  description: "로그인하지 않은 유저가 아님",
});
