export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api/v1";

export type AdminUser = { id: string; email: string; role: string };

export type AdminLoginResponse = { accessToken: string; user: AdminUser };
export type UploadMediaResponse = {
  url: string;
  key: string;
  size: number;
  mime: string;
};

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
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string | null;
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
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostPayload = {
  type: Post["type"];
  status: Post["status"];
  title: string;
  slug: string;
  category?: string;
  tags?: string[];
  summary?: string;
  body?: string;
  coverUrl?: string;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  /** 传 null 表示清空发布时间（例如下线） */
  publishedAt?: string | null;
  sortOrder?: number;
};

export type CoursePayload = {
  status: Course["status"];
  title: string;
  slug: string;
  category?: string;
  tags?: string[];
  summary?: string;
  body?: string;
  coverUrl?: string;
  level?: Course["level"];
  industry?: string;
  credits?: number;
  durationWks?: number;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  /** 传 null 表示清空发布时间（例如下线） */
  publishedAt?: string | null;
};

function authHeader(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
      ...authHeader(),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function adminLogin(email: string, password: string) {
  return json<AdminLoginResponse>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function listAdminPosts() {
  return json<Post[]>("/admin/posts", { method: "GET" });
}

export async function createAdminPost(data: PostPayload) {
  return json<Post>("/admin/posts", { method: "POST", body: JSON.stringify(data) });
}

export async function updateAdminPost(id: string, data: Partial<PostPayload>) {
  return json<Post>(`/admin/posts/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminPost(id: string) {
  return json<Post>(`/admin/posts/${id}`, { method: "DELETE" });
}

export async function listAdminCourses() {
  return json<Course[]>("/admin/courses", { method: "GET" });
}

export async function createAdminCourse(
  data: CoursePayload,
) {
  return json<Course>("/admin/courses", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAdminCourse(id: string, data: Partial<CoursePayload>) {
  return json<Course>(`/admin/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteAdminCourse(id: string) {
  return json<Course>(`/admin/courses/${id}`, { method: "DELETE" });
}

export async function uploadAdminCover(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/admin/media/upload`, {
    method: "POST",
    headers: {
      ...authHeader(),
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Upload failed: ${res.status}`);
  }

  return (await res.json()) as UploadMediaResponse;
}

