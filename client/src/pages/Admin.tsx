/**
 * GreenWaveCoin — Admin Dashboard
 * Blog post management (create, edit, publish/draft toggle, delete).
 * Protected: admin role required.
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  ArrowLeft, Plus, Edit3, Trash2, Eye, EyeOff,
  Save, X, FileText, CheckCircle, Clock, Zap
} from "lucide-react";

// ─── Slug helper ─────────────────────────────────────────────────────────────
function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

// ─── Post form ───────────────────────────────────────────────────────────────
interface PostFormProps {
  initial?: {
    id?: number;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    published: boolean;
  };
  onSave: () => void;
  onCancel: () => void;
}

function PostForm({ initial, onSave, onCancel }: PostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");

  const utils = trpc.useUtils();

  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => { utils.admin.listPosts.invalidate(); onSave(); },
    onError: (e) => setError(e.message),
  });

  const updatePost = trpc.admin.updatePost.useMutation({
    onSuccess: () => { utils.admin.listPosts.invalidate(); onSave(); },
    onError: (e) => setError(e.message),
  });

  const isEditing = !!initial?.id;

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!isEditing) setSlug(toSlug(v));
  };

  const handleSubmit = () => {
    setError("");
    if (!title.trim() || !slug.trim() || !content.trim()) {
      setError("Title, slug, and content are required.");
      return;
    }
    if (isEditing && initial?.id) {
      updatePost.mutate({ id: initial.id, title, slug, content, excerpt, published });
    } else {
      createPost.mutate({ title, slug, content, excerpt: excerpt || undefined, published });
    }
  };

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <div className="rounded-2xl p-6" style={{ background: "rgba(7,20,40,0.9)", border: "1px solid rgba(6,182,212,0.2)" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
          {isEditing ? "Edit Post" : "New Post"}
        </h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setPreview(!preview)}
            style={{ borderColor: "rgba(51,65,85,0.5)", color: "#94a3b8", background: "transparent" }}>
            {preview ? <><EyeOff size={14} className="mr-1" /> Edit</> : <><Eye size={14} className="mr-1" /> Preview</>}
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}
            style={{ borderColor: "rgba(51,65,85,0.5)", color: "#94a3b8", background: "transparent" }}>
            <X size={14} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg text-sm" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171" }}>
          {error}
        </div>
      )}

      {preview ? (
        <div className="prose prose-invert max-w-none">
          <h1 style={{ color: "#f0f9ff", fontFamily: "Syne, sans-serif" }}>{title || "Untitled"}</h1>
          {excerpt && <p style={{ color: "#94a3b8", fontStyle: "italic" }}>{excerpt}</p>}
          <div style={{ color: "#cbd5e1", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{content}</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>Title *</label>
            <input
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Post title..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(51,65,85,0.5)", color: "#f0f9ff" }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>Slug *</label>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-mono"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(51,65,85,0.5)", color: "#06b6d4" }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>Excerpt (optional)</label>
            <input
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Short description shown in post list..."
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(51,65,85,0.5)", color: "#f0f9ff" }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748b" }}>Content * (Markdown supported)</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your post content here. Markdown is supported."
              rows={14}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono resize-y"
              style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(51,65,85,0.5)", color: "#f0f9ff", lineHeight: 1.7 }}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPublished(!published)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: published ? "rgba(16,185,129,0.1)" : "rgba(51,65,85,0.2)",
                border: published ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(51,65,85,0.4)",
                color: published ? "#10b981" : "#64748b",
              }}
            >
              {published ? <><CheckCircle size={14} /> Published</> : <><Clock size={14} /> Draft</>}
            </button>
            <span className="text-xs" style={{ color: "#475569" }}>
              {published ? "Post will be visible to all visitors" : "Only visible to admins"}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <Button onClick={handleSubmit} disabled={isPending} className="gap-2"
          style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
          <Save size={15} /> {isPending ? "Saving..." : "Save Post"}
        </Button>
        <Button variant="outline" onClick={onCancel}
          style={{ borderColor: "rgba(51,65,85,0.5)", color: "#94a3b8", background: "transparent" }}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function Admin() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<null | {
    id: number; title: string; slug: string; content: string; excerpt: string; published: boolean;
  }>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: posts, isLoading: postsLoading } = trpc.admin.listPosts.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const utils = trpc.useUtils();

  const togglePublish = trpc.admin.updatePost.useMutation({
    onSuccess: () => utils.admin.listPosts.invalidate(),
  });

  const deletePost = trpc.admin.deletePost.useMutation({
    onSuccess: () => { utils.admin.listPosts.invalidate(); setDeletingId(null); },
  });

  // Auth guard
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#020b18" }}>
        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#06b6d4", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!user) {
    window.location.href = getLoginUrl();
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>
        <div className="text-center">
          <div className="text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Admin Access Required</h1>
          <p className="mb-6" style={{ color: "#64748b" }}>You don't have permission to view this page.</p>
          <Button onClick={() => navigate("/")} style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const publishedCount = posts?.filter(p => p.published).length ?? 0;
  const draftCount = posts?.filter(p => !p.published).length ?? 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(2,11,24,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
              <ArrowLeft size={15} /> Dashboard
            </a>
            <div className="w-px h-5" style={{ background: "rgba(51,65,85,0.6)" }} />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8b5cf6, #06b6d4)" }}>
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Admin Panel</span>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>
            {user.name ?? "Admin"}
          </span>
        </div>
      </nav>

      <div className="container pt-24 pb-20 max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black mb-1" style={{ fontFamily: "Syne, sans-serif" }}>Blog Management</h1>
          <p style={{ color: "#64748b" }}>Create, edit, and publish posts for the GreenWaveCoin blog.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Posts", value: posts?.length ?? 0, color: "#06b6d4" },
            { label: "Published", value: publishedCount, color: "#10b981" },
            { label: "Drafts", value: draftCount, color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(51,65,85,0.4)" }}>
              <div className="text-3xl font-black font-mono mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: "#64748b" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* New post form */}
        {showForm && !editingPost && (
          <div className="mb-6">
            <PostForm
              onSave={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Edit form */}
        {editingPost && (
          <div className="mb-6">
            <PostForm
              initial={editingPost}
              onSave={() => setEditingPost(null)}
              onCancel={() => setEditingPost(null)}
            />
          </div>
        )}

        {/* Post list header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ fontFamily: "Syne, sans-serif" }}>All Posts</h2>
          {!showForm && !editingPost && (
            <Button onClick={() => setShowForm(true)} className="gap-2"
              style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
              <Plus size={15} /> New Post
            </Button>
          )}
        </div>

        {/* Post list */}
        {postsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "rgba(7,20,40,0.6)" }} />
            ))}
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: "rgba(7,20,40,0.6)", border: "1px solid rgba(51,65,85,0.3)" }}>
            <FileText size={40} className="mx-auto mb-4" style={{ color: "#334155" }} />
            <p className="text-lg font-semibold mb-1" style={{ color: "#475569" }}>No posts yet</p>
            <p className="text-sm mb-4" style={{ color: "#334155" }}>Create your first post to get started.</p>
            <Button onClick={() => setShowForm(true)} className="gap-2"
              style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
              <Plus size={15} /> Create First Post
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="rounded-xl p-4 flex items-start gap-4"
                style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(51,65,85,0.4)" }}>

                {/* Status indicator */}
                <div className="mt-1 shrink-0">
                  {post.published
                    ? <CheckCircle size={16} style={{ color: "#10b981" }} />
                    : <Clock size={16} style={{ color: "#f59e0b" }} />}
                </div>

                {/* Post info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm truncate" style={{ color: "#f0f9ff" }}>{post.title}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded shrink-0" style={{
                      background: post.published ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
                      color: post.published ? "#10b981" : "#f59e0b",
                    }}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="text-xs font-mono" style={{ color: "#475569" }}>/blog/{post.slug}</div>
                  {post.excerpt && <div className="text-xs mt-1 truncate" style={{ color: "#64748b" }}>{post.excerpt}</div>}
                  <div className="text-xs mt-1" style={{ color: "#334155" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                    {post.publishedAt && ` · Published ${new Date(post.publishedAt).toLocaleDateString()}`}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 shrink-0">
                  {/* Toggle publish */}
                  <button
                    onClick={() => togglePublish.mutate({ id: post.id, published: !post.published })}
                    disabled={togglePublish.isPending}
                    className="p-2 rounded-lg transition-colors"
                    title={post.published ? "Unpublish" : "Publish"}
                    style={{ background: "rgba(51,65,85,0.2)", color: post.published ? "#f59e0b" : "#10b981" }}
                  >
                    {post.published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => setEditingPost({ id: post.id, title: post.title, slug: post.slug, content: post.content, excerpt: post.excerpt ?? "", published: post.published })}
                    className="p-2 rounded-lg transition-colors"
                    title="Edit"
                    style={{ background: "rgba(51,65,85,0.2)", color: "#06b6d4" }}
                  >
                    <Edit3 size={14} />
                  </button>

                  {/* Delete */}
                  {deletingId === post.id ? (
                    <div className="flex gap-1">
                      <button
                        onClick={() => deletePost.mutate({ id: post.id })}
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{ background: "rgba(239,68,68,0.2)", color: "#f87171" }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-1 rounded text-xs"
                        style={{ background: "rgba(51,65,85,0.2)", color: "#64748b" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(post.id)}
                      className="p-2 rounded-lg transition-colors"
                      title="Delete"
                      style={{ background: "rgba(51,65,85,0.2)", color: "#ef4444" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
