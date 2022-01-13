import { Injectable } from "@nestjs/common";
import Mail from "nodemailer/lib/mailer";
import { createTransport } from "nodemailer";
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
    const { baseUrl, service, host, port, adminId, adminPassword, adminEmail } =
      emailConfigService;
    this.baseUrl = baseUrl;
    this.transporter = createTransport({
      service,
      host,
      port,
      auth: {
        user: adminId,
        pass: adminPassword,
      },
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
      `,
    };
    return await this.send(mailOptions);
  }

  async send(mailOptions: EmailOptions) {
    return await this.transporter.sendMail({
      from: this.adminEmail,
      ...mailOptions,
    });
  }
}
