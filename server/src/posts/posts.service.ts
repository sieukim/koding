import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostBoardType, PostDocument, PostIdentifier } from "../schemas/post.schema";
import { Model } from "mongoose";
import { User } from "../schemas/user.schema";
import { ModifyPostRequestDto } from "./dto/posts/modify-post-request.dto";
import { WritePostRequestDto } from "./dto/posts/write-post-request.dto";
import { AddCommentRequestDto } from "./dto/comments/add-comment-request.dto";
import { ModifyCommentRequestDto } from "./dto/comments/modify-comment-request.dto";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {
  }

  async writePost(
    boardType: PostBoardType,
    writer: User,
    writePostRequest: WritePostRequestDto,
  ) {
    const { title, tags, markdownContent } = writePostRequest;
    const post = new this.postModel({
      title,
      tags,
      markdownContent,
      boardType,
      writer: {
        _id: writer._id,
        nickname: writer.nickname,
      },
    });
    await post.save();
    return post;
  }

  async getPostsWithCursor(
    boardType: PostBoardType,
    cursorPostId: string | undefined,
    pageSize: number,
  ) {
    let posts: Post[];
    let nextPageCursor: string | undefined;
    let prevPageCursor: string | undefined;
    if (!cursorPostId) {
      // 첫페이지인 경우
      posts = await this.postModel
        .find({ boardType })
        .sort({ _id: -1 })
        .limit(pageSize + 1)
        .exec();
    } else {
      posts = await this.postModel
        .find({
          boardType,
          _id: { $lte: cursorPostId },
        })
        .sort({ _id: -1 })
        .limit(pageSize + 1)
        .exec();
      const prevPosts = await this.postModel
        .find({
          boardType,
          _id: { $gt: cursorPostId },
        })
        .sort({ _id: 1 })
        .limit(pageSize)
        .exec();
      if (prevPosts.length > 0)
        prevPageCursor = prevPosts[prevPosts.length - 1]._id.toString();
    }
    if (posts.length === pageSize + 1) {
      const nextCursorPost = posts.pop();
      nextPageCursor = nextCursorPost._id.toString();
    }
    return {
      posts,
      prevPageCursor,
      nextPageCursor,
    } as { posts: Post[]; prevPageCursor?: string; nextPageCursor?: string };
  }

  async readPost({ boardType, postId }: PostIdentifier) {
    const post = await this.findByPostId(
      { boardType, postId },
      { increaseReadCount: true, populate: ["writer"] }
    );
    const prevPost = await this.postModel.findOne({ boardType, _id: { $gt: postId } }).sort({ _id: 1 }).exec();
    const nextPost = await this.postModel.findOne({ boardType, _id: { $lt: postId } }).sort({ _id: -1 }).exec();
    return { post, prevPost, nextPost } as { post: Post, prevPost?: Post, nextPost?: Post };
  }

  async findByPostId(
    { boardType, postId }: PostIdentifier,
    {
      increaseReadCount,
      populate = [],
    }: { increaseReadCount: boolean; populate?: (keyof Post)[] },
  ) {
    let query;
    if (increaseReadCount)
      query = this.postModel.findOneAndUpdate(
        { _id: postId, boardType },
        {
          $inc: { readCount: 1 },
        },
        { returnOriginal: false },
      );
    else query = this.postModel.findOne({ _id: postId, boardType });
    if (populate.length >= 0) query = query.populate(populate);
    const post: PostDocument = await query.exec();
    if (!post) throw new NotFoundException('없는 게시글입니다');
    return post;
  }

  async modifyPost(
    requestUser: User,
    { boardType, postId }: PostIdentifier,
    { markdownContent, tags, title }: ModifyPostRequestDto,
  ) {
    const post = await this.findByPostId(
      { boardType, postId },
      { increaseReadCount: false },
    );
    if (!post.isOwner(requestUser))
      throw new ForbiddenException('글을 수정할 권한이 없습니다');
    post.modifyPost({ title, tags, markdownContent });
    await post.save();
    return post;
  }

  async deletePost(requestUser: User, { boardType, postId }: PostIdentifier) {
    const post = await this.findByPostId(
      { boardType, postId },
      { increaseReadCount: false },
    );
    if (!post.isOwner(requestUser))
      throw new ForbiddenException('글을 삭제할 권한이 없습니다');
    await post.remove();
  }

  async addComment(
    requestUser: User,
    { boardType, postId }: PostIdentifier,
    addCommentRequest: AddCommentRequestDto,
  ) {
    const post = await this.findByPostId(
      { boardType, postId },
      { increaseReadCount: false },
    );
    const mentionedUsers = await this.userModel.find({
      nickname: { $in: addCommentRequest.mentionedNicknames },
    });
    post.addComment(requestUser, {
      content: addCommentRequest.content,
      mentionedUsers,
    });
    await post.save();
    const comment = post.comments[post.comments.length - 1];
    return comment;
  }

  async modifyComment(
    requestUser: User,
    { boardType, postId }: PostIdentifier,
    commentId: string,
    modifyCommentRequest: ModifyCommentRequestDto,
  ) {
    const post = await this.findByPostId(
      { boardType, postId },
      { increaseReadCount: false },
    );
    const comment = post.getComment(commentId);
    if (!comment.isOwner(requestUser))
      throw new ForbiddenException('댓글을 수정할 권한이 없습니다');
    const { content, mentionedNicknames } = modifyCommentRequest;
    const mentionedUsers = await this.userModel.find({
      nickname: { $in: mentionedNicknames },
    });
    comment.modifyComment({ content, mentionedUsers });
    await post.save();
    return comment;
  }

  async deleteComment(
    requestUser: User,
    { boardType, postId }: PostIdentifier,
    commentId: string,
  ) {
    const post = await this.findByPostId(
      { boardType, postId },
      { increaseReadCount: false },
    );
    const comment = post.getComment(commentId);
    if (!comment.isOwner(requestUser))
      throw new ForbiddenException('댓글을 삭제할 권한이 없습니다');
    post.deleteComment(commentId);
    await post.save();
  }
}
