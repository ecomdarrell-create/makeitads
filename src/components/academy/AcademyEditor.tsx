'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExt from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import { useCallback, useState } from 'react';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote,
  Link as LinkIcon, Image as ImageIcon, Loader2, Undo2, Redo2,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
}

export function AcademyEditor({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      LinkExt.configure({ openOnClick: false, autolink: true }),
      ImageExt.configure({ inline: false, allowBase64: false }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[300px] outline-none px-4 py-3 prose-headings:font-bold prose-h2:mt-6 prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-700 prose-a:text-[#6366F1]',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href || '';
    const url = window.prompt('URL du lien', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const uploadImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/avif';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/academy/upload-cover', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.url) {
          editor.chain().focus().setImage({ src: data.url, alt: 'Image article' }).run();
        } else {
          alert(data.error || "Erreur d'upload");
        }
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [editor]);

  if (!editor) return <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />;

  const btn = 'flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100';
  const btnActive = 'bg-[#6366F1]/10 text-[#6366F1]';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50/60 px-2 py-1.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btn} ${editor.isActive('bold') ? btnActive : ''}`} aria-label="Gras"><Bold className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btn} ${editor.isActive('italic') ? btnActive : ''}`} aria-label="Italique"><Italic className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btn} ${editor.isActive('heading', { level: 2 }) ? btnActive : ''}`} aria-label="H2"><Heading2 className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${btn} ${editor.isActive('heading', { level: 3 }) ? btnActive : ''}`} aria-label="H3"><Heading3 className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btn} ${editor.isActive('bulletList') ? btnActive : ''}`} aria-label="Liste"><List className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btn} ${editor.isActive('orderedList') ? btnActive : ''}`} aria-label="Liste ordonnée"><ListOrdered className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btn} ${editor.isActive('blockquote') ? btnActive : ''}`} aria-label="Citation"><Quote className="h-4 w-4" /></button>
        <div className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" onClick={addLink} className={`${btn} ${editor.isActive('link') ? btnActive : ''}`} aria-label="Lien"><LinkIcon className="h-4 w-4" /></button>
        <button type="button" onClick={uploadImage} disabled={uploading} className={btn} aria-label="Image">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
        </button>
        <div className="mx-1 h-5 w-px bg-slate-200" />
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn} aria-label="Annuler"><Undo2 className="h-4 w-4" /></button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn} aria-label="Refaire"><Redo2 className="h-4 w-4" /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}