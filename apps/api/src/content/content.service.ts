import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto, UpdatePostDto } from "./content.dto";
import { PostType, Prisma, PublishStatus } from "@prisma/client";

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  private async resolveUniqueSlug(baseSlug: string, excludeId?: string) {
    const normalized = baseSlug.trim().toLowerCase();
    let candidate = normalized;
    let index = 2;

    for (;;) {
      const existed = await this.prisma.contentPost.findFirst({
        where: {
          slug: candidate,
          ...(excludeId ? { id: { not: excludeId } } : {}),
        },
        select: { id: true },
      });

      if (!existed) return candidate;
      candidate = `${normalized}-${index}`;
      index += 1;
    }
  }

  listPublic(params: {
    type?: PostType;
    q?: string;
    take?: number;
    skip?: number;
  }) {
    const { type, q, take = 20, skip = 0 } = params;
    return this.prisma.contentPost.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        ...(type ? { type } : {}),
        ...(q
          ? {
              OR: [
                { title: { contains: q } },
                { summary: { contains: q } },
                { body: { contains: q } },
              ],
            }
          : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take,
      skip,
    });
  }

  getPublicBySlug(slug: string) {
    return this.prisma.contentPost.findFirst({
      where: { slug, status: PublishStatus.PUBLISHED },
    });
  }

  listAdmin(params: {
    type?: PostType;
    status?: PublishStatus;
    take?: number;
    skip?: number;
  }) {
    const { type, status, take = 20, skip = 0 } = params;
    return this.prisma.contentPost.findMany({
      where: {
        ...(type ? { type } : {}),
        ...(status ? { status } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      take,
      skip,
    });
  }

  async createAdmin(dto: CreatePostDto) {
    const uniqueSlug = await this.resolveUniqueSlug(dto.slug);
    return this.prisma.contentPost.create({
      data: {
        type: dto.type ?? PostType.NEWS,
        status: dto.status ?? PublishStatus.DRAFT,
        title: dto.title,
        slug: uniqueSlug,
        category: dto.category,
        tags: dto.tags ?? [],
        summary: dto.summary,
        body: dto.body,
        coverUrl: dto.coverUrl,
        seoTitle: dto.seoTitle,
        seoDesc: dto.seoDesc,
        seoKeywords: dto.seoKeywords,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
  }

  async updateAdmin(id: string, dto: UpdatePostDto) {
    const uniqueSlug = dto.slug
      ? await this.resolveUniqueSlug(dto.slug, id)
      : undefined;

    return this.prisma.contentPost.update({
      where: { id },
      data: {
        type: dto.type,
        status: dto.status,
        title: dto.title,
        slug: uniqueSlug,
        category:
          dto.category === null
            ? null
            : dto.category
              ? dto.category
              : undefined,
        tags:
          dto.tags === null
            ? Prisma.JsonNull
            : dto.tags
              ? dto.tags
              : undefined,
        summary: dto.summary,
        body: dto.body,
        coverUrl: dto.coverUrl,
        seoTitle:
          dto.seoTitle === null ? null : dto.seoTitle ? dto.seoTitle : undefined,
        seoDesc: dto.seoDesc === null ? null : dto.seoDesc ? dto.seoDesc : undefined,
        seoKeywords:
          dto.seoKeywords === null
            ? null
            : dto.seoKeywords
              ? dto.seoKeywords
              : undefined,
        publishedAt:
          dto.publishedAt === null
            ? null
            : dto.publishedAt
              ? new Date(dto.publishedAt)
              : undefined,
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
  }

  removeAdmin(id: string) {
    return this.prisma.contentPost.delete({ where: { id } });
  }
}

