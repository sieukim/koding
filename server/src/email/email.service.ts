import { Injectable } from "@nestjs/common";
import Mail from "nodemailer/lib/mailer";
import { createTransport } from "nodemailer";
import { URLSearchParams } from "url";
import { EmailConfigService } from "./email-config.service";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly transporter: Mail;
  private readonly baseUrl: string;
  private readonly adminEmail: string;

  constructor(private readonly emailConfigService: EmailConfigService) {
    const { baseUrl, service, host, port, adminId, adminPassword, adminEmail } = emailConfigService;
    this.baseUrl = baseUrl;
    this.transporter = createTransport({
      service,
      host,
      port,
      auth: {
        user: adminId,
        pass: adminPassword
      }
    });
    this.adminEmail = adminEmail;
  }

  async sendPasswordResetToken(email: string, verifyToken: string) {
    const mailOptions: EmailOptions = {
      to: email,
      subject: "비밀번호 초기화 인증토큰 메일",
      html: `
        비밀번호 초기화 인증토큰입니다.<br/>
        <b>${verifyToken}</b>
      `
    };
    return await this.send(mailOptions);
  }

  async sendVerificationEmail(nickname: string, email: string, verifyToken: string) {
    const verificationUrl = `${
      this.baseUrl
    }/api/users/${nickname}/verify?${new URLSearchParams({ verifyToken }).toString()}`;

    const mailOptions: EmailOptions = {
      to: email,
      subject: "회원가입 인증 메일",
      html: `
        가입 확인 버튼을 누르시면 가입 인증이 완료됩니다.<br/>
        <a href="${verificationUrl}">가입 확인</a>
      `
    };
    return await this.send(mailOptions);
  }

  private async send(mailOptions: EmailOptions) {
    return await this.transporter.sendMail({
      from: this.adminEmail,
      ...mailOptions
    });
  }
}
