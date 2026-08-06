"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { useState } from 'react';
import { createClient } from "@/lib/supabase";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3,
  Quote, Code, Link as LinkIcon, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight, Highlighter, Undo, Redo, Loader2
} from 'lucide-react';

const supabase = createClient();

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Commence à écrire ton article ou tape "/" pour les commandes...' }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      editor.chain().focus().setImage({ src: publicUrl }).run();
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors du téléchargement de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const setLink = () => {
    if (showLinkInput) {
      if (linkUrl) {
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      }
      setLinkUrl('');
      setShowLinkInput(false);
    } else {
      setShowLinkInput(true);
    }
  };

  return (
    <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-[#E5E7EB] bg-[#FAFAFC]">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}><Bold className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}><Italic className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')}><UnderlineIcon className="h-4 w-4" /></ToolbarButton>
        <div className="w-px h-6 bg-[#E5E7EB] mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })}><Heading1 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}><Heading2 className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}><Heading3 className="h-4 w-4" /></ToolbarButton>
        <div className="w-px h-6 bg-[#E5E7EB] mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}><List className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}><ListOrdered className="h-4 w-4" /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}><Quote className="h-4 w-4" /></ToolbarButton>
        <div className="w-px h-6 bg-[#E5E7EB] mx-1" />
        <ToolbarButton onClick={setLink} active={editor.isActive('link')}><LinkIcon className="h-4 w-4" /></ToolbarButton>
        
        <label className="p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-200 cursor-pointer">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
        </label>
      </div>

      {showLinkInput && (
        <div className="p-2 border-b border-[#E5E7EB] bg-[#FAFAFC] flex gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-1.5 rounded-lg border border-[#E5E7EB] text-sm focus:outline-none focus:border-[#6366f1]"
            autoFocus
          />
          <button onClick={setLink} className="px-3 py-1.5 bg-[#6366f1] text-white rounded-lg text-sm font-medium hover:bg-[#5558e6]">Ajouter</button>
        </div>
      )}

      <EditorContent 
        editor={editor} 
        className="prose prose-lg max-w-none p-6 min-h-[500px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
      />

      <style jsx global>{`
        .ProseMirror h1 { font-size: 2.25rem; font-weight: 700; margin: 1.5em 0 0.5em; color: #111827; }
        .ProseMirror h2 { font-size: 1.75rem; font-weight: 700; margin: 1.5em 0 0.5em; color: #111827; }
        .ProseMirror h3 { font-size: 1.375rem; font-weight: 600; margin: 1.5em 0 0.5em; color: #111827; }
        .ProseMirror p { margin-bottom: 1em; line-height: 1.75; color: #374151; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .ProseMirror blockquote { border-left: 4px solid #6366f1; padding-left: 1em; margin-left: 0; font-style: italic; color: #4b5563; background: #faf5ff; padding: 1em; border-radius: 0.5rem; }
        .ProseMirror pre { background: #1e293b; color: #e2e8f0; padding: 1em; border-radius: 0.5rem; overflow-x: auto; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.75rem; margin: 1.5em 0; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        .ProseMirror a { color: #6366f1; text-decoration: underline; }
      `}</style>
    </div>
  );
}

function ToolbarButton({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-all duration-200 ${active ? 'bg-[#6366f1] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
    >
      {children}
    </button>
  );
}