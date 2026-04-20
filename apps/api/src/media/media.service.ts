import { BadRequestException, Injectable } from "@nestjs/common";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxFileSize = 5 * 1024 * 1024;

export type UploadedImageFile = {
  buffer: Buffer;
  mimetype: string;
  size: number;
};

@Injectable()
export class MediaService {
  async saveCover(file: UploadedImageFile | undefined) {
    if (!file) {
      throw new BadRequestException("未找到上传文件");
    }
    if (!allowedMimeTypes.has(file.mimetype)) {
      throw new BadRequestException("仅支持 jpg/png/webp 格式");
    }
    if (file.size > maxFileSize) {
      throw new BadRequestException("图片大小不能超过 5MB");
    }

    const ext = this.resolveExtension(file.mimetype);
    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const key = path.posix.join("covers", yyyy, mm, `${randomUUID()}.${ext}`);

    const uploadRoot = path.join(process.cwd(), "uploads");
    const targetFile = path.join(uploadRoot, key);
    await fs.mkdir(path.dirname(targetFile), { recursive: true });
    await fs.writeFile(targetFile, file.buffer);

    return {
      key,
      size: file.size,
      mime: file.mimetype,
    };
  }

  private resolveExtension(mime: string) {
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/png") return "png";
    if (mime === "image/webp") return "webp";
    return "bin";
  }
}
