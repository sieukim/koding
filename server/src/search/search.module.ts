import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { SearchQueryHandlers } from "./queries/handlers";
import { SearchServices } from "./services";

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<any, true>) => ({
        node: configService.get<string>("database.elasticsearch.host")!,
        auth: {
          username: configService.get<string>(
            "database.elasticsearch.username",
          )!,
          password: configService.get<string>(
            "database.elasticsearch.password",
          )!,
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
  providers: [...SearchServices, ...SearchQueryHandlers],
})
export class SearchModule {}
