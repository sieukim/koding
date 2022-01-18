import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TagsRepository } from "src/tags/tags.repository";
import { GetAllTagsQuery } from "../get-all-tags.query";

@QueryHandler(GetAllTagsQuery)
export class GetAllTagsHandler
  implements IQueryHandler<GetAllTagsQuery, string[]>
{
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute(query: GetAllTagsQuery): Promise<string[]> {
    const { boardType } = query;
    return this.tagsRepository.getAllTags(boardType);
  }
}
