import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { TagsRepository } from "src/tags/tags.repository";
import { GetCertifiedTagsQuery } from "../get-certified-tags.query";

@QueryHandler(GetCertifiedTagsQuery)
export class GetCertifiedTagsHandler
  implements IQueryHandler<GetCertifiedTagsQuery, string[]>
{
  constructor(private readonly tagsRepository: TagsRepository) {}

  async execute(query: GetCertifiedTagsQuery): Promise<string[]> {
    const { boardType } = query;
    return this.tagsRepository.getCertifiedTags(boardType);
  }
}
