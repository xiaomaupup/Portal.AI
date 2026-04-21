import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "node:path";
import { NestExpressApplication } from "@nestjs/platform-express";
import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

/**
 * 后台(admin)与官网(web)与 API 不同子域，浏览器会发带凭证的跨域请求。
 * 生产环境建议在 apps/api/.env 设置 CORS_ORIGINS（逗号分隔的完整 origin，含 https）。
 */
function buildCorsOptions(): CorsOptions {
  const raw = process.env.CORS_ORIGINS?.trim();
  const list = raw
    ? raw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const common: CorsOptions = {
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "X-Requested-With"],
    exposedHeaders: ["Content-Type"],
    optionsSuccessStatus: 204,
    maxAge: 86_400,
  };

  if (list.length === 0) {
    return { ...common, origin: true };
  }

  return {
    ...common,
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (list.includes(origin)) {
        callback(null, origin);
        return;
      }
      callback(null, false);
    },
  };
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 让 Express 在反向代理（Nginx/Cloudflare）后正确识别协议与来源 IP。
  app.set("trust proxy", 1);
  app.enableCors(buildCorsOptions());
  app.setGlobalPrefix("api/v1");
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/",
  });
  await app.listen(Number(process.env.API_PORT ?? 3001));
}
bootstrap();
