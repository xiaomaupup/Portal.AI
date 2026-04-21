# portal-AI（可落地官网门户 + 课程/资讯 CMS 后台）

本项目由静态 demo 改造为可上线的“官网门户（web）+ 后台管理（admin）+ API（api）+ MySQL”。
当前后台已支持课程/资讯完整内容管理：分类、标签、富文本正文、SEO 字段、发布状态。

## 目录

- `legacy-static/`：原静态 demo（保留对照）
- `apps/web/`：官网门户（Next.js）
- `apps/admin/`：后台管理（Next.js）
- `apps/api/`：后端 API（NestJS + Prisma + MySQL）

## 本地启动（推荐）

1) 准备环境变量

- 根目录：复制 `.env.example` 为 `.env`
- `apps/web/`：复制 `.env.local.example` 为 `.env.local`
- `apps/admin/`：复制 `.env.local.example` 为 `.env.local`

2) 安装依赖

```bash
pnpm install
```

3) 启动 MySQL（二选一）

方式 A：Docker

```bash
docker compose up -d
```

方式 B：本机 Homebrew MySQL（若 Docker Hub 拉取受限可用）

```bash
brew install mysql
brew services start mysql
```

4) 初始化数据库（推荐）

```bash
pnpm -F api prisma:generate
pnpm -F api exec prisma db push
pnpm -F api db:seed
```

5) 启动开发环境

```bash
pnpm dev
```

默认端口：
- web：`3003`
- admin：`3002`
- api：`3001`（由 `.env` 的 `API_PORT` 控制）

### web 图片域名白名单（next/image）

`apps/web` 支持通过环境变量扩展图片白名单（用于 OSS/CDN）：

- 变量：`NEXT_IMAGE_REMOTE_PATTERNS`
- 格式：逗号分隔的完整 URL（可带端口）
- 示例：
  - `NEXT_IMAGE_REMOTE_PATTERNS=https://your-bucket.oss-cn-hangzhou.aliyuncs.com,https://cdn.yourdomain.com`

默认已内置本地开发域名：
- `http://localhost:3001`
- `http://127.0.0.1:3001`

## 默认管理员账号（seed）

- email：`admin@demo.local`
- password：`Admin12345!`

## API 路径（全局前缀）

所有 API 都带前缀：`/api/v1`

示例：
- 公网：`GET /api/v1/posts`、`GET /api/v1/courses`
- 后台：`POST /api/v1/admin/auth/login`、`GET /api/v1/admin/posts`
- 媒体：`POST /api/v1/admin/media/upload`（form-data: `file`）

### 公网查询参数
- `GET /api/v1/posts?type=NEWS|POLICY|REPORT&q=关键词`
- `GET /api/v1/courses?level=BEGINNER|INTERMEDIATE|ADVANCED&industry=行业&q=关键词`

## 后台功能（apps/admin）

- 资讯管理：`/posts`
  - 新建/编辑资讯（NEWS/POLICY/REPORT）
  - 字段：标题、分类、标签、摘要、封面 URL、富文本正文、SEO
  - 状态（当前 UI）：`未发布` / `已发布`（内部仍兼容历史 `ARCHIVED` 数据）
- 课程管理：`/courses`
  - 新建/编辑课程
  - 字段：标题、分类、标签、摘要、封面 URL、难度、行业、学分、周期、富文本正文、SEO
  - 状态：`DRAFT` / `PUBLISHED` / `ARCHIVED`

## 封面图上传（当前本地开发）

- 前端通过 `POST /api/v1/admin/media/upload` 上传文件（JWT 鉴权）。
- 后端将文件保存到 `apps/api/uploads/covers/yyyy/mm/...`。
- 后端静态暴露 `/uploads/*`，返回可直接使用的 `coverUrl`。
- 支持格式：`jpg/png/webp`；大小限制：`<= 5MB`。
- 文章只保存 `coverUrl`，不存储图片二进制。

## 未来切换阿里云（OSS）待办

上线阿里云时，建议保持前端接口不变，仅替换后端存储实现：

1. **准备 OSS**
   - 创建 Bucket（建议配置生命周期、版本控制）。
   - 配置访问策略（建议私有读 + CDN，或按业务公共读）。

2. **新增环境变量**
   - `OSS_REGION`
   - `OSS_BUCKET`
   - `OSS_ACCESS_KEY_ID`
   - `OSS_ACCESS_KEY_SECRET`
   - `OSS_PUBLIC_BASE_URL`（可选，用于统一返回 CDN/域名）
   - `apps/web/.env.local` 增加 `NEXT_IMAGE_REMOTE_PATTERNS`（填 OSS/CDN 域名）

