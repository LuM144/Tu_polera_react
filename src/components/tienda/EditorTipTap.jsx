
import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import "./EditorTiptap.css";

function EditorTiptap({ contenido = "", onChange }) {

    const editor = useEditor({
        extensions: [StarterKit],
        content: contenido,

        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        }
    });

    // Sincronizar el editor cuando se limpia el formulario
    useEffect(() => {
        if (editor && editor.getHTML() !== contenido) {
            editor.commands.setContent(contenido || "", {
                emitUpdate: false
            });
        }
    }, [editor, contenido]);

    if (!editor) return null;

    return (
        <div className="editor-tiptap">

            <div className="editor-toolbar">

                <button
                    type="button"
                    className={editor.isActive("bold") ? "activo" : ""}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Negrita"
                >
                    <strong>B</strong>
                </button>

                <button
                    type="button"
                    className={editor.isActive("italic") ? "activo" : ""}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Cursiva"
                >
                    <em>I</em>
                </button>

                <button
                    type="button"
                    className={editor.isActive("heading", { level: 2 }) ? "activo" : ""}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Título"
                >
                    H2
                </button>

                <button
                    type="button"
                    className={editor.isActive("bulletList") ? "activo" : ""}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Lista"
                >
                    ☷
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Deshacer"
                >
                    ↶
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Rehacer"
                >
                    ↷
                </button>

            </div>

            <EditorContent
                editor={editor}
                className="editor-contenido"
            />

        </div>
    );
}

export default EditorTiptap;
