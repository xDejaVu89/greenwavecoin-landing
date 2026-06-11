/**
 * GreenWaveCoin — Blog / Updates Feed
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowLeft, Plus, Loader2, FileText, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function Blog() {
  const { user } = useAuth();
  const { data: posts, isLoading } = trpc.blog.list.useQuery();

  // Admin: create post form
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [published, setPublished] = useState(true);
  const [formError, setFormError] = useState("");

  const utils = trpc.useUtils();
  const createPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      utils.blog.list.invalidate();
      setShowForm(false);
      setTitle(""); setSlug(""); setContent(""); setExcerpt("");
      setFormError("");
    },
    onError: (err) => setFormError(err.message),
  });

  const autoSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(2,11,24,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
              <ArrowLeft size={15} /> Home
            </a>
            <div className="w-px h-5" style={{ background: "rgba(51,65,85,0.6)" }} />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Updates & Blog</span>
            </div>
          </div>
          {user?.role === "admin" && (
            <Button size="sm" className="gap-2" onClick={() => setShowForm(!showForm)}
              style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
              <Plus size={14} /> New Post
            </Button>
          )}
        </div>
      </nav>

      <div className="container pt-24 pb-16 max-w-3xl">

        {/* Header */}
        <div className="mb-10">
          <Badge className="mb-4" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>Network Updates</Badge>
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
            GreenWaveCoin{" "}
            <span style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Blog</span>
          </h1>
          <p style={{ color: "#64748b" }}>Development updates, network milestones, and research findings.</p>
        </div>

        {/* Admin: create form */}
        {showForm && user?.role === "admin" && (
          <div className="mb-8 rounded-2xl p-6" style={{ background: "rgba(7,20,40,0.9)", border: "1px solid rgba(6,182,212,0.3)" }}>
            <h2 className="font-bold text-lg mb-4" style={{ fontFamily: "Syne, sans-serif" }}>New Post</h2>
            <div className="space-y-3">
              <input
                placeholder="Title"
                value={title}
                onChange={e => { setTitle(e.target.value); setSlug(autoSlug(e.target.value)); }}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(6,182,212,0.2)", color: "#f0f9ff" }}
              />
              <input
                placeholder="slug (auto-generated)"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none font-mono"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(51,65,85,0.4)", color: "#94a3b8" }}
              />
              <input
                placeholder="Short excerpt (optional)"
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(51,65,85,0.4)", color: "#f0f9ff" }}
              />
              <textarea
                placeholder="Content (Markdown supported)"
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none font-mono"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(51,65,85,0.4)", color: "#f0f9ff" }}
              />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="pub" checked={published} onChange={e => setPublished(e.target.checked)} />
                <label htmlFor="pub" className="text-sm" style={{ color: "#94a3b8" }}>Publish immediately</label>
              </div>
              {formError && <p className="text-sm" style={{ color: "#f87171" }}>{formError}</p>}
              <div className="flex gap-3">
                <Button size="sm" onClick={() => createPost.mutate({ title, slug, content, excerpt: excerpt || undefined, published })}
                  disabled={createPost.isPending || !title || !slug || !content}
                  style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
                  {createPost.isPending ? <Loader2 size={14} className="animate-spin" /> : "Publish Post"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowForm(false)} style={{ borderColor: "rgba(51,65,85,0.5)", color: "#64748b", background: "transparent" }}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Post list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: "#06b6d4" }} />
          </div>
        ) : !posts || posts.length === 0 ? (
          <div className="text-center py-20 rounded-2xl" style={{ background: "rgba(7,20,40,0.5)", border: "1px solid rgba(51,65,85,0.3)" }}>
            <FileText size={40} className="mx-auto mb-4" style={{ color: "#334155" }} />
            <p className="font-semibold mb-1" style={{ color: "#475569" }}>No posts yet</p>
            <p className="text-sm" style={{ color: "#334155" }}>Check back soon for network updates and research findings.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <div className="rounded-2xl p-6 cursor-pointer transition-all hover:border-[rgba(6,182,212,0.4)]"
                  style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(51,65,85,0.4)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={13} style={{ color: "#475569" }} />
                    <span className="text-xs" style={{ color: "#475569" }}>
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Draft"}
                    </span>
                  </div>
                  <h2 className="font-bold text-xl mb-2" style={{ fontFamily: "Syne, sans-serif", color: "#f0f9ff" }}>{post.title}</h2>
                  {post.excerpt && <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{post.excerpt}</p>}
                  <span className="inline-flex items-center gap-1 mt-3 text-sm" style={{ color: "#06b6d4" }}>
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
