import { randomInt } from "crypto";

export const createRandomDigits = (length = 6) => {
  return Array.from({ length }, () => randomInt(0, 9)).join("");
};
