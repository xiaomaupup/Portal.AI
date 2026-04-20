"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  Course,
  CoursePayload,
  createAdminCourse,
  deleteAdminCourse,
  listAdminCourses,
  updateAdminCourse,
  uploadAdminCover,
} from "@/lib/api";
import { ContentEditorWorkspace } from "@/components/content-editor-workspace";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MoreHorizontal, Save, Search, SendHorizonal } from "lucide-react";

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  return "请求失败";
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^0-9a-zA-Z\u4e00-\u9fa5\-_]/g, "")
    .replace(/-+/g, "-");
}

const emptyForm = {
  status: "DRAFT" as const,
  title: "",
  category: "",
  tagsText: "",
  summary: "",
  body: "<p></p>",
  coverUrl: "",
  level: "BEGINNER" as const,
  industry: "",
  credits: 0,
  durationWks: 0,
};

const schema = z.object({
  status: z.enum(["DRAFT", "PUBLISHED"]),
  title: z.string().min(1, "标题不能为空"),
  category: z.string().optional(),
  tagsText: z.string().optional(),
  summary: z.string().optional(),
  body: z.string().optional(),
  coverUrl: z.string().optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  industry: z.string().optional(),
  credits: z.coerce.number().min(0, "学分不能小于 0"),
  durationWks: z.coerce.number().min(0, "周期不能小于 0"),
});

type FormValues = z.infer<typeof schema>;

const tableColumns = [
  { key: "title", label: "标题" },
  { key: "level", label: "难度" },
  { key: "status", label: "状态" },
  { key: "category", label: "类型" },
  { key: "industry", label: "行业" },
  { key: "updatedAt", label: "更新时间" },
] as const;

const defaultCoverPreview =
  "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1600&q=80";

function normalizeStatus(status: Course["status"]): "DRAFT" | "PUBLISHED" {
  return status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
}

function statusLabel(status: Course["status"] | "DRAFT" | "PUBLISHED") {
  return status === "PUBLISHED" ? "已发布" : "未发布";
}

function levelLabel(level: Course["level"]) {
  if (level === "BEGINNER") return "初级";
  if (level === "INTERMEDIATE") return "中级";
  return "高级";
}

