import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PostSearchService } from "./post.search.service";
import { CqrsModule } from "@nestjs/cqrs";
import { SearchQueryHandlers } from "./queries/handlers";

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.get<string>("database.elasticsearch.host"),
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        // sniffOnStart: true,
      }),
    }),
    CqrsModule,
  ],
  controllers: [SearchController],
  providers: [PostSearchService, ...SearchQueryHandlers],
})
export class SearchModule {}
