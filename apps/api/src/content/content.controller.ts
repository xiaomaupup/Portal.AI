import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Query,
} from "@nestjs/common";
import { ContentService } from "./content.service";
import { PostType } from "@prisma/client";

@Controller("posts")
export class ContentController {
  constructor(private readonly content: ContentService) {}

  @Get()
  @Header("Cache-Control", "no-store")
  async list(
    @Query("type") type?: PostType,
    @Query("q") q?: string,
    @Query("take") take?: string,
    @Query("skip") skip?: string,
  ) {
    return this.content.listPublic({
      type,
      q,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(":slug")
  @Header("Cache-Control", "no-store")
  async detail(@Param("slug") slug: string) {
    const post = await this.content.getPublicBySlug(slug);
    if (!post) throw new NotFoundException("内容不存在或未发布");
    return post;
  }
}

