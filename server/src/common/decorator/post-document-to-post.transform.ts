import { Transform } from "class-transformer";
import { Document } from "mongoose";
import { PostDocument } from "../../schemas/post.schema";

export const PostDocumentToPostTransform = () =>
  Transform(
    ({ value }) =>
      value instanceof Document
        ? PostDocument.toModel(value as PostDocument)
        : value,
    { toClassOnly: true },
  );
