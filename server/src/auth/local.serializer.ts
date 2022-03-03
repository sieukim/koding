import { PassportSerializer } from "@nestjs/passport";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { User } from "../entities/user.entity";
import { EntityManager } from "typeorm";
import { InjectEntityManager } from "@nestjs/typeorm";

@Injectable()
export class LocalSerializer extends PassportSerializer {
  private readonly logger = new Logger(LocalSerializer.name);

  constructor(@InjectEntityManager() private readonly em: EntityManager) {
    super();
  }

  async deserializeUser(email: any, done: CallableFunction) {
    try {
      const user = await this.em.findOne(User, { where: { email } });
      this.logger.log(`deserialize User ${email}`);
      if (user) done(null, user);
      else throw new NotFoundException();
    } catch (e) {
      this.logger.error(e);
      done(e);
    }
  }

  async serializeUser(user: User, done: CallableFunction) {
    this.logger.log(`serialize User ${user} ${user.email}`);
    done(null, user.email);
  }
}
