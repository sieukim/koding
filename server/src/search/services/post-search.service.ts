import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ConfigService } from "@nestjs/config";
import { PostMetadataInfoDto } from "../../posts/dto/post-metadata-info.dto";
import { SortOrder } from "../../common/sort-order.enum";
import { Post, PostIdentifier } from "../../entities/post.entity";
import { PostListWithCursorDto } from "../../posts/dto/post-list-with-cursor.dto";
import { PostBoardType } from "../../entities/post-board.type";
import { KodingConfig } from "../../config/configutation";

export const PostSearchTypes = ["query", "tags"] as const;
export type PostSearchType = typeof PostSearchTypes[number];

export enum PostSortType {
  Associativity = "associativity",
  Latest = "latest",
  LikeCount = "likeCount",
  ReadCount = "readCount",
  ScrapCount = "scrapCount",
  CommentCount = "commentCount",
}

@Injectable()
export class PostSearchService {
  private readonly postIndexName: string;
  private readonly logger = new Logger(PostSearchService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    configService: ConfigService<KodingConfig, true>,
  ) {
    this.postIndexName = configService.get(
      "database.elasticsearch.index.post",
      { infer: true },
    );
  }

  async deleteById({ postId }: PostIdentifier) {
    await this.elasticsearchService.delete(
      {
        index: this.postIndexName,
        id: postId,
      },
      { maxRetries: 2, requestTimeout: 2000 },
    );
  }

  async searchPosts(
    boardType: PostBoardType,
    { query, tags }: { query?: string; tags?: string[] },
    sortType: PostSortType = PostSortType.Associativity,
    postsPerBoard: number,
  ) {
    const body = await this.searchByQueryAndTags(
      { query, tags },
      boardType,
      sortType,
      SortOrder.DESC,
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
    { query, tags }: { query?: string; tags?: string[] },
    sortType: PostSortType = PostSortType.Associativity,
    pageSize: number,
    cursor?: string,
  ) {
    if (cursor?.length === 0) cursor = undefined;
    let nextPageCursor: string | undefined;
    const body = await this.searchByQueryAndTags(
      { query, tags },
      boardType,
      sortType,
      SortOrder.DESC,
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

    if (posts.length === pageSize) {
      const rawPosts = body.hits.hits;
      nextPageCursor = (rawPosts[rawPosts.length - 1].sort as string[]).join(
        ",",
      );
    }

    return new PostListWithCursorDto({
      posts: posts as Array<Post & { writer: null }>,
      totalCount,
      nextPageCursor,
    });
  }

  private async searchByQueryAndTags(
    {
      query,
      tags,
    }: {
      query?: string;
      tags?: string[];
    },
    boardType: PostBoardType,
    sortType: PostSortType,
    sortOrder: SortOrder,
    pageSize: number,
    cursor?: string,
  ) {
    const searchParams: any = {
      index: this.postIndexName,
      body: {
        query: {},
        sort: [{ createdAt: sortOrder === SortOrder.DESC ? "desc" : "asc" }],
        size: pageSize,
      },
    };
    switch (sortType) {
      case PostSortType.Latest:
        break;
      case PostSortType.Associativity:
        searchParams.body.sort.unshift({
          _score: sortOrder === SortOrder.DESC ? "desc" : "asc",
        });
        break;
      case PostSortType.CommentCount:
      case PostSortType.LikeCount:
      case PostSortType.ReadCount:
      case PostSortType.ScrapCount:
        searchParams.body.sort.unshift({
          [sortType]: sortOrder === SortOrder.DESC ? "desc" : "asc",
        });
        break;
    }
    if (query) {
      // 검색어가 있을 경우 검색어 기준으로 검색
      searchParams.body.query.bool = {
        should: [
          { match_phrase: { title: query } },
          { match: { tags: query } },
          { match_phrase: { htmlContent: { query, slop: 1 } } },
        ],
        filter: [
          { match: { boardType } },
          {
            bool: {
              should: [
                { match_phrase: { title: query } },
                { match: { tags: query } },
                { match_phrase: { htmlContent: { query, slop: 1 } } },
              ],
            },
          },
        ], // 특정 게시판으로 필터링
      };
      if (tags) {
        // 검색어와 태그가 함께 있는경우 검색어로 검색하되, 결과를 태그로 필터링
        searchParams.body.query.bool.filter.push(
          ...tags.map((tag) => ({
            match: { tags: tag },
          })),
        );
      }
    } else if (tags) {
      // 태그만 있을 경우 태그를 기준으로 검색
      searchParams.body.query.bool = {
        should: [
          // 검색어의 태그를 많이 포함할수록 검색 순위를 높임
          ...tags.map((tag) => ({
            match: { tags: tag },
          })),
        ],
        filter: [
          { match: { boardType } }, // 특정 게시판으로 필터링
          { terms: { tags: tags } }, // 태그 중 하나라도 일치하는 것이 있도록 필터링
        ],
      };
    } else {
      // 둘 다 없는 경우. 단순 목록 조회
      searchParams.body.query.bool = {
        must: [{ match_all: {} }],
        filter: [
          { match: { boardType } }, // 특정 게시판으로 필터링
        ],
      };
    }

    if (cursor) {
      searchParams.body.search_after = cursor.split(",").map((s) => s.trim());
    }

    this.logger.log(`search param: ${JSON.stringify(searchParams)}`);
    try {
      const { body } = await this.elasticsearchService.search(searchParams);
      return body;
    } catch (e) {
      console.error("error in search", e);
      throw new ServiceUnavailableException(
        "검색엔진이 아직 준비되지 않았습니다",
      );
    }
  }
}
