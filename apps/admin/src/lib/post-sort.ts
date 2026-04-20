/** 与 Prisma ContentPost.sortOrder 默认一致：未手动排序时排在列表后段 */
export const DEFAULT_POST_SORT_ORDER = 2147483647;

export function formatPostSortCell(sortOrder: number, status: string): string {
  if (status !== "PUBLISHED") return "";
  if (sortOrder >= DEFAULT_POST_SORT_ORDER) return "";
  return String(sortOrder);
}
