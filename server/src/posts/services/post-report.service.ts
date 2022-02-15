import { ConflictException, Injectable } from "@nestjs/common";
import { FilterQuery, Model, Types } from "mongoose";
import { PostReportDocument } from "../../schemas/post-report.schema";
import { InjectModel } from "@nestjs/mongoose";
import { PostIdentifier } from "../../models/post.model";
import { PostsRepository } from "../posts.repository";
import { PostDocument } from "../../schemas/post.schema";
import { SortOrder } from "../../common/repository/sort-option";

@Injectable()
export class PostReportService {
  constructor(
    @InjectModel(PostReportDocument.name)
    private readonly postReportModel: Model<PostReportDocument>,
    private readonly postsRepository: PostsRepository,
    @InjectModel(PostDocument.name)
    private readonly postModel: Model<PostDocument>,
  ) {}

  async reportPost(
    postIdentifier: PostIdentifier,
    nickname: string,
    reportReason: string,
  ) {
    const { postId, boardType } = postIdentifier;
    const exists = await this.postReportModel.exists({
      postId: new Types.ObjectId(postId),
      nickname,
      boardType,
    });
    if (!exists) {
      await Promise.all([
        this.postsRepository.increaseReportCount({
          postId,
          boardType,
        }),
        this.postReportModel.create({
          postId: new Types.ObjectId(postId),
          nickname,
          boardType,
          reportReason,
        }),
      ]);
    } else {
      throw new ConflictException("이미 신고한 게시글");
    }
  }

  async cancelReportPostByAdmin(
    postIdentifier: PostIdentifier,
    nickname: string,
  ) {
    const { postId, boardType } = postIdentifier;
    const deletedPostReport = await this.postReportModel
      .findOneAndDelete({
        postId: new Types.ObjectId(postId),
        nickname,
        boardType,
      })
      .exec();
    if (deletedPostReport) {
      await this.postsRepository.decreaseReportCount({
        postId,
        boardType,
      });
    }
  }

  async cancelAllReportPostByAdmin(postIdentifier: PostIdentifier) {
    const { postId, boardType } = postIdentifier;
    const deletedPostReport = await this.postReportModel
      .deleteMany({
        postId: new Types.ObjectId(postId),
        boardType,
      })
      .exec();
    if (deletedPostReport) {
      await this.postsRepository.decreaseReportCounts(
        {
          postId,
          boardType,
        },
        deletedPostReport.deletedCount,
      );
    }
  }

  async isUserReportPost(
    { postId, boardType }: PostIdentifier,
    nickname: string,
  ): Promise<boolean> {
    const exists = await this.postReportModel.exists({
      postId: new Types.ObjectId(postId),
      nickname,
      boardType,
    });
    return exists ?? false;
  }

  async getReportedPosts(pageSize: number, cursor?: string) {
    // 신고 수가 10 이상인 게시글만 조회
    const findOption: FilterQuery<PostDocument> = { reportCount: { $gte: 1 } };
    // const findOption: FilterQuery<PostDocument> = { reportCount: { $gte: 10 } };
    if (cursor) findOption._id = { $gte: new Types.ObjectId(cursor) };
    const postsWithReports = await this.postModel
      .find(findOption)
      .limit(pageSize)
      .sort({ reportCount: SortOrder.DESC }) // 신고 수가 많은 순서대로
      .populate("reports")
      .exec();
    return postsWithReports as Array<
      PostDocument & { reports: PostReportDocument[] }
    >;
  }

  removeOrphanPostReports({ postId, boardType }: PostIdentifier) {
    return this.postReportModel
      .deleteMany({
        postId: new Types.ObjectId(postId),
        boardType,
      })
      .exec();
  }
}
