/**
 * PM2 示例配置（宝塔 / ECS）。
 * 用法：在仓库根目录执行
 *   pm2 start ecosystem.config.cjs
 * 或按需修改 cwd 后：
 *   pm2 delete portal-api portal-web portal-admin  # 若已存在旧进程
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *
 * 不要用：pnpm --dir apps/admin start -- -p 3002
 * 会导致 pnpm 把 -p 当成目录，报 apps/admin/-p
 */
const path = require("path");
const root = __dirname;

module.exports = {
  apps: [
    {
      name: "portal-api",
      cwd: path.join(root, "apps/api"),
      script: "pnpm",
      args: ["run", "start:prod"],
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "portal-web",
      cwd: path.join(root, "apps/web"),
      script: "pnpm",
      args: ["exec", "next", "start", "-p", "3003", "-H", "0.0.0.0"],
    },
    {
      name: "portal-admin",
      cwd: path.join(root, "apps/admin"),
      script: "pnpm",
      args: ["exec", "next", "start", "-p", "3002", "-H", "0.0.0.0"],
    },
  ],
};
