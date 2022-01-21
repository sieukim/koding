import { ModifyPostHandler } from "./modify-post.handler";
import { WritePostHandler } from "./write-post.handler";
import { DeletePostHandler } from "./delete-post.handler";
import { RenamePostWriterToNullHandler } from "./rename-post-writer-to-null.handler";

export const PostCommandHandlers = [
  ModifyPostHandler,
  WritePostHandler,
  DeletePostHandler,
  RenamePostWriterToNullHandler,
];
