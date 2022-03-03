import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EmailConfigService {
  constructor(private readonly configService: ConfigService<any, true>) {}

  get baseUrl() {
    return (
      this.configService.get<string>("domain") +
      ":" +
      this.configService.get<number>("port")
    );
  }

  get service() {
    return this.configService.get<string>("auth.email.service");
  }

  get host() {
    return this.configService.get<string>("auth.email.host");
  }

  get port() {
    return this.configService.get<number>("auth.email.port");
  }

  get adminId() {
    return this.configService.get<string>("auth.email.admin.id");
  }

  get adminPassword() {
    return this.configService.get<string>("auth.email.admin.password");
  }

  get adminEmail() {
    return this.configService.get<string>("auth.email.admin.email");
  }
}
