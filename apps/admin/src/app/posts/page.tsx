"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  createAdminPost,
  deleteAdminPost,
  listAdminPosts,
  Post,
  PostPayload,
  uploadAdminCover,
  updateAdminPost,
} from "@/lib/api";
import { postTypeLabel } from "@/lib/post-type-label";
import { DEFAULT_POST_SORT_ORDER, formatPostSortCell } from "@/lib/post-sort";
import {
  ContentEditorWorkspace,
} from "@/components/content-editor-workspace";
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
  type: "NEWS" as const,
  status: "DRAFT" as const,
  title: "",
  category: "",
  tagsText: "",
  summary: "",
  body: "<p></p>",
  coverUrl: "",
};

const schema = z.object({
  type: z.enum(["NEWS", "POLICY", "REPORT"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  title: z.string().min(1, "标题不能为空"),
  category: z.string().optional(),
  tagsText: z.string().optional(),
  summary: z.string().optional(),
  body: z.string().optional(),
  coverUrl: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const tableColumns = [
  { key: "title", label: "标题" },
  { key: "type", label: "类型" },
  { key: "status", label: "状态" },
  { key: "sortOrder", label: "排序" },
  { key: "category", label: "标签" },
  { key: "updatedAt", label: "更新时间" },
] as const;

const defaultCoverPreview =
  "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1600&q=80";

function normalizeStatus(status: Post["status"]): "DRAFT" | "PUBLISHED" {
  return status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
}

function statusLabel(status: Post["status"] | "DRAFT" | "PUBLISHED") {
  return status === "PUBLISHED" ? "已发布" : "未发布";
}

export default function PostsPage() {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [active, setActive] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [lineActionId, setLineActionId] = useState<string | null>(null);
  const [editingSortId, setEditingSortId] = useState<string | null>(null);
  const [editingSortDraft, setEditingSortDraft] = useState("");
  const sortInputRef = useRef<HTMLInputElement | null>(null);

  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | Post["type"]>("ALL");
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
      const matchesKeyword = !q || x.title.toLowerCase().includes(q) || x.slug.toLowerCase().includes(q);
      const matchesType = typeFilter === "ALL" || x.type === typeFilter;
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" ? x.status === "PUBLISHED" : x.status !== "PUBLISHED");
      return matchesKeyword && matchesType && matchesStatus;
    });
  }, [items, keyword, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  async function refresh() {
    setLoading(true);
    setApiError(null);
    try {
      const res = await listAdminPosts();
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
  }, [keyword, typeFilter, statusFilter]);

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

  function openEdit(item: Post) {
    setActive(item);
    form.reset({
      type: item.type,
      status: normalizeStatus(item.status),
      title: item.title,
      category: item.category ?? "",
      tagsText: (item.tags ?? []).join(", "),
      summary: item.summary ?? "",
      body: item.body ?? "<p></p>",
      coverUrl: item.coverUrl ?? "",
    });
    setEditorOpen(true);
  }

  async function submit(values: FormValues) {
    setSubmitting(true);
    setApiError(null);
    try {
      schema.parse(values);
      const payload: PostPayload = {
        type: values.type,
        status: values.status,
        title: values.title,
        slug: slugify(values.title),
        category: values.category?.trim() || undefined,
        summary: values.summary?.trim() || undefined,
        body: values.body,
        coverUrl: values.coverUrl?.trim() || undefined,
        tags: (values.tagsText ?? "")
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        publishedAt: values.status === "PUBLISHED" ? new Date().toISOString() : undefined,
      };

      if (active) {
        await updateAdminPost(active.id, payload);
      } else {
        await createAdminPost(payload);
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
      await deleteAdminPost(deleteTarget.id);
      setDeleteTarget(null);
      await refresh();
    } catch (e: unknown) {
      setApiError(getErrorMessage(e));
    } finally {
      setDeleting(false);
    }
  }

  async function setPostLineStatus(item: Post, mode: "online" | "offline") {
    setLineActionId(item.id);
    setApiError(null);
    try {
      if (mode === "online") {
        await updateAdminPost(item.id, {
          status: "PUBLISHED",
          publishedAt: new Date().toISOString(),
        });
      } else {
        await updateAdminPost(item.id, {
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

  function beginSortEdit(x: Post) {
    if (x.status !== "PUBLISHED") return;
    setEditingSortId(x.id);
    const n = x.sortOrder ?? DEFAULT_POST_SORT_ORDER;
    setEditingSortDraft(n >= DEFAULT_POST_SORT_ORDER ? "" : String(n));
    queueMicrotask(() => sortInputRef.current?.focus());
  }

  function cancelSortEdit() {
    setEditingSortId(null);
    setEditingSortDraft("");
  }

  async function commitSortEdit(x: Post) {
    if (editingSortId !== x.id) return;
    const raw = editingSortDraft.replace(/\D/g, "");
    let next: number;
    if (raw === "") {
      next = DEFAULT_POST_SORT_ORDER;
    } else {
      const n = Number.parseInt(raw, 10);
      if (Number.isNaN(n)) {
        cancelSortEdit();
        return;
      }
      next = Math.min(Math.max(0, n), DEFAULT_POST_SORT_ORDER);
    }
    const prev = x.sortOrder ?? DEFAULT_POST_SORT_ORDER;
    cancelSortEdit();
    if (next === prev) return;
    setApiError(null);
    try {
      await updateAdminPost(x.id, { sortOrder: next });
      await refresh();
    } catch (e: unknown) {
      setApiError(getErrorMessage(e));
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
                    <p className="w-16 shrink-0 text-sm font-medium text-foreground">类型</p>
                    <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
                      <SelectTrigger className="h-11 w-[200px]">
                        <SelectValue placeholder="全部类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">全部类型</SelectItem>
                        <SelectItem value="NEWS">{postTypeLabel("NEWS")}</SelectItem>
                        <SelectItem value="POLICY">{postTypeLabel("POLICY")}</SelectItem>
                        <SelectItem value="REPORT">{postTypeLabel("REPORT")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="w-16 shrink-0 text-sm font-medium text-foreground">状态</p>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
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
                  新建资讯
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {typeFilter !== "ALL" ? <Badge variant="outline">类型: {postTypeLabel(typeFilter)}</Badge> : null}
                {statusFilter !== "ALL" ? <Badge variant="outline">状态: {statusLabel(statusFilter)}</Badge> : null}
                {(keyword || typeFilter !== "ALL" || statusFilter !== "ALL") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setKeyword("");
                      setTypeFilter("ALL");
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
                      {tableColumns.some((x) => x.key === "title") && <TableHead className="text-sm font-medium">标题</TableHead>}
                      {tableColumns.some((x) => x.key === "type") && <TableHead className="text-sm font-medium">类型</TableHead>}
                      {tableColumns.some((x) => x.key === "status") && <TableHead className="text-sm font-medium">状态</TableHead>}
                      {tableColumns.some((x) => x.key === "sortOrder") && (
                        <TableHead className="w-[92px] text-sm font-medium">排序</TableHead>
                      )}
                      {tableColumns.some((x) => x.key === "category") && <TableHead className="text-sm font-medium">标签</TableHead>}
                      {tableColumns.some((x) => x.key === "updatedAt") && <TableHead className="text-sm font-medium">更新时间</TableHead>}
                      <TableHead className="w-[56px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={tableColumns.length + 1} className="h-28 text-center text-sm text-slate-500">
                          <div className="space-y-2">
                            <div>暂无匹配内容</div>
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={openCreate}>
                              新建第一篇资讯
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : null}
                    {pagedItems.map((x) => (
                      <TableRow key={x.id} className="h-12">
                        {tableColumns.some((c) => c.key === "title") && (
                          <TableCell
                            className="max-w-[420px] cursor-pointer truncate py-2 text-sm font-medium hover:bg-muted/50"
                            onClick={() => openEdit(x)}
                          >
                            {x.title}
                          </TableCell>
                        )}
                        {tableColumns.some((c) => c.key === "type") && (
                          <TableCell className="py-2 text-sm text-muted-foreground">{postTypeLabel(x.type)}</TableCell>
                        )}
                        {tableColumns.some((c) => c.key === "status") && (
                          <TableCell className="py-2">
                            <Badge variant="secondary" className="h-7 px-2.5 text-xs">
                              {statusLabel(x.status)}
                            </Badge>
                          </TableCell>
                        )}
                        {tableColumns.some((c) => c.key === "sortOrder") && (
                          <TableCell className="py-2 w-[92px]">
                            {editingSortId === x.id ? (
                              <Input
                                ref={sortInputRef}
                                className="h-8 w-[72px] font-mono text-sm tabular-nums"
                                inputMode="numeric"
                                autoComplete="off"
                                value={editingSortDraft}
                                onChange={(e) =>
                                  setEditingSortDraft(e.target.value.replace(/\D/g, ""))
                                }
                                onBlur={() => void commitSortEdit(x)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    void commitSortEdit(x);
                                  }
                                  if (e.key === "Escape") {
                                    e.preventDefault();
                                    cancelSortEdit();
                                  }
                                }}
                              />
                            ) : (
                              <span
                                className={
                                  x.status === "PUBLISHED"
                                    ? "inline-block min-h-8 min-w-[72px] cursor-text rounded px-1 py-1 text-muted-foreground tabular-nums hover:bg-muted/60"
                                    : "inline-block min-h-8 min-w-[72px] text-muted-foreground"
                                }
                                title={
                                  x.status === "PUBLISHED"
                                    ? "单击编辑排序（数字越小越靠前；留空表示排在后面）"
                                    : undefined
                                }
                                onClick={() => {
                                  if (x.status === "PUBLISHED") beginSortEdit(x);
                                }}
                              >
                                {formatPostSortCell(
                                  x.sortOrder ?? DEFAULT_POST_SORT_ORDER,
                                  x.status,
                                ) || "\u00a0"}
                              </span>
                            )}
                          </TableCell>
                        )}
                        {tableColumns.some((c) => c.key === "category") && (
                          <TableCell className="py-2 text-sm text-muted-foreground">
                            {x.category?.trim() ? x.category.trim() : ""}
                          </TableCell>
                        )}
                        {tableColumns.some((c) => c.key === "updatedAt") && (
                          <TableCell className="py-2 text-sm text-muted-foreground">{new Date(x.updatedAt).toISOString().slice(0, 10)}</TableCell>
                        )}
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
                                  onClick={() => void setPostLineStatus(x, "offline")}
                                >
                                  下线
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  disabled={lineActionId === x.id}
                                  onClick={() => void setPostLineStatus(x, "online")}
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
                资讯管理
              </button>
              <span>/</span>
              <span className="text-slate-700">{active ? "编辑资讯" : "新建资讯"}</span>
            </div>
            <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(submit)}>
                <ContentEditorWorkspace
                  title={active ? "编辑文章" : "新建文章"}
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
                                hasUploadedCover ? "bg-slate-900/35 text-white backdrop-blur-[1px]" : "bg-slate-200/78 text-slate-700"
                              }`}
                            >
                              <div className="text-xl font-medium">点击或拖拽上传封面图</div>
                              <div className={`mt-1 text-base ${hasUploadedCover ? "text-white/85" : "text-slate-600"}`}>
                                推荐尺寸：1200x500px，小于 5MB
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
                                  新闻标题
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
                                  新闻摘要
                                </FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    value={field.value ?? ""}
                                    className="min-h-24 rounded-xl border-slate-200"
                                    placeholder="一句话概述文章核心内容"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                    内容类型
                                  </FormLabel>
                                  <FormControl>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                      <SelectTrigger className="bg-white">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="NEWS">{postTypeLabel("NEWS")}</SelectItem>
                                        <SelectItem value="POLICY">{postTypeLabel("POLICY")}</SelectItem>
                                        <SelectItem value="REPORT">{postTypeLabel("REPORT")}</SelectItem>
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
                                    内容标签
                                  </FormLabel>
                                  <FormControl>
                                    <Input {...field} value={field.value ?? ""} className="bg-white" placeholder="例如：政策解读" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <FormField
                          control={form.control}
                          name="body"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                                资讯正文
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
              <DialogTitle>确认删除资讯？</DialogTitle>
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

