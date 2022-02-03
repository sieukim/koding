import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PostDocument } from "../../schemas/post.schema";
import { Model, Types } from "mongoose";
import { PostIdentifier } from "../../models/post.model";

@Injectable()
export class PostCommentCountService {
  constructor(
    @InjectModel(PostDocument.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  increaseCommentCount({ postId, boardType }: PostIdentifier) {
    return this.postModel.updateOne(
      {
        _id: new Types.ObjectId(postId),
        boardType,
      },
      { $inc: { commentCount: 1 } },
    );
  }

  decreaseCommentCount({ postId, boardType }: PostIdentifier) {
    return this.postModel.updateOne(
      {
        _id: new Types.ObjectId(postId),
        boardType,
      },
      { $inc: { commentCount: -1 } },
    );
  }
}
