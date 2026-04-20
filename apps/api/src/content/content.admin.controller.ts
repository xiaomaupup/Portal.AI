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
import { ContentService } from "./content.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { CreatePostDto, UpdatePostDto } from "./content.dto";
import { PostType, PublishStatus } from "@prisma/client";

@Controller("admin/posts")
@UseGuards(JwtAuthGuard)
export class ContentAdminController {
  constructor(private readonly content: ContentService) {}

  @Get()
  async list(
    @Query("type") type?: PostType,
    @Query("status") status?: PublishStatus,
    @Query("take") take?: string,
    @Query("skip") skip?: string,
  ) {
    return this.content.listAdmin({
      type,
      status,
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  @Post()
  async create(@Body() dto: CreatePostDto) {
    return this.content.createAdmin(dto);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdatePostDto) {
    return this.content.updateAdmin(id, dto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    return this.content.removeAdmin(id);
  }
}

