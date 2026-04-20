import { PrismaClient, AdminRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@demo.local";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin12345!";

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, role: AdminRole.SUPER_ADMIN },
    create: { email, passwordHash, role: AdminRole.SUPER_ADMIN },
  });

  // Minimal demo content (safe to re-run)
  await prisma.contentPost.upsert({
    where: { slug: "welcome" },
    update: { title: "欢迎访问门户（示例）" },
    create: {
      slug: "welcome",
      title: "欢迎访问门户（示例）",
      summary: "这是一条由 seed 初始化的示例资讯，后续可在后台维护。",
      status: "PUBLISHED",
      type: "NEWS",
      publishedAt: new Date(),
      body: "示例正文：后续将由后台富文本内容替换。",
    },
  });

  await prisma.course.upsert({
    where: { slug: "ai-general" },
    update: { title: "AI 通识：编程基础（示例）" },
    create: {
      slug: "ai-general",
      title: "AI 通识：编程基础（示例）",
      summary: "掌握用于数据处理和AI建模的核心 Python 库。",
      status: "PUBLISHED",
      publishedAt: new Date(),
      level: "BEGINNER",
      credits: 4,
      durationWks: 12,
      body: "示例课程详情：后续由后台维护。",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

