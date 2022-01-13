import { load } from "js-yaml";
import { readFileSync } from "fs";
import { join } from "path";

const YAML_CONFIG_FILENAME = "../../config.yml";

export const configuration = () => {
  return load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), "utf-8"),
  ) as Record<string, any>;
};
