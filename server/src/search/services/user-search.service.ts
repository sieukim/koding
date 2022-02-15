import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ConfigService } from "@nestjs/config";
import { SortOrder } from "../../common/repository/sort-option";
import {
  NicknameAndAvatar,
  NicknameSearchResultDto,
} from "../dto/nickname-search-result.dto";

@Injectable()
export class UserSearchService {
  private readonly userIndexName: string;

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    configService: ConfigService,
  ) {
    this.userIndexName = configService.get<string>(
      "database.elasticsearch.index.user",
    );
  }

  async searchNicknameWithCursor(
    nickname: string,
    pageSize: number,
    cursor: string,
  ) {
    if (cursor?.length === 0) cursor = undefined;
    let nextPageCursor: string | undefined;
    const body = await this.search(nickname, SortOrder.DESC, pageSize, cursor);
    const totalCount = body.hits.total.value as number;
    const users = (body.hits.hits as any[]).map(
      (item) =>
        new NicknameAndAvatar(item._source.nickname, item._source.avatarUrl),
    );

    if (users.length === pageSize) {
      const rawUsers = body.hits.hits as any[];
      nextPageCursor = (rawUsers[rawUsers.length - 1].sort as string[]).join(
        ",",
      );
    }

    return new NicknameSearchResultDto(users, totalCount, nextPageCursor);
  }

  private async search(
    nickname: string,
    sortType: SortOrder,
    pageSize: number,
    cursor?: string,
  ) {
    const searchParams: any = {
      index: this.userIndexName,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  nickname,
                },
              },
            ],
            should: [
              {
                match_phrase_prefix: {
                  // prefix 인 경우 우선순위 증가
                  nickname,
                },
              },
              {
                match: {
                  // 완전 일치인 경우 우선순위 증가
                  "nickname.keyword": nickname,
                },
              },
            ],
          },
        },
        sort: [
          { _score: sortType === SortOrder.DESC ? "desc" : "asc" },
          { _id: sortType === SortOrder.DESC ? "desc" : "asc" },
        ],
        size: pageSize,
      },
    };
    if (cursor) {
      const [scoreCursor, idCursor] = cursor.split(",").map((s) => s.trim());
      searchParams.body.search_after = [scoreCursor, idCursor];
    }

    console.log("searchParams: ", JSON.stringify(searchParams));
    const { body } = await this.elasticsearchService.search(searchParams);
    console.log("body: ", JSON.stringify(body));
    return body;
  }
}
