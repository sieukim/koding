import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { CertifiedTagDocument } from "../schemas/certified-tag.schema";
import { InjectModel } from "@nestjs/mongoose";
import { PostBoardType } from "../models/post.model";

@Injectable()
export class TagsRepository {
  constructor(
    @InjectModel(CertifiedTagDocument.name)
    private readonly tagModel: Model<CertifiedTagDocument>,
  ) {}

  async getCertifiedTags(boardType: PostBoardType): Promise<string[]> {
    const tags = await this.tagModel
      .find({ certified: true, boardType })
      .exec();
    return tags.map(({ tag }) => tag);
  }

  async addCertifiedTags(boardType: PostBoardType, tags: string[]) {
    if (tags.length <= 0) return;
    await this.tagModel.bulkWrite(
      tags.map((tag) => ({
        updateOne: {
          filter: { tag, boardType },
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
    });
    return result.deletedCount;
  }

  async removeAllCertifiedTags(boardType: PostBoardType) {
    const result = await this.tagModel.deleteMany({
      boardType,
    });
    return result.deletedCount;
  }
}
