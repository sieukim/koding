import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { SendEmailCommand } from "../../email/commands/send-email.command";
import { ConfigService } from "@nestjs/config";
import { ResetPasswordRequestedEvent } from "../events/reset-password-requested.event";
import { EmailVerifyTokenCreatedEvent } from "../events/email-verify-token-created.event";

@Injectable()
export class EmailSagas {
  private readonly baseUrl: string;

  constructor(configService: ConfigService<any, true>) {
    this.baseUrl =
      configService.get("domain") + ":" + configService.get("port");
  }

  @Saga()
  sendVerificationEmail = (events$: Observable<any>): Observable<ICommand> =>
    events$.pipe(
      ofType(EmailVerifyTokenCreatedEvent),
      map(
        ({ verifyToken, email }) =>
          new SendEmailCommand(
            email,
            "회원가입 인증 메일",
            `
        이메일 인증 인증토큰입니다.<br/>
        <b>${verifyToken}</b>
      `,
          ),
      ),
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
        ${nickname} 사용자의 비밀번호 초기화 인증토큰입니다.<br/>
        <b>${verifyToken}</b>
      `,
          ),
      ),
    );
}
