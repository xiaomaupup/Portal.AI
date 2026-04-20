import { Module } from "@nestjs/common";
import { CourseService } from "./course.service";
import { CourseController } from "./course.controller";
import { CourseAdminController } from "./course.admin.controller";

@Module({
  controllers: [CourseController, CourseAdminController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}

