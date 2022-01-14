import { Module } from "@nestjs/common";
import { TagsController } from "./tags.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { TagsRepository } from "./tags.repository";
import { TagEventHandlers } from "./events/handlers";
import { TagQueryHandlers } from "./queries/handlers";
import { MongooseModule } from "@nestjs/mongoose";
import {
  CertifiedTagDocument,
  CertifiedTagSchema,
} from "src/schemas/certified-tag.schema";
import { TagCommandHandlers } from "./commands/handlers";

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: CertifiedTagDocument.name,
        schema: CertifiedTagSchema,
      },
    ]),
  ],
  controllers: [TagsController],
  providers: [
    TagsRepository,
    ...TagEventHandlers,
    ...TagQueryHandlers,
    ...TagCommandHandlers,
  ],
})
export class TagsModule {}
