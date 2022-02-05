import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ConfigService } from "@nestjs/config";
import { PostMetadataInfoDto } from "../posts/dto/post-metadata-info.dto";
import { SortType } from "../common/repository/sort-option";
import { PostBoardType } from "../models/post.model";
import { PostListWithCursorDto } from "../posts/dto/post-list-with-cursor.dto";

export const PostSearchTypes = ["query", "tags"] as const;
export type PostSearchType = typeof PostSearchTypes[number];

@Injectable()
export class PostSearchService {
  private readonly postIndexName: string;

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    configService: ConfigService,
  ) {
    this.postIndexName = configService.get<string>(
      "database.elasticsearch.index.post",
    );
  }

  async searchPosts(
    query: string,
    boardType: PostBoardType,
    postsPerBoard: number,
  ) {
    const body = await this.search(
      query,
      boardType,
      SortType.DESC,
      postsPerBoard,
    );
    return {
      totalCount: body.hits.total.value as number,
      posts: (body.hits.hits as any).map((item) =>
        PostMetadataInfoDto.fromJson({ ...item._source, postId: item._id }),
      ),
    };
  }

  async searchPostsWithCursor(
    boardType: PostBoardType,
    query: string,
    pageSize: number,
    cursor?: string,
  ) {
    if (cursor?.length === 0) cursor = undefined;
    let nextPageCursor: string | undefined;
    let prevPageCursor: string | undefined;
    const body = await this.search(
      query,
      boardType,
      SortType.DESC,
      pageSize,
      cursor,
    );
    const totalCount = body.hits.total.value as number;
    const posts = (body.hits.hits as any[]).map((item) =>
      PostMetadataInfoDto.fromJson({
        ...item._source,
        postId: item._id,
      }),
    );
    if (cursor && cursor.length > 0) {
      const prevBody = await this.search(
        query,
        boardType,
        SortType.ASC,
        pageSize,
        cursor,
      );
      const rawPrevPosts = prevBody.hits.hits;
      if (rawPrevPosts.length === pageSize) {
        prevPageCursor = (rawPrevPosts.pop().sort as string[]).join(",");
      } else if (rawPrevPosts.length > 0) {
        prevPageCursor = "";
      }
    }
    if (posts.length === pageSize) {
      const rawPosts = body.hits.hits;
      nextPageCursor = (rawPosts[rawPosts.length - 1].sort as string[]).join(
        ",",
      );
    }

    return new PostListWithCursorDto({
      posts,
      totalCount,
      prevPageCursor,
      nextPageCursor,
    });
  }

  private async search(
    query: string,
    boardType: PostBoardType,
    sortType: SortType,
    pageSize: number,
    cursor?: string,
  ) {
    const searchParams: any = {
      index: this.postIndexName,
      body: {
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    { match_phrase: { title: query } },
                    { match: { tags: query } },
                    { match_phrase: { htmlContent: { query, slop: 1 } } },
                  ],
                },
              },
            ],
            should: [
              { match_phrase: { title: query } },
              { match: { tags: query } },
              { match_phrase: { htmlContent: { query, slop: 1 } } },
            ],
            filter: [{ match: { boardType } }], // 특정 게시판으로 필터링
          },
        },
        sort: [
          { _score: sortType === SortType.DESC ? "desc" : "asc" },
          { _id: sortType === SortType.DESC ? "desc" : "asc" },
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
