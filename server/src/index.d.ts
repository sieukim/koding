import { User } from "./entities/user.entity";
import { Cache, Store } from "cache-manager";
import * as IORedis from "ioredis";

declare module "express" {
  interface Request {
    user?: User;
  }
}

interface RedisCache extends Cache {
  store: RedisStore;
}

interface RedisStore extends Store {
  name: "redis";
  getClient: () => IORedis.Redis;
  isCacheableValue: (value: any) => boolean;
}
