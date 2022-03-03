import { User } from "./entities/user.entity";
import { Cache, Store } from "cache-manager";

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
  getClient: () => Redis.RedisClient;
  isCacheableValue: (value: any) => boolean;
}
