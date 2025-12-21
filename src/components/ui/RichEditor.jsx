"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

const RichEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setColor = (color) => {
    editor.chain().focus().setColor(color).run();
  };

  return (
    <div className="border rounded-lg shadow-sm">
      {/* Toolbar */}
      <div className="border-b p-3 flex gap-1 flex-wrap bg-gray-50">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1.5 rounded text-sm font-semibold transition ${
            editor.isActive("bold")
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Bold"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1.5 rounded text-sm italic transition ${
            editor.isActive("italic")
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Italic"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1.5 rounded text-sm underline transition ${
            editor.isActive("underline")
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Underline"
        >
          U
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1.5 rounded text-sm line-through transition ${
            editor.isActive("strike")
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Headings */}
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`px-3 py-1.5 rounded text-sm font-bold transition ${
            editor.isActive("heading", { level: 1 })
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Heading 1"
        >
          H1
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`px-3 py-1.5 rounded text-sm font-bold transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Heading 2"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`px-3 py-1.5 rounded text-sm font-bold transition ${
            editor.isActive("heading", { level: 3 })
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Heading 3"
        >
          H3
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1.5 rounded text-sm transition ${
            editor.isActive("bulletList")
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1.5 rounded text-sm transition ${
            editor.isActive("orderedList")
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Link */}
        <button
          type="button"
          onClick={addLink}
          className={`px-3 py-1.5 rounded text-sm transition ${
            editor.isActive("link")
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-100"
          }`}
          title="Add Link"
        >
          🔗 Link
        </button>

        {editor.isActive("link") && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="px-3 py-1.5 rounded text-sm bg-red-100 hover:bg-red-200 transition"
            title="Remove Link"
          >
            ✕
          </button>
        )}

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1.5 rounded text-sm bg-white hover:bg-gray-100 transition"
          title="Add Image"
        >
          🖼️ Image
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-3 py-1.5 rounded text-sm bg-white hover:bg-gray-100 transition"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} className="tiptap-editor" />

      <style jsx global>{`
        .tiptap-editor {
          padding: 1rem;
          min-height: 250px;
          max-height: 500px;
          overflow-y: auto;
        }

        .tiptap-editor .ProseMirror {
          outline: none;
        }

        .tiptap-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1rem 0;
        }

        .tiptap-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.8rem 0;
        }

        .tiptap-editor h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.6rem 0;
        }

        .tiptap-editor ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .tiptap-editor ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }

        .tiptap-editor li {
          margin: 0.25rem 0;
        }

        .tiptap-editor p {
          margin: 0.5rem 0;
        }

        .tiptap-editor img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }

        .tiptap-editor strong {
          font-weight: bold;
        }

        .tiptap-editor em {
          font-style: italic;
        }

        .tiptap-editor u {
          text-decoration: underline;
        }

        .tiptap-editor s {
          text-decoration: line-through;
        }
      `}</style>
    </div>
  );
};

export default RichEditor;