export default function CoursesAdminPage() {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [active, setActive] = useState<Course | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [lineActionId, setLineActionId] = useState<string | null>(null);

  const [keyword, setKeyword] = useState("");
  const [levelFilter, setLevelFilter] = useState<"ALL" | Course["level"]>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const form = useForm<FormValues>({ defaultValues: emptyForm });

  const titleValue = useWatch({ control: form.control, name: "title" });
  const statusValue = useWatch({ control: form.control, name: "status" });
  const coverUrlValue = useWatch({ control: form.control, name: "coverUrl" });
  const hasUploadedCover = Boolean(coverUrlValue);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const [hasMounted, setHasMounted] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  const filteredItems = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return items.filter((x) => {
      const matchesKeyword =
        !q || x.title.toLowerCase().includes(q) || x.slug.toLowerCase().includes(q);
      const matchesLevel = levelFilter === "ALL" || x.level === levelFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" ? x.status === "PUBLISHED" : x.status !== "PUBLISHED");
      return matchesKeyword && matchesLevel && matchesStatus;
    });
  }, [items, keyword, levelFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  async function refresh() {
    setLoading(true);
    setApiError(null);
    try {
      const res = await listAdminCourses();
      setItems(res);
    } catch (e: unknown) {
      setApiError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    setHasMounted(true);
    setIsAuthed(Boolean(localStorage.getItem("admin_token")));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, levelFilter, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  function openCreate() {
    setActive(null);
    form.reset(emptyForm);
    setEditorOpen(true);
  }

  function openEdit(item: Course) {
    setActive(item);
    form.reset({
      status: normalizeStatus(item.status),
      title: item.title,
      category: item.category ?? "",
      tagsText: (item.tags ?? []).join(", "),
      summary: item.summary ?? "",
      body: item.body ?? "<p></p>",
      coverUrl: item.coverUrl ?? "",
      level: item.level,
      industry: item.industry ?? "",
      credits: item.credits,
      durationWks: item.durationWks,
    });
    setEditorOpen(true);
  }

  async function submit(values: FormValues) {
    setSubmitting(true);
    setApiError(null);
    try {
      schema.parse(values);
      const payload: CoursePayload = {
        status: values.status,
        title: values.title,
        slug: slugify(values.title),
        category: values.category?.trim() || undefined,
        summary: values.summary?.trim() || undefined,
        body: values.body,
        coverUrl: values.coverUrl?.trim() || undefined,
        level: values.level,
        industry: values.industry?.trim() || undefined,
        credits: values.credits,
        durationWks: values.durationWks,
        tags: (values.tagsText ?? "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        publishedAt: values.status === "PUBLISHED" ? new Date().toISOString() : undefined,
      };

      if (active) {
        await updateAdminCourse(active.id, payload);
      } else {
        await createAdminCourse(payload);
      }

      await refresh();
      setEditorOpen(false);
    } catch (e: unknown) {
      setApiError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  }

  async function doDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    setApiError(null);
    try {
      await deleteAdminCourse(deleteTarget.id);
      setDeleteTarget(null);
      await refresh();
    } catch (e: unknown) {
      setApiError(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  async function setCourseLineStatus(item: Course, mode: "online" | "offline") {
    setLineActionId(item.id);
    setApiError(null);
    try {
      if (mode === "online") {
        await updateAdminCourse(item.id, {
          status: "PUBLISHED",
          publishedAt: new Date().toISOString(),
        });
      } else {
        await updateAdminCourse(item.id, {
          status: "DRAFT",
          publishedAt: null,
        });
      }
      await refresh();
    } catch (e: unknown) {
      setApiError(getErrorMessage(e));
    } finally {
      setLineActionId(null);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1500px] px-2 py-2">
        {apiError ? (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
            {apiError}
          </div>
        ) : null}

        {hasMounted && !isAuthed ? (
          <div className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            未检测到登录 token，请先去登录页登录。
          </div>
        ) : null}

        {!editorOpen ? (
          <div className="mt-1 space-y-3">
            <div className="rounded-xl border bg-background px-5 py-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                  <div className="flex items-center gap-3">
                    <p className="w-12 shrink-0 text-sm font-medium text-foreground">搜索</p>
                    <div className="relative w-full max-w-[260px]">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        className="h-11 pl-9"
                        placeholder="按标题或 slug 搜索"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="w-16 shrink-0 text-sm font-medium text-foreground">难度</p>
                    <Select value={levelFilter} onValueChange={(v) => setLevelFilter(v as typeof levelFilter)}>
                      <SelectTrigger className="h-11 w-[200px]">
                        <SelectValue placeholder="全部难度">
                          {levelFilter !== "ALL" ? levelLabel(levelFilter) : null}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">全部难度</SelectItem>
                        <SelectItem value="BEGINNER">{levelLabel("BEGINNER")}</SelectItem>
                        <SelectItem value="INTERMEDIATE">{levelLabel("INTERMEDIATE")}</SelectItem>
                        <SelectItem value="ADVANCED">{levelLabel("ADVANCED")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="w-16 shrink-0 text-sm font-medium text-foreground">状态</p>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                      <SelectTrigger className="h-11 w-[200px]">
                        <SelectValue placeholder="全部状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">全部状态</SelectItem>
                        <SelectItem value="DRAFT">未发布</SelectItem>
                        <SelectItem value="PUBLISHED">已发布</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button size="lg" className="h-11 px-5" onClick={openCreate}>
                  新建课程
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {levelFilter !== "ALL" ? (
                  <Badge variant="outline">难度: {levelLabel(levelFilter)}</Badge>
                ) : null}
                {statusFilter !== "ALL" ? (
                  <Badge variant="outline">状态: {statusLabel(statusFilter)}</Badge>
                ) : null}
                {(keyword || levelFilter !== "ALL" || statusFilter !== "ALL") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setKeyword("");
                      setLevelFilter("ALL");
                      setStatusFilter("ALL");
                    }}
                  >
                    清空筛选
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
              <div className="px-4 py-3">
                {loading ? (
                  <div className="space-y-2 p-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} className="h-10 animate-pulse rounded-md bg-slate-100" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="h-11">
                        {tableColumns.map((col) => (
                          <TableHead key={col.key} className="text-sm font-medium">
                            {col.label}
                          </TableHead>
                        ))}
                        <TableHead className="w-[56px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pagedItems.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={tableColumns.length + 1}
                            className="h-28 text-center text-sm text-slate-500"
                          >
                            <div className="space-y-2">
                              <div>暂无匹配内容</div>
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={openCreate}>
                                新建第一门课程
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : null}
                      {pagedItems.map((x) => (
                        <TableRow key={x.id} className="h-12">
                          <TableCell
                            className="max-w-[320px] cursor-pointer truncate py-2 text-sm font-medium hover:bg-muted/50"
                            onClick={() => openEdit(x)}
                          >
                            {x.title}
                          </TableCell>
                          <TableCell className="py-2 text-sm text-muted-foreground">
                            {levelLabel(x.level)}
                          </TableCell>
                          <TableCell className="py-2">
                            <Badge variant="secondary" className="h-7 px-2.5 text-xs">
                              {statusLabel(x.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-2 text-sm text-muted-foreground">
                            {x.category?.trim() ? x.category.trim() : ""}
                          </TableCell>
                          <TableCell className="py-2 text-sm text-muted-foreground">
                            {x.industry?.trim() ? x.industry.trim() : ""}
                          </TableCell>
                          <TableCell className="py-2 text-sm text-muted-foreground">
                            {new Date(x.updatedAt).toISOString().slice(0, 10)}
                          </TableCell>
                          <TableCell className="py-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openEdit(x)}>编辑</DropdownMenuItem>
                                {x.status === "PUBLISHED" ? (
                                  <DropdownMenuItem
                                    disabled={lineActionId === x.id}
                                    onClick={() => void setCourseLineStatus(x, "offline")}
                                  >
                                    下线
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    disabled={lineActionId === x.id}
                                    onClick={() => void setCourseLineStatus(x, "online")}
                                  >
                                    上线
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600" onClick={() => setDeleteTarget(x)}>
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
              <div className="flex items-center justify-between border-t bg-slate-50 px-6 py-3">
                <Badge variant="secondary" className="h-7 px-3 text-xs">
                  共 {filteredItems.length} 条
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    上一页
                  </Button>
                  {Array.from({ length: totalPages })
                    .slice(Math.max(0, currentPage - 3), Math.max(0, currentPage - 3) + 5)
                    .map((_, i) => {
                      const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                      const page = start + i;
                      if (page > totalPages) return null;
                      return (
                        <Button
                          key={page}
                          size="sm"
                          variant={page === currentPage ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    下一页
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
              <button type="button" onClick={() => setEditorOpen(false)} className="hover:text-slate-700">
                课程管理
              </button>
              <span>/</span>
              <span className="text-slate-700">{active ? "编辑课程" : "新建课程"}</span>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submit)}>
                  <ContentEditorWorkspace
                    title={active ? "编辑课程" : "新建课程"}
                    statusLabel={statusValue}
                    actions={
                      <>
                        <Button type="submit" disabled={submitting || !titleValue}>
                          <Save className="mr-2 h-4 w-4" />
                          {submitting ? "保存中…" : "保存"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={submitting || !titleValue}
                          onClick={() => {
                            form.setValue("status", "PUBLISHED");
                            void form.handleSubmit(submit)();
                          }}
                        >
                          <SendHorizonal className="mr-2 h-4 w-4" />
                          一键发布
                        </Button>
                      </>
                    }
                    main={
                      <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-background">
                        <div className="grid gap-6 p-6 xl:grid-cols-[400px_minmax(0,1fr)]">
                          <div className="space-y-3">
                            <div
                              className={`group relative cursor-pointer overflow-hidden rounded-xl ${
                                hasUploadedCover
                                  ? "border border-border/70"
                                  : "border-2 border-dashed border-slate-300 bg-slate-100"
                              }`}
                              onClick={() => coverInputRef.current?.click()}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={coverUrlValue || defaultCoverPreview}
                                alt="cover"
                                className={`h-64 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
                                  hasUploadedCover ? "" : "saturate-50"
                                }`}
                              />
                              <div
                                className={`absolute inset-0 flex flex-col items-center justify-center ${
                                  hasUploadedCover
                                    ? "bg-slate-900/35 text-white backdrop-blur-[1px]"
                                    : "bg-slate-200/78 text-slate-700"
                                }`}
                              >
                                <div className="text-xl font-medium">点击或拖拽上传封面图</div>
                                <div
                                  className={`mt-1 text-base ${hasUploadedCover ? "text-white/85" : "text-slate-600"}`}
                                >
                                  推荐尺寸：1200×500px，小于 5MB
                                </div>
                              </div>
                            </div>
                            <FormField
                              control={form.control}
                              name="coverUrl"
                              render={({ field }) => <input type="hidden" {...field} value={field.value ?? ""} />}
                            />
                            <input
                              ref={coverInputRef}
                              className="hidden"
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const input = e.currentTarget;
                                const file = input.files?.[0];
                                if (!file) return;
                                try {
                                  const uploaded = await uploadAdminCover(file);
                                  form.setValue("coverUrl", uploaded.url, { shouldDirty: true });
                                } catch (err: unknown) {
                                  setApiError(getErrorMessage(err));
                                } finally {
                                  // await 之后 e.currentTarget 可能已被释放，需用同步阶段保存的 input
                                  input.value = "";
                                }
                              }}
                            />
                          </div>

                          <div className="space-y-4">
                            <FormField
                              control={form.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                    课程标题
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      className="h-12 rounded-xl border-slate-200 text-xl font-semibold"
                                      placeholder="输入标题"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="summary"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                    课程摘要
                                  </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      value={field.value ?? ""}
                                      className="min-h-24 rounded-xl border-slate-200"
                                      placeholder="一句话概述课程亮点与适合人群"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                              <FormField
                                control={form.control}
                                name="level"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                      难度
                                    </FormLabel>
                                    <FormControl>
                                      <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger className="w-full bg-white">
                                          <SelectValue placeholder="选择难度">
                                            {field.value ? levelLabel(field.value) : null}
                                          </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="BEGINNER">{levelLabel("BEGINNER")}</SelectItem>
                                          <SelectItem value="INTERMEDIATE">{levelLabel("INTERMEDIATE")}</SelectItem>
                                          <SelectItem value="ADVANCED">{levelLabel("ADVANCED")}</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                      类型
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        className="bg-white"
                                        placeholder="例如：认证课程"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                              <FormField
                                control={form.control}
                                name="industry"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                      行业
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        {...field}
                                        value={field.value ?? ""}
                                        className="bg-white"
                                        placeholder="例如：制造"
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="credits"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                      学分
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        className="bg-white"
                                        value={field.value ?? 0}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="durationWks"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                      周期（周）
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        className="bg-white"
                                        value={field.value ?? 0}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name="tagsText"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                    标签（逗号分隔）
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      value={field.value ?? ""}
                                      className="bg-white"
                                      placeholder="例如：Python, 数据分析"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="p-6">
                          <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                  课程正文
                                </FormLabel>
                                <FormControl>
                                  <RichTextEditor value={field.value ?? "<p></p>"} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    }
                    sidebar={null}
                  />
                </form>
              </Form>
            </div>
          </div>
        )}

        <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>确认删除课程？</DialogTitle>
              <DialogDescription>将删除「{deleteTarget?.title ?? ""}」，该操作不可撤销。</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                取消
              </Button>
              <Button variant="destructive" onClick={() => void doDelete()} disabled={deleting}>
                {deleting ? "删除中…" : "删除"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
