import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listBlogPostsAdmin, deleteBlogPost, publishBlogPost } from "@/lib/api/admin.functions";
import { getAuthToken } from "@/lib/auth";
import type { BlogPostRow } from "@/types/database";
import { Plus, Pencil, Trash2, Globe, EyeOff, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/blog")({ component: AdminBlog });

function AdminBlog() {
  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  async function load() {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No auth token.");
      const result = await listBlogPostsAdmin({ data: { authToken: token } });
      setPosts(result.posts as BlogPostRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handlePublish(id: string) {
    setActionId(id);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No auth token.");
      await publishBlogPost({ data: { authToken: token, id } });
      setPosts((prev) => prev.map((p) => p.id === id ? { ...p, published: true, published_at: p.published_at ?? new Date().toISOString() } : p));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this post permanently? This cannot be undone.")) return;
    setActionId(id);
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("No auth token.");
      await deleteBlogPost({ data: { authToken: token, id } });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed.");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Blog</h1>
          <p className="text-sm text-slate-400 mt-1">{posts.length} posts total</p>
        </div>
        <Link
          to="/admin/blog/$id"
          params={{ id: "new" }}
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <Plus size={16} /> New post
        </Link>
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-slate-400 py-12">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Loading posts…</span>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-5 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Title</th>
                <th className="px-3 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Category</th>
                <th className="px-3 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-3 py-3 text-xs font-mono uppercase tracking-widest text-slate-500">Published</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-slate-800">
                        {p.hero_image_url ? (
                          <img src={p.hero_image_url} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-amber-500/40 text-lg">✦</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-xs">{p.title}</p>
                        <p className="text-xs text-slate-500 font-mono truncate max-w-xs">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    {p.category ? (
                      <span className="text-[10px] font-mono uppercase bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                        {p.category}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {p.published ? (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-green-500/10 text-green-400 px-2.5 py-1 rounded-full font-mono uppercase">
                        <Globe size={9} /> Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] bg-slate-700 text-slate-400 px-2.5 py-1 rounded-full font-mono uppercase">
                        <EyeOff size={9} /> Draft
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-xs text-slate-500">
                    {p.published_at
                      ? new Date(p.published_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {!p.published && (
                        <button
                          type="button"
                          title="Publish"
                          disabled={actionId === p.id}
                          onClick={() => handlePublish(p.id)}
                          className="inline-flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 px-2.5 py-1 rounded-full font-mono uppercase transition-colors disabled:opacity-50"
                        >
                          {actionId === p.id ? <Loader2 size={9} className="animate-spin" /> : <Globe size={9} />}
                          Publish
                        </button>
                      )}
                      <Link
                        to="/admin/blog/$id"
                        params={{ id: p.id }}
                        className="w-8 h-8 rounded-md bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 inline-flex items-center justify-center transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        type="button"
                        title="Delete"
                        disabled={actionId === p.id}
                        onClick={() => handleDelete(p.id)}
                        className="w-8 h-8 rounded-md bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 inline-flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        {actionId === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && !loading && (
            <div className="px-5 py-16 text-center text-slate-500">
              <p>No blog posts yet.</p>
              <Link to="/admin/blog/$id" params={{ id: "new" }} className="mt-3 inline-block text-amber-500 hover:text-amber-400 text-sm underline">
                Write your first post
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
