import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { EmailUserSignedUpEvent } from "../events/email-user-signed-up.event";
import { SendEmailCommand } from "../../email/commands/send-email.command";
import { ConfigService } from "@nestjs/config";
import { URLSearchParams } from "url";
import { ResetPasswordRequestedEvent } from "../events/reset-password-requested.event";

@Injectable()
export class EmailSagas {
  private readonly baseUrl: string;

  constructor(configService: ConfigService) {
    this.baseUrl =
      configService.get("domain") + ":" + configService.get("port");
  }

  @Saga()
  sendVerificationEmail = (events$: Observable<any>): Observable<ICommand> =>
    events$.pipe(
      ofType(EmailUserSignedUpEvent),
      map(({ verifyToken, email, nickname }) => {
        const verificationUrl = `${
          this.baseUrl
        }/api/users/${nickname}/verify?${new URLSearchParams({
          verifyToken,
        }).toString()}`;
        return new SendEmailCommand(
          email,
          "회원가입 인증 메일",
          `
        가입 확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
        <a href="${verificationUrl}">가입 확인</a>
      `,
        );
      }),
    );

  @Saga()
  sendPasswordResetEmail = (events$: Observable<any>): Observable<ICommand> =>
    events$.pipe(
      ofType(ResetPasswordRequestedEvent),
      map(
        ({ verifyToken, email, nickname }) =>
          new SendEmailCommand(
            email,
            "비밀번호 초기화 인증토큰 메일",
            `
        비밀번호 초기화 인증토큰입니다.<br/>
        <b>${verifyToken}</b>
      `,
          ),
      ),
    );
}
