import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CourseService } from "./course.service";
import { CreateCourseDto, UpdateCourseDto } from "./course.dto";
import { PublishStatus } from "@prisma/client";

@Controller("admin/courses")
@UseGuards(JwtAuthGuard)
export class CourseAdminController {
  constructor(private readonly courses: CourseService) {}

  @Get()
  async list(
    @Query("status") status?: PublishStatus,
    @Query("take") take?: string,
    @Query("skip") skip?: string,
  ) {
    return this.courses.listAdmin({
      status,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    return this.courses.createAdmin(dto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateCourseDto) {
    return this.courses.updateAdmin(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.courses.removeAdmin(id);
  }
}

