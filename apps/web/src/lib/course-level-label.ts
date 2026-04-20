import type { Course } from "@/lib/api";

/** 与后台课程管理「难度」选项一致：初级 / 中级 / 高级 */
export function courseLevelLabel(level: Course["level"]): string {
  if (level === "BEGINNER") return "初级";
  if (level === "INTERMEDIATE") return "中级";
  return "高级";
}
