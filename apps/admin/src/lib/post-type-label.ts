/** 资讯内容类型（与 API PostType 枚举一致）在界面上的中文展示 */
export const POST_TYPE_LABELS: Record<"NEWS" | "POLICY" | "REPORT", string> = {
  NEWS: "机构动态",
  POLICY: "国家政策",
  REPORT: "研究报告",
};

export function postTypeLabel(type: string): string {
  return POST_TYPE_LABELS[type as keyof typeof POST_TYPE_LABELS] ?? type;
}
