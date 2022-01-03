import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailConfigService } from "./email-config.service";

@Module({
  providers: [EmailService, EmailConfigService],
  exports: [EmailService]
})
export class EmailModule {
}
