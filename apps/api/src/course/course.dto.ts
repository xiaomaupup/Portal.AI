import { CourseLevel, PublishStatus } from "@prisma/client";

export class CreateCourseDto {
  status?: PublishStatus;
  title!: string;
  slug!: string;
  category?: string;
  tags?: string[];
  summary?: string;
  body?: string;
  coverUrl?: string;
  level?: CourseLevel;
  industry?: string;
  credits?: number;
  durationWks?: number;
  seoTitle?: string;
  seoDesc?: string;
  seoKeywords?: string;
  publishedAt?: string;
}

export class UpdateCourseDto {
  status?: PublishStatus;
  title?: string;
  slug?: string;
  category?: string | null;
  tags?: string[] | null;
  summary?: string;
  body?: string;
  coverUrl?: string;
  level?: CourseLevel;
  industry?: string | null;
  credits?: number;
  durationWks?: number;
  seoTitle?: string | null;
  seoDesc?: string | null;
  seoKeywords?: string | null;
  publishedAt?: string | null;
}

