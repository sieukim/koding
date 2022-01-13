import { Module } from "@nestjs/common";
import { EmailService } from "./email.service";
import { EmailConfigService } from "./email-config.service";
import { EmailEventHandlers } from "./commands/handlers";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
  imports: [CqrsModule],
  providers: [EmailService, EmailConfigService, ...EmailEventHandlers],
  exports: [EmailService],
})
export class EmailModule {}
