import { Transform } from "class-transformer";
import { UserDocument } from "../../schemas/user.schema";
import { Document } from "mongoose";

export const UserDocumentToUserTransformDecorator = () =>
  Transform(
    ({ value }) =>
      value instanceof Document
        ? UserDocument.toModel(value as UserDocument)
        : value,
    { toClassOnly: true },
  );
