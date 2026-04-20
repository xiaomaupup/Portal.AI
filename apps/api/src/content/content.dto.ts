import { PostType, PublishStatus } from "@prisma/client";

export class CreatePostDto {
  type?: PostType;
  status?: PublishStatus;
  title!: string;
  slug!: string;
  category?: string;
  tags?: string[];
  summary?: string;
  body?: string;
  coverUrl?: string;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  publishedAt?: string;
  /** 展示排序，数值越小越靠前；省略则使用数据库默认（未手动排序） */
  sortOrder?: number;
}

export class UpdatePostDto {
  type?: PostType;
  status?: PublishStatus;
  title?: string;
  slug?: string;
  category?: string | null;
  tags?: string[] | null;
  summary?: string;
  body?: string;
  coverUrl?: string;
  seoTitle?: string | null;
  seoDesc?: string | null;
  seoKeywords?: string | null;
  publishedAt?: string | null;
  sortOrder?: number;
}

