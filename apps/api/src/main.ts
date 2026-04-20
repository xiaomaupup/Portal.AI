import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "node:path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.setGlobalPrefix("api/v1");
  app.useStaticAssets(join(process.cwd(), "uploads"), {
    prefix: "/uploads/",
  });
  await app.listen(Number(process.env.API_PORT ?? 3001));
}
bootstrap();
