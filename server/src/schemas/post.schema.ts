import { Document, Model, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserDocument } from "./user.schema";
import { currentTime } from "../common/utils/current-time.util";
import { Post, PostBoardType } from "../models/post.model";
import { Expose, plainToClass, Transform, Type } from "class-transformer";

@Expose({ toClassOnly: true })
@Schema({
  id: false,
  _id: true,
  autoIndex: true,
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
    currentTime: currentTime,
  },
})
export class PostDocument extends Document {
  // @Prop({ type: Types.ObjectId })
  // _id: Types.ObjectId;

  postId: string;

  @Prop()
  title: string;

  @Prop({ type: String, default: "common" })
  boardType: PostBoardType;

  @Prop({
    type: String,
    required: false,
  })
  writerNickname?: string;

  @Type(() => UserDocument)
  @Transform(
    ({ value }) =>
      value instanceof UserDocument ? UserDocument.toModel(value) : value,
    { toClassOnly: true },
  )
  writer?: UserDocument;

  @Type(() => String)
  @Prop({ type: [String] })
  tags: string[];

  @Prop()
  markdownContent: string;

  @Prop({ type: Number, default: 0, min: 0 })
  readCount: number;

  createdAt: Date;

  @Type(() => String)
  @Prop({ type: [String] })
  imageUrls: string[];

  static toModel(postDocument: PostDocument): Post {
    console.log("before: ", postDocument);
    // TODO: PostDocument를 plainToClass를 이용해 Post로 바꿀 때 postId가 String이 아닌 Types.ObjectId인 문제 해결
    const result = plainToClass(Post, postDocument, {
      excludeExtraneousValues: true,
    });
    console.log("after: ", result);
    return result;
  }

  static fromModel(post: Post, model: Model<PostDocument>): PostDocument {
    return new model(post);
  }
}

export const PostSchema = SchemaFactory.createForClass(PostDocument);
PostSchema.index({ boardType: 1, _id: 1 });
PostSchema.virtual("writer", {
  ref: UserDocument.name,
  localField: "writerNickname",
  foreignField: "nickname",
  justOne: true,
});
PostSchema.virtual("postId")
  .get(function () {
    return this._id.toString();
  })
  .set(function (value) {
    if (value instanceof Types.ObjectId) this._id = value;
    else this._id = new Types.ObjectId(value);
  });
PostSchema.set("toObject", { virtuals: true });
PostSchema.set("toJSON", { virtuals: true });
