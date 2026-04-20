export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

export type Post = {
  id: string;
  type: "NEWS" | "POLICY" | "REPORT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  title: string;
  slug: string;
  category: string | null;
  tags: string[] | null;
  summary: string | null;
  body: string | null;
  coverUrl: string | null;
  publishedAt: string | null;
  /** 越小越靠前；未设置时为 2147483647 */
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Course = {
  id: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  title: string;
  slug: string;
  category: string | null;
  tags: string[] | null;
  summary: string | null;
  body: string | null;
  coverUrl: string | null;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  industry: string | null;
  credits: number;
  durationWks: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return (await res.json()) as T;
}

function withQuery(path: string, query?: Record<string, string | undefined>) {
  if (!query) return path;
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v) params.set(k, v);
  }
  const str = params.toString();
  return str ? `${path}?${str}` : path;
}

export function listPosts(query?: { type?: Post["type"]; q?: string }) {
  return getJson<Post[]>(withQuery("/posts", query));
}

export function getPost(slug: string) {
  const normalized = decodeURIComponent(slug);
  if (normalized === slug) {
    return getJson<Post>(`/posts/${encodeURIComponent(slug)}`);
  }

  return getJson<Post>(`/posts/${encodeURIComponent(slug)}`).catch((err) => {
    if (err instanceof Error && err.message.includes("404")) {
      return getJson<Post>(`/posts/${encodeURIComponent(normalized)}`);
    }
    throw err;
  });
}

export function listCourses(query?: {
  level?: Course["level"];
  industry?: string;
  q?: string;
}) {
  return getJson<Course[]>(withQuery("/courses", query));
}

export function getCourse(slug: string) {
  const normalized = decodeURIComponent(slug);
  if (normalized === slug) {
    return getJson<Course>(`/courses/${encodeURIComponent(slug)}`);
  }

  return getJson<Course>(`/courses/${encodeURIComponent(slug)}`).catch((err) => {
    if (err instanceof Error && err.message.includes("404")) {
      return getJson<Course>(`/courses/${encodeURIComponent(normalized)}`);
    }
    throw err;
  });
}

