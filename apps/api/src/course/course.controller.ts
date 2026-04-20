import { Controller, Get, NotFoundException, Param, Query } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseLevel } from "@prisma/client";

@Controller("courses")
export class CourseController {
  constructor(private readonly courses: CourseService) {}

  @Get()
  async list(
    @Query("level") level?: CourseLevel,
    @Query("industry") industry?: string,
    @Query("q") q?: string,
    @Query("take") take?: string,
    @Query("skip") skip?: string,
  ) {
    return this.courses.listPublic({
      level,
      industry,
      q,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Get(":slug")
  async detail(@Param("slug") slug: string) {
    const course = await this.courses.getPublicBySlug(slug);
    if (!course) throw new NotFoundException("课程不存在或未发布");
    return course;
  }
}

