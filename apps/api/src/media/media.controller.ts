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

  private resolvePublicOrigin(req: Request) {
    const forwardedProto = req.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
    const protocol = forwardedProto || req.protocol;
    const host = forwardedHost || req.get("host");
    return `${protocol}://${host}`;
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async upload(@UploadedFile() file: UploadedImageFile | undefined, @Req() req: Request) {
    const saved = await this.mediaService.saveCover(file);
    const origin = this.resolvePublicOrigin(req);
    return {
      ...saved,
      url: `${origin}/uploads/${saved.key}`,
    };
  }
}
