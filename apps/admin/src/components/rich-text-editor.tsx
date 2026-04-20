"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Heading from "@tiptap/extension-heading";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Underline from "@tiptap/extension-underline";
import { uploadAdminCover } from "@/lib/api";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function RichTextEditor({ value, onChange }: Props) {
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [2, 3],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "max-w-none text-base leading-relaxed focus:outline-none [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-2xl [&_h3]:font-bold [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_img]:my-4 [&_img]:rounded-lg [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:p-2 [&_th]:border [&_th]:bg-slate-50 [&_th]:p-2",
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "<p></p>", { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  const buttonClass = (active = false) =>
    `rounded border px-2.5 py-1.5 text-xs transition ${
      active
        ? "border-slate-900 bg-slate-900 text-white"
        : "border-slate-200 bg-white hover:bg-slate-50"
    }`;

  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-white">
      <div className="sticky top-0 z-20 border-b border-border/70 bg-slate-50/95 p-2 backdrop-blur">
        <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          type="button"
          className={buttonClass(!editor.isActive("heading"))}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          正文
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          加粗
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          斜体
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          下划线
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("bulletList"))}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          无序列表
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("orderedList"))}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          有序列表
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("blockquote"))}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          引用
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("link"))}
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("输入链接地址", previousUrl ?? "https://");
            if (!url) return;
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          链接
        </button>
        <button
          type="button"
          className={buttonClass(false)}
          onClick={() => uploadInputRef.current?.click()}
        >
          插入图片
        </button>
        <button
          type="button"
          className={buttonClass(editor.isActive("table"))}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          表格
        </button>
        <button
          type="button"
          className={buttonClass(false)}
          onClick={() => editor.chain().focus().addRowAfter().run()}
        >
          +行
        </button>
        <button
          type="button"
          className={buttonClass(false)}
          onClick={() => editor.chain().focus().addColumnAfter().run()}
        >
          +列
        </button>
        <button
          type="button"
          className={buttonClass(false)}
          onClick={() => editor.chain().focus().deleteTable().run()}
        >
          删表
        </button>
        </div>
      </div>
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (e) => {
          const input = e.currentTarget;
          const file = input.files?.[0];
          if (!file) return;
          try {
            const uploaded = await uploadAdminCover(file);
            editor.chain().focus().setImage({ src: uploaded.url }).run();
          } catch {
            window.alert("图片上传失败，请稍后重试");
          } finally {
            input.value = "";
          }
        }}
      />
      <div className="h-[520px] overflow-y-auto bg-white p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

