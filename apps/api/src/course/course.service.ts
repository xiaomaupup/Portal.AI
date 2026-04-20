import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CourseLevel, Prisma, PublishStatus } from "@prisma/client";
import { CreateCourseDto, UpdateCourseDto } from "./course.dto";

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

  listPublic(params: {
    level?: CourseLevel;
    industry?: string;
    q?: string;
    take?: number;
    skip?: number;
  }) {
    const { level, industry, q, take = 20, skip = 0 } = params;
    return this.prisma.course.findMany({
      where: {
        status: PublishStatus.PUBLISHED,
        ...(level ? { level } : {}),
        ...(industry ? { industry: { contains: industry } } : {}),
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
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take,
      skip,
    });
  }

  getPublicBySlug(slug: string) {
    return this.prisma.course.findFirst({
      where: { slug, status: PublishStatus.PUBLISHED },
    });
  }

  listAdmin(params: {
    status?: PublishStatus;
    take?: number;
    skip?: number;
  }) {
    const { status, take = 20, skip = 0 } = params;
    return this.prisma.course.findMany({
      where: {
        ...(status ? { status } : {}),
      },
      orderBy: [{ updatedAt: "desc" }],
      take,
      skip,
    });
  }

  createAdmin(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        status: dto.status ?? PublishStatus.DRAFT,
        title: dto.title,
        slug: dto.slug,
        category: dto.category,
        tags: dto.tags ?? [],
        summary: dto.summary,
        body: dto.body,
        coverUrl: dto.coverUrl,
        level: dto.level ?? "BEGINNER",
        industry: dto.industry,
        credits: dto.credits ?? 0,
        durationWks: dto.durationWks ?? 0,
        seoTitle: dto.seoTitle,
        seoDesc: dto.seoDesc,
        seoKeywords: dto.seoKeywords,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
      },
    });
  }

  updateAdmin(id: string, dto: UpdateCourseDto) {
    return this.prisma.course.update({
      where: { id },
      data: {
        status: dto.status,
        title: dto.title,
        slug: dto.slug,
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
        level: dto.level,
        industry:
          dto.industry === null ? null : dto.industry ? dto.industry : undefined,
        credits: dto.credits,
        durationWks: dto.durationWks,
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
      },
    });
  }

  removeAdmin(id: string) {
    return this.prisma.course.delete({ where: { id } });
  }
}

