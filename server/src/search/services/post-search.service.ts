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
      // ???????????? ?????? ?????? ????????? ???????????? ??????
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
        ], // ?????? ??????????????? ?????????
      };
      if (tags) {
        // ???????????? ????????? ?????? ???????????? ???????????? ????????????, ????????? ????????? ?????????
        searchParams.body.query.bool.filter.push(
          ...tags.map((tag) => ({
            match: { tags: tag },
          })),
        );
      }
    } else if (tags) {
      // ????????? ?????? ?????? ????????? ???????????? ??????
      searchParams.body.query.bool = {
        should: [
          // ???????????? ????????? ?????? ??????????????? ?????? ????????? ??????
          ...tags.map((tag) => ({
            match: { tags: tag },
          })),
        ],
        filter: [
          { match: { boardType } }, // ?????? ??????????????? ?????????
          { terms: { tags: tags } }, // ?????? ??? ???????????? ???????????? ?????? ????????? ?????????
        ],
      };
    } else {
      // ??? ??? ?????? ??????. ?????? ?????? ??????
      searchParams.body.query.bool = {
        must: [{ match_all: {} }],
        filter: [
          { match: { boardType } }, // ?????? ??????????????? ?????????
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
        "??????????????? ?????? ???????????? ???????????????",
      );
    }
  }
}
