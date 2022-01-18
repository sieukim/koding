import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { TagDocument } from "../schemas/tag.schema";
import { InjectModel } from "@nestjs/mongoose";
import { PostBoardType } from "../models/post.model";

@Injectable()
export class TagsRepository {
  constructor(
    @InjectModel(TagDocument.name)
    private readonly tagModel: Model<TagDocument>,
  ) {}

  async increaseRefCount(
    boardType: PostBoardType,
    tags: string[],
  ): Promise<void> {
    if (tags.length <= 0) return;
    await this.tagModel.bulkWrite(
      tags.map((tag) => ({
        updateOne: {
          filter: { tag, boardType },
          update: { $inc: { refCount: 1 } },
          upsert: true,
        },
      })),
    );
  }

  async decreaseRefCount(
    boardType: PostBoardType,
    tags: string[],
  ): Promise<void> {
    if (tags.length <= 0) return;
    await this.tagModel.bulkWrite(
      tags.map((tag) => ({
        updateOne: {
          filter: { tag, boardType },
          update: { $inc: { refCount: -1 } },
          upsert: true,
        },
      })),
    );
    // 참조되지 않는 태그 삭제
    await this.tagModel
      .deleteMany({
        tags: { $in: tags },
        boardType,
        refCount: { $lte: 0 },
      })
      .exec();
  }

  async getCertifiedTags(boardType: PostBoardType): Promise<string[]> {
    const tags = await this.tagModel
      .find({ certified: true, boardType })
      .exec();
    return tags.map(({ tag }) => tag);
  }

  async getAllTags(boardType: PostBoardType): Promise<string[]> {
    const tags = await this.tagModel
      .find({
        boardType,
      })
      .exec();
    return tags.map(({ tag }) => tag);
  }

  async addCertifiedTags(boardType: PostBoardType, tags: string[]) {
    if (tags.length <= 0) return;
    await this.tagModel.bulkWrite(
      tags.map((tag) => ({
        updateOne: {
          filter: { tag, boardType },
          update: { $set: { certified: true } },
          upsert: true,
        },
      })),
    );
  }

  async removeCertifiedTags(boardType: PostBoardType, tags: string[]) {
    if (tags.length <= 0) return 0;
    const result = await this.tagModel.deleteMany({
      tags: { $in: tags },
      boardType,
      certified: true,
    });
    return result.deletedCount;
  }

  async removeAllCertifiedTags(boardType: PostBoardType) {
    const result = await this.tagModel.deleteMany({
      certified: true,
      boardType,
    });
    return result.deletedCount;
  }
}
