import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostBoardType, PostDocument } from "../schemas/post.schema";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { ModifyPostRequestDto } from "./dto/modify-post-request.dto";
import { WritePostRequestDto } from "./dto/write-post-request.dto";

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<Post>) {
  }

  async writePost(boardType: PostBoardType, writer: User, writePostRequest: WritePostRequestDto) {
    const { title, tags, markdownContent } = writePostRequest;
    const post = new this.postModel({ boardType, title, tags, markdownContent, writer });
    await post.save();
    return post;
  }

  async getPosts(boardType: PostBoardType) {
    const posts = await this.postModel.find({ boardType });
    return posts;
  }

  async readPost(boardType: PostBoardType, postId: string) {
    const post = await this.findByPostId(boardType, postId, { increaseReadCount: true, populate: ["writer"] });
    if (!post)
      throw new NotFoundException("없는 게시글입니다");
    return post;
  }

  async findByPostId(boardType: PostBoardType, postId: string, {
    increaseReadCount,
    populate = []
  }: { increaseReadCount: boolean, populate?: (keyof Post)[] }) {
    let query;
    if (increaseReadCount)
      query = this.postModel.findOneAndUpdate({ _id: postId, boardType }, {
        $inc: { readCount: 1 }
      }, { returnOriginal: false });
    else
      query = this.postModel.findOne({ _id: postId, boardType });
    if (populate.length >= 0)
      query = query.populate(populate);
    const post: PostDocument = await query.exec();
    return post;
  }

  async modifyPost(requestUser: User, boardType: PostBoardType, postId: string, {
    markdownContent,
    tags,
    title
  }: ModifyPostRequestDto) {
    const post = await this.findByPostId(boardType, postId, { increaseReadCount: false });
    if (!post.isOwner(requestUser))
      throw new ForbiddenException("글을 수정할 권한이 없습니다");
    post.modifyPost({ title, tags, markdownContent });
    await post.save();
    return post;
  }

  async deletePost(requestUser: User, boardType: PostBoardType, postId: string) {
    const post = await this.findByPostId(boardType, postId, { increaseReadCount: false });
    if (!post.isOwner(requestUser))
      throw new ForbiddenException("글을 삭제할 권한이 없습니다");
    await post.remove();
  }
}
