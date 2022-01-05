import { PickType } from "@nestjs/swagger";
import { Post } from "../../schemas/post.schema";


export class WritePostRequestDto extends PickType(Post, ["title", "markdownContent", "tags"]) {

}