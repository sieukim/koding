import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { SearchQueryHandlers } from "./queries/handlers";
import { SearchServices } from "./services";
import { KodingConfig } from "../config/configutation";
import { SearchCommandHandlers } from "./commands/handlers";
import { PostSearchSaga } from "./sagas/post-search.saga";

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<KodingConfig, true>) => ({
        node: configService.get("database.elasticsearch.host", {
          infer: true,
        }),
        auth: {
          username: configService.get("database.elasticsearch.username", {
            infer: true,
          }),
          password: configService.get("database.elasticsearch.password", {
            infer: true,
          }),
        },
        maxRetries: 10,
        requestTimeout: 60000,
        pingTimeout: 60000,
        // sniffOnStart: true,
      }),
    }),
    CqrsModule,
  ],
  controllers: [SearchController],
  providers: [
    ...SearchServices,
    ...SearchQueryHandlers,
    ...SearchCommandHandlers,
    PostSearchSaga,
  ],
})
export class SearchModule {}
