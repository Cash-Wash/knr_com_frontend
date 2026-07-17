"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Heading2, Heading3, ImagePlus, Italic, Link as LinkIcon,
  List, ListOrdered, Quote, Redo2, Underline as UnderlineIcon, Undo2,
} from "lucide-react";
import { getApiBase, authHeaders } from "@/lib/api";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.configure({ HTMLAttributes: { class: "rounded-xl" } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder || "Rédigez le contenu de l'article…" }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base max-w-none min-h-[360px] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const button = (active: boolean, onClick: () => void, icon: React.ReactNode, title: string, disabled?: boolean) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-lg p-1.5 transition disabled:cursor-not-allowed disabled:opacity-40 ${active ? "bg-sky-100 text-sky-600" : "text-stone-500 hover:bg-stone-100"}`}
    >
      {icon}
    </button>
  );

  const insertImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${getApiBase()}/api/uploads`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.url) return;
      const src = payload.url.startsWith("/uploads/") ? `${getApiBase()}${payload.url}` : payload.url;
      editor.chain().focus().setImage({ src }).run();
    } catch {
      // upload failed, silently ignore — the editor stays usable without the image
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 border-b border-stone-100 bg-stone-50 px-2 py-1.5">
        {button(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold size={14} />, "Gras")}
        {button(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic size={14} />, "Italique")}
        {button(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon size={14} />, "Souligné")}
        <span className="mx-1 h-4 w-px bg-stone-200" />
        {button(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 size={14} />, "Titre")}
        {button(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 size={14} />, "Sous-titre")}
        {button(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote size={14} />, "Citation")}
        <span className="mx-1 h-4 w-px bg-stone-200" />
        {button(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List size={14} />, "Liste à puces")}
        {button(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered size={14} />, "Liste numérotée")}
        {button(editor.isActive("link"), () => {
          const url = window.prompt("URL du lien");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }, <LinkIcon size={14} />, "Lien")}
        {button(false, () => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = () => {
            const file = input.files?.[0];
            if (file) insertImage(file);
          };
          input.click();
        }, <ImagePlus size={14} />, "Insérer une image")}
        <span className="mx-1 h-4 w-px bg-stone-200" />
        {button(false, () => editor.chain().focus().undo().run(), <Undo2 size={14} />, "Annuler", !editor.can().undo())}
        {button(false, () => editor.chain().focus().redo().run(), <Redo2 size={14} />, "Rétablir", !editor.can().redo())}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
