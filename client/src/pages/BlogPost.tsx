/**
 * GreenWaveCoin — Individual Blog Post
 */

import { trpc } from "@/lib/trpc";
import { Zap, ArrowLeft, Calendar, Loader2, AlertCircle } from "lucide-react";
import { useParams } from "wouter";

export default function BlogPost() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";

  const { data: post, isLoading, error } = trpc.blog.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(2,11,24,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(6,182,212,0.1)" }}>
        <div className="container flex items-center h-16 gap-4">
          <a href="/blog" className="flex items-center gap-2 text-sm" style={{ color: "#64748b" }}>
            <ArrowLeft size={15} /> All Posts
          </a>
          <div className="w-px h-5" style={{ background: "rgba(51,65,85,0.6)" }} />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
              <Zap size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>GreenWaveCoin</span>
          </div>
        </div>
      </nav>

      <div className="container pt-24 pb-16 max-w-2xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: "#06b6d4" }} />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <AlertCircle size={32} style={{ color: "#f87171" }} />
            <p style={{ color: "#64748b" }}>Post not found.</p>
            <a href="/blog" className="text-sm" style={{ color: "#06b6d4" }}>← Back to blog</a>
          </div>
        ) : post ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={13} style={{ color: "#475569" }} />
              <span className="text-xs" style={{ color: "#475569" }}>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "Draft"}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "Syne, sans-serif" }}>{post.title}</h1>
            {post.excerpt && (
              <p className="text-lg mb-8 leading-relaxed" style={{ color: "#64748b", borderLeft: "3px solid rgba(6,182,212,0.5)", paddingLeft: "1rem" }}>
                {post.excerpt}
              </p>
            )}
            <div
              className="prose prose-invert max-w-none"
              style={{ color: "#94a3b8", lineHeight: "1.8" }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

/** Very lightweight markdown-to-HTML renderer (no external deps) */
function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3 style='color:#f0f9ff;font-family:Syne,sans-serif;font-size:1.2rem;font-weight:700;margin:1.5rem 0 0.5rem'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 style='color:#f0f9ff;font-family:Syne,sans-serif;font-size:1.5rem;font-weight:700;margin:2rem 0 0.75rem'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 style='color:#f0f9ff;font-family:Syne,sans-serif;font-size:2rem;font-weight:700;margin:2rem 0 1rem'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong style='color:#f0f9ff'>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code style='background:rgba(6,182,212,0.1);color:#06b6d4;padding:0.1em 0.4em;border-radius:4px;font-family:JetBrains Mono,monospace;font-size:0.875em'>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' style='color:#06b6d4;text-decoration:underline' target='_blank' rel='noopener noreferrer'>$1</a>")
    .replace(/^- (.+)$/gm, "<li style='margin:0.25rem 0;padding-left:0.5rem'>$1</li>")
    .replace(/(<li.*<\/li>\n?)+/g, "<ul style='list-style:disc;padding-left:1.5rem;margin:1rem 0'>$&</ul>")
    .replace(/\n\n/g, "</p><p style='margin:1rem 0'>")
    .replace(/^(?!<[h|u|l])(.+)$/gm, (line) => line.startsWith("<") ? line : `<p style='margin:1rem 0'>${line}</p>`);
}
