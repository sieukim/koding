import { load } from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";

export interface KodingConfig {
  port: number;
  domain: string;
  environment: "production" | "development";

  cookie: {
    secret: string;
  };
  session: {
    secret: string;
    "cookie-name": string;
  };

  auth: {
    social: {
      github: {
        client_id: string;
        client_secret: string;
      };
    };
    email: {
      admin: {
        id: string;
        email: string;
        password: string;
      };
      host: string;
      port: number;
      service: string;
    };
  };

  aws: {
    s3: {
      "aws-key": string;
      "aws-secret": string;
      region: string;
      bucket: string;
      "key-prefix": {
        "post-image": string;
        "profile-avatar": string;
      };
    };
  };

  database: {
    elasticsearch: {
      host: string;
      username: string;
      password: string;
      index: {
        post: string;
        user: string;
      };
    };
    redis: {
      host: string;
      port: number;
    };
    mysql: {
      host: string;
      username: string;
      password: string;
      database: string;
    };
  };
}

const YAML_CONFIG_FILENAME = "../../config.yml";

export const configuration = () => {
  return load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), "utf-8"),
  ) as Record<string, any>;
};
