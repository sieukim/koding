import { Injectable } from "@nestjs/common";
import Mail from "nodemailer/lib/mailer";
import { ConfigService } from "@nestjs/config";
import { createTransport } from "nodemailer";
import { URLSearchParams } from "url";

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

    constructor(configService: ConfigService) {
        this.baseUrl = `http://localhost:${
          configService.get<number>("port") ?? 3001
        }`;
        this.transporter = createTransport({
            service: configService.get<string>("auth.email.service"),
            host: configService.get<string>("auth.email.host"),
            port: configService.get<number>("auth.email.port"),
            auth: {
                user: configService.get<string>("auth.email.admin.id"),
                pass: configService.get<string>("auth.email.admin.password")
            }
        });
        this.adminEmail = configService.get<string>("auth.email.admin.email");
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
        <a href='${verificationUrl}'>가입 확인</a>
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
