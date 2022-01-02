import { User } from "./schemas/user.schema";

declare module "express" {
    interface Request {
        user: User;
    }
}
