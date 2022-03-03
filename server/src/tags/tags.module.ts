import { Module } from "@nestjs/common";
import { TagsController } from "./tags.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { TagsRepository } from "./tags.repository";
import { TagEventHandlers } from "./events/handlers";
import { TagQueryHandlers } from "./queries/handlers";
import { TagCommandHandlers } from "./commands/handlers";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tag } from "../entities/tag.entity";

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Tag])],
  controllers: [TagsController],
  providers: [
    TagsRepository,
    ...TagEventHandlers,
    ...TagQueryHandlers,
    ...TagCommandHandlers,
  ],
})
export class TagsModule {}
