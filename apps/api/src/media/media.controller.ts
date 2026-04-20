import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MediaService, UploadedImageFile } from "./media.service";
import type { Request } from "express";
import { Req } from "@nestjs/common";

@Controller("admin/media")
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: UploadedImageFile | undefined, @Req() req: Request) {
    const saved = await this.mediaService.saveCover(file);
    const origin = `${req.protocol}://${req.get("host")}`;
    return {
      ...saved,
      url: `${origin}/uploads/${saved.key}`,
    };
  }
}
