import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { KodingConfig } from "../config/configutation";

@Injectable()
export class EmailConfigService {
  constructor(
    private readonly configService: ConfigService<KodingConfig, true>,
  ) {}

  get baseUrl() {
    return (
      this.configService.get("domain", { infer: true }) +
      ":" +
      this.configService.get("port", { infer: true })
    );
  }

  get service() {
    return this.configService.get("auth.email.service", { infer: true });
  }

  get host() {
    return this.configService.get("auth.email.host", { infer: true });
  }

  get port() {
    return this.configService.get("auth.email.port", { infer: true });
  }

  get adminId() {
    return this.configService.get("auth.email.admin.id", { infer: true });
  }

  get adminPassword() {
    return this.configService.get("auth.email.admin.password", { infer: true });
  }

  get adminEmail() {
    return this.configService.get("auth.email.admin.email", { infer: true });
  }
}
