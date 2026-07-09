import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  createBlogPost,
  updateBlogPost,
  publishBlogPost,
  listBlogPostsAdmin,
} from "@/lib/api/admin.functions";
import { getAuthToken } from "@/lib/auth";
import type { BlogPostRow } from "@/types/database";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { generateSlug, calculateReadTime } from "@/lib/blog-mapping";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import {
  ArrowLeft, Save, Globe, Loader2,
  Bold, Italic, Strikethrough, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Minus, Undo2, Redo2
} from "lucide-react";

export const Route = createFileRoute("/admin/blog/$id")({ component: BlogEditor });

type FormState = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  read_time: number;
  published: boolean;
  published_at: string;
  hero_image_url: string;
  seo_title: string;
  seo_description: string;
};

function emptyForm(): FormState {
  return {
    slug: "",
    title: "",
    category: "",
    excerpt: "",
    body: "",
    read_time: 5,
    published: false,
    published_at: "",
    hero_image_url: "",
    seo_title: "",
    seo_description: "",
  };
}

function BlogEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(emptyForm());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write your article here…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: form.body || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const words = editor.getText().split(/\s+/).filter(Boolean).length;
      setForm((prev) => ({
        ...prev,
        body: html,
        read_time: Math.max(1, Math.round(words / 200)),
      }));
      // Auto-save debounced (only for existing posts)
      if (!isNew && savedId) {
        if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => autoSave(html), 8000);
      }
    },
  });

  // Set editor content once loaded
  useEffect(() => {
    if (editor && form.body && !editor.getText()) {
      editor.commands.setContent(form.body);
    }
  }, [editor, form.body]);

  useEffect(() => {
    if (isNew) return;
    async function load() {
      try {
        const token = await getAuthToken();
        if (!token) throw new Error("No auth token.");
        const result = await listBlogPostsAdmin({ data: { authToken: token } });
        const post = (result.posts as BlogPostRow[]).find((p) => p.id === id);
        if (!post) throw new Error("Post not found.");
        const loaded: FormState = {
          slug: post.slug,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          body: post.body,
          read_time: post.read_time,
          published: post.published,
          published_at: post.published_at ?? "",
          hero_image_url: post.hero_image_url ?? "",
          seo_title: post.seo_title ?? "",
          seo_description: post.seo_description ?? "",
        };
        setForm(loaded);
        setSavedId(post.id);
        setSlugEdited(true);
        editor?.commands.setContent(post.body);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, isNew, editor]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugEdited) {
        next.slug = generateSlug(value as string);
      }
      return next;
    });
  }

  async function autoSave(bodyHtml: string) {
    const token = await getAuthToken();
    if (!token || !savedId) return;
    try {
      await updateBlogPost({ data: { authToken: token, id: savedId, updates: { body: bodyHtml } } });
    } catch { /* silent auto-save failure is acceptable */ }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No auth token.");

      const payload = {
        slug: form.slug,
        title: form.title,
        category: form.category,
        excerpt: form.excerpt,
        body: form.body,
        read_time: form.read_time,
        published: form.published,
        published_at: form.published_at || null,
        hero_image_url: form.hero_image_url || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
      };

      if (isNew) {
        const result = await createBlogPost({ data: { authToken: token, post: payload } });
        const newPost = result.post as BlogPostRow;
        setSavedId(newPost.id);
        navigate({ to: "/admin/blog/$id", params: { id: newPost.id }, replace: true });
      } else {
        await updateBlogPost({ data: { authToken: token, id: id, updates: payload } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    const token = await getAuthToken();
    if (!token) return;
    setPublishing(true);
    try {
      const targetId = isNew ? savedId : id;
      if (!targetId) throw new Error("Save the post first before publishing.");
      await publishBlogPost({ data: { authToken: token, id: targetId } });
      setForm((prev) => ({ ...prev, published: true, published_at: prev.published_at || new Date().toISOString() }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publish failed.");
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center gap-3 text-slate-400">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Loading post…</span>
      </div>
    );
  }

  const inputCls = "w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500";
  const labelCls = "block text-xs font-mono uppercase tracking-widest text-slate-500 mb-1.5";

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate({ to: "/admin/blog" })}
          className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white inline-flex items-center justify-center transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold text-white">{isNew ? "New post" : "Edit post"}</h1>
          {!isNew && <p className="text-xs font-mono text-slate-500 mt-0.5 truncate">{id}</p>}
        </div>
        <div className="flex items-center gap-2">
          {form.published ? (
            <span className="text-xs bg-green-500/10 text-green-400 border border-green-800 px-3 py-1.5 rounded-lg font-mono uppercase">
              Published
            </span>
          ) : (
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing || (isNew && !savedId)}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
            >
              {publishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
              Publish
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* ─── Meta ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500">Post info</h2>
          <div>
            <label className={labelCls} htmlFor="blog-title">Title *</label>
            <input id="blog-title" type="text" required value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              className={inputCls} placeholder="Understanding Your Kundli" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} htmlFor="blog-slug">Slug *</label>
              <input id="blog-slug" type="text" required value={form.slug}
                onChange={(e) => { setSlugEdited(true); setField("slug", e.target.value); }}
                className={inputCls} placeholder="understanding-your-kundli" />
            </div>
            <div>
              <label className={labelCls} htmlFor="blog-cat">Category</label>
              <input id="blog-cat" type="text" value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className={inputCls} placeholder="Kundli, Numerology, Nadi…" />
            </div>
          </div>

          <div>
            <label className={labelCls} htmlFor="blog-excerpt">Excerpt</label>
            <textarea id="blog-excerpt" rows={3} value={form.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
              className={inputCls} placeholder="A short summary shown on the blog listing…" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className={labelCls} htmlFor="blog-readtime">Read time (min)</label>
              <input id="blog-readtime" type="number" min={1} value={form.read_time}
                onChange={(e) => setField("read_time", Number(e.target.value))}
                className={inputCls} />
            </div>
            <div className="flex-1">
              <label className={labelCls}>Status</label>
              <p className={`text-sm font-medium px-3 py-2.5 rounded-lg border ${form.published ? "text-green-400 border-green-800 bg-green-500/10" : "text-slate-400 border-slate-700 bg-slate-800"}`}>
                {form.published ? "Published" : "Draft"}
                {form.published_at ? ` · ${new Date(form.published_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}` : ""}
              </p>
            </div>
          </div>
        </section>

        {/* ─── Hero image ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500 mb-4">Hero image</h2>
          <ImageUpload
            bucket="blog-images"
            currentUrl={form.hero_image_url || null}
            onUpload={(url) => setField("hero_image_url", url)}
            onClear={() => setField("hero_image_url", "")}
            label="Upload hero image"
          />
        </section>

        {/* ─── Body (Tiptap) ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="border-b border-slate-800 px-4 py-2 flex flex-wrap items-center gap-1">
            {/* Toolbar */}
            {editor && (
              <>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={14} /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={14} /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough size={14} /></ToolbarBtn>
                <span className="w-px h-4 bg-slate-700 mx-1" />
                {[1, 2, 3].map((level) => (
                  <ToolbarBtn key={level} onClick={() => editor.chain().focus().toggleHeading({ level: level as 1|2|3 }).run()} active={editor.isActive("heading", { level })} title={`Heading ${level}`}>
                    <span className="text-xs font-bold">H{level}</span>
                  </ToolbarBtn>
                ))}
                <span className="w-px h-4 bg-slate-700 mx-1" />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List size={14} /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered list"><ListOrdered size={14} /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><span className="font-serif text-sm">"</span></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={14} /></ToolbarBtn>
                <span className="w-px h-4 bg-slate-700 mx-1" />
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left"><AlignLeft size={14} /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center"><AlignCenter size={14} /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right"><AlignRight size={14} /></ToolbarBtn>
                <span className="w-px h-4 bg-slate-700 mx-1" />
                <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo2 size={14} /></ToolbarBtn>
                <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo2 size={14} /></ToolbarBtn>
              </>
            )}
          </div>
          <div className="p-5">
            <EditorContent
              editor={editor}
              className="prose-blog min-h-[320px] text-slate-200 text-[15px] leading-[1.8] focus:outline-none [&_.tiptap]:outline-none [&_.tiptap>*:first-child]:mt-0 [&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.tiptap_p.is-editor-empty:first-child::before]:text-slate-600 [&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none [&_.tiptap_h1]:text-2xl [&_.tiptap_h1]:font-bold [&_.tiptap_h1]:text-white [&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-semibold [&_.tiptap_h2]:text-white [&_.tiptap_h3]:text-lg [&_.tiptap_h3]:font-semibold [&_.tiptap_h3]:text-white [&_.tiptap_strong]:text-white [&_.tiptap_blockquote]:border-l-4 [&_.tiptap_blockquote]:border-amber-500 [&_.tiptap_blockquote]:pl-4 [&_.tiptap_blockquote]:text-slate-400 [&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-5 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-5 [&_.tiptap_hr]:border-slate-700"
            />
          </div>
          <div className="px-5 pb-3 text-xs text-slate-600 font-mono">
            ~{form.read_time} min read · auto-saved{!isNew ? " every 8s" : " after first save"}
          </div>
        </section>

        {/* ─── SEO ─── */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-slate-500">SEO</h2>
          <div>
            <label className={labelCls} htmlFor="blog-seo-title">SEO title</label>
            <input id="blog-seo-title" type="text" value={form.seo_title}
              onChange={(e) => setField("seo_title", e.target.value)}
              className={inputCls} placeholder="Overrides page title in search results" />
          </div>
          <div>
            <label className={labelCls} htmlFor="blog-seo-desc">Meta description</label>
            <textarea id="blog-seo-desc" rows={3} value={form.seo_description}
              onChange={(e) => setField("seo_description", e.target.value)}
              className={inputCls} placeholder="Max 160 characters for search snippets" />
          </div>
        </section>

        {/* ─── Save ─── */}
        <div className="flex gap-3 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isNew ? "Save draft" : "Save changes"}
          </button>
          <button type="button" onClick={() => navigate({ to: "/admin/blog" })}
            className="px-6 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Toolbar button helper ────────────────────────────────────

function ToolbarBtn({
  onClick,
  active = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`w-8 h-7 rounded inline-flex items-center justify-center text-sm transition-colors ${
        active ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
