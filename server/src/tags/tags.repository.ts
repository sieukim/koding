import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, In } from "typeorm";
import { Tag } from "../entities/tag.entity";
import { increaseField } from "../common/utils/increase-field";
import { PostBoardType } from "../entities/post-board.type";

@Injectable()
export class TagsRepository {
  constructor(@InjectEntityManager() private readonly em: EntityManager) {}

  async increaseRefCount(
    boardType: PostBoardType,
    tags: string[],
  ): Promise<void> {
    if (tags.length <= 0) return;
    this.em
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(tags.map((tag) => new Tag({ boardType, tag, certified: false })))
      .orIgnore(true);
    await increaseField(this.em, Tag, "refCount", 1, {
      tag: In(tags),
      boardType,
    });
  }

  async decreaseRefCount(
    boardType: PostBoardType,
    tags: string[],
  ): Promise<void> {
    if (tags.length <= 0) return;
    await increaseField(this.em, Tag, "refCount", -1, {
      tag: In(tags),
      boardType,
    });
  }

  async getAllTags(boardType: PostBoardType): Promise<string[]> {
    const tags = await this.em.find(Tag, {
      where: { boardType },
    });
    return tags.map(({ tag }) => tag);
  }

  async addCertifiedTags(boardType: PostBoardType, tags: string[]) {
    if (tags.length <= 0) return;
    await this.em.update(
      Tag,
      {
        tag: In(tags),
        boardType,
      },
      {
        certified: true,
      },
    );
    await this.em
      .createQueryBuilder()
      .insert()
      .into(Tag)
      .values(tags.map((tag) => new Tag({ tag, boardType, certified: true })))
      .orUpdate(["certified"], ["tag", "boardType"]);
  }

  async removeCertifiedTags(boardType: PostBoardType, tags: string[]) {
    if (tags.length <= 0) return 0;
    await this.em.delete(Tag, {
      tags: In(tags),
      boardType,
      certified: true,
    });
  }

  async removeAllCertifiedTags(boardType: PostBoardType) {
    await this.em.delete(Tag, {
      boardType,
      certified: true,
    });
  }
}
