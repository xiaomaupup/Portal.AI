/** 本机 API 返回的 http://localhost:* / 127.0.0.1:* 图片，next/image 优化易失败，需关闭优化 */
export function imageNeedsUnoptimized(src: string): boolean {
  if (!src) return false;
  return (
    src.startsWith("http://localhost:") ||
    src.startsWith("http://127.0.0.1:")
  );
}