3. **后端改造点（apps/api）**
   - 保持 `POST /api/v1/admin/media/upload` 路径与返回结构不变。
   - 将 `MediaService` 从本地落盘切换到 OSS 上传。
   - 返回 `{ url, key, size, mime }`，前端零改动。

4. **建议增强**
   - 增加 `FILE_STORAGE_DRIVER=local|oss`，支持灰度切换与回滚。
   - 后续可升级为“前端直传 OSS + STS 临时凭证”降低 API 带宽压力。

## 线上部署防错清单（强烈建议上线前逐项确认）

### 1) 环境变量与地址

- API 服务端口与网关一致：`API_PORT`
- 数据库连接正确：`DATABASE_URL`
- JWT 密钥已替换：`JWT_SECRET`（不要使用默认值）
- web 侧 API 基地址：`apps/web/.env.local` 的 `NEXT_PUBLIC_API_BASE_URL`
- admin 侧 API 基地址：`apps/admin/.env.local` 的 `NEXT_PUBLIC_API_BASE_URL`
- web 图片白名单：`NEXT_IMAGE_REMOTE_PATTERNS` 已包含 OSS/CDN 域名

### 2) 上传链路

- `POST /api/v1/admin/media/upload` 在目标环境可用（鉴权正常）
- 上传后返回 `url` 可公网访问（浏览器可直接打开）
- `coverUrl` 使用的是稳定域名（建议 CDN 域名，不建议内网地址）

### 3) Nginx / 网关 / CORS

- `/api/v1/*` 代理到 API 服务
- 如仍使用本地磁盘模式，`/uploads/*` 必须可访问
- CORS 允许 web/admin 域名访问 API
- 上传请求体限制（`client_max_body_size`）不小于 5MB

### 4) 数据与兼容性

- 历史 `ARCHIVED` 数据在资讯 UI 中会按“未发布”展示（预期行为）
- 文章保存时 `slug` 冲突已自动处理（会追加 `-2/-3`）
- 新封面上传后文章可正常保存并在 web 端显示

### 5) 发布后回归（最少执行）

- admin 登录成功
- 新建资讯：上传封面 -> 保存 -> 状态改为已发布
- web 资讯列表可看到新内容，封面图正常加载（无 next/image 域名报错）
- 下线后 web 不再展示该资讯

### 6) 回滚预案（建议提前写好）

- 存储层保留切换开关（`local` / `oss`）
- 保留上一版镜像与数据库备份点
- 若图片域名异常，先回退 `NEXT_IMAGE_REMOTE_PATTERNS` 与网关配置

### 7) PM2（宝塔）：禁止 `pnpm start -- -p` 的旧写法

若日志出现 `Invalid project directory ... apps/admin/-p`，说明 **`pnpm --dir ... start -- -p 3002` 被错误解析**：`-p` 被当成目录名。请改用其一：

- **推荐**：仓库根目录使用自带配置（`cwd` 为各子应用，端口在 args 里）：

```bash
cd /path/to/Portal.AI
pm2 delete portal-api portal-web portal-admin   # 若已有旧进程
pm2 start ecosystem.config.cjs
pm2 save
```

- **手工**：先 `cd` 到 `apps/admin` 或 `apps/web`，再执行（不要用 `--dir` 拼 `start --`）：

```bash
cd apps/admin && pnpm exec next start -p 3002 -H 0.0.0.0
cd apps/web   && pnpm exec next start -p 3003 -H 0.0.0.0
```

官网 SSR 若出现 `fetch failed` / `ETIMEDOUT`，请在 **`apps/web/.env.local`** 增加 **`API_INTERNAL_BASE_URL=http://127.0.0.1:3001/api/v1`**（端口与 `API_PORT` 一致），重新 `pnpm --dir apps/web build` 后重启 `portal-web`。

部署新版本后若浏览器报 **Failed to find Server Action**，请 **强制刷新页面（Ctrl+F5）** 或清空站点缓存，避免旧前端脚本对接新后端。

### 8) API：`Cannot find module ... dist/main`

本项目 TypeScript 构建产物在 **`apps/api/dist/src/main.js`**（不是 `dist/main`）。线上必须先构建：

```bash
cd /path/to/Portal.AI
pnpm --dir apps/api exec prisma generate
pnpm --dir apps/api build
test -f apps/api/dist/src/main.js && echo "API 构建 OK"
pm2 restart portal-api
```

若已更新到包含修正的 `package.json`，`pnpm run start:prod` 会指向正确路径。

