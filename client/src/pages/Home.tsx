/*
 * GreenWaveCoin Landing Page — Home
 * Design: Deep Space / Cosmic Research
 * Sections: Nav, Hero (particle network), Stats, How It Works, Leaderboard, Worker Setup, Footer
 */

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu, Trophy, Zap, Globe, ChevronRight, Copy, Check,
  Activity, Users, BarChart3, Layers, ArrowRight, Github, ExternalLink,
  Target, Coins, ShieldCheck, TrendingUp, Leaf, Network,
  CheckCircle2, Clock, ChevronDown, ChevronUp, Menu, X
} from "lucide-react";

const COORDINATOR_URL = "https://206.81.5.13.nip.io";
const DOWNLOAD_EXE_URL = "https://github.com/xDejaVu89/greenwavecoin/releases/download/v1.0.0/GreenWaveCoin-Worker.exe";
const EXE_SHA256 = "ad409c4a3a055775c700ef0bf6aef0e6c76f4c2c0eef8023f17d9e7a178045b4";
const GWC_TOKEN = "0x11b48853Ce85Ebf4b1a0AEd9cbE1c951017E16F9";
const ESCROW_ADDR = "0x6a5e4DE78a5Be75c308fCb5833ECC35412511D86";
const CHAIN_NAME = "Polygon Mainnet";
const POLYGONSCAN_URL = `https://polygonscan.com/address/${GWC_TOKEN}`;

// ─── Particle Network Canvas ───────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number; color: string; pulse: number }[] = [];
    const NODE_COUNT = 55;
    const CONNECT_DIST = 160;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2.5 + 1,
        color: Math.random() > 0.5 ? "#06b6d4" : "#10b981",
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        n.pulse += 0.02;
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      });

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach((n) => {
        const glow = 0.7 + 0.3 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * glow, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" className="absolute inset-0 w-full h-full" />;
}

// ─── Copy Button ────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="ml-2 text-[#06b6d4] hover:text-[#10b981] transition-colors">
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

// ─── Counter Animation ───────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = value / 40;
          const timer = setInterval(() => {
            start += step;
            if (start >= value) { setDisplay(value); clearInterval(timer); }
            else setDisplay(Math.floor(start));
          }, 30);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

// ─── Network Stats Hook ──────────────────────────────────────────────────────
function useNetworkStats() {
  const { data, isError } = trpc.network.getStats.useQuery(undefined, {
    refetchInterval: 30_000,
    retry: 1,
  });

  const d = data?.data;
  const status = isError ? "offline" : data ? "ok" : "loading";

  return {
    queueLength: 0,
    totalResults: d?.total_tasks ?? 0,
    uniqueWorkers: d?.active_workers ?? 0,
    status,
  };
}

// ─── Leaderboard Hook ────────────────────────────────────────────────────────
function useLeaderboard() {
  const { data } = trpc.network.getLeaderboard.useQuery(undefined, {
    refetchInterval: 60_000,
    retry: 1,
  });

  const raw = data?.data ?? [];
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((e: { wallet: string; tasks: number; avgAccuracy?: number }) => ({
    wallet: e.wallet,
    tasks: e.tasks,
    avgAccuracy: e.avgAccuracy ?? 0,
  }));
}

// ─── Waitlist Section ─────────────────────────────────────────────────────────
// ─── GWC Price Ticker ─────────────────────────────────────────────────
function GWCPriceTicker() {
  const { data, isLoading } = trpc.network.getPrice.useQuery(undefined, {
    refetchInterval: 60_000,
    retry: 1,
  });

  const price = data?.price_usd ? parseFloat(data.price_usd) : null;
  const change24h = data?.price_change_24h ?? null;
  const fdv = data?.fdv_usd ? parseFloat(data.fdv_usd) : null;
  const isPositive = change24h !== null && change24h >= 0;

  if (isLoading) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-xl"
        style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}
      >
        <Coins size={14} style={{ color: "#06b6d4" }} />
        <span className="text-xs" style={{ color: "#64748b" }}>GWC</span>
        <span className="font-mono font-bold text-sm" style={{ color: "#f0f9ff", fontFamily: "JetBrains Mono, monospace" }}>
          {price !== null ? `$${price < 0.01 ? price.toFixed(6) : price.toFixed(4)}` : "Price TBD"}
        </span>
        {change24h !== null && (
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: isPositive ? "#10b981" : "#ef4444", fontFamily: "JetBrains Mono, monospace" }}
          >
            {isPositive ? "+" : ""}{change24h.toFixed(2)}%
          </span>
        )}
      </div>
      {fdv !== null && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}
        >
          <span className="text-xs" style={{ color: "#64748b" }}>FDV</span>
          <span className="font-mono text-xs font-semibold" style={{ color: "#10b981", fontFamily: "JetBrains Mono, monospace" }}>
            {fdv >= 1e6 ? `$${(fdv / 1e6).toFixed(2)}M` : fdv >= 1e3 ? `$${(fdv / 1e3).toFixed(1)}K` : `$${fdv.toFixed(0)}`}
          </span>
        </div>
      )}
      <a
        href={POLYGONSCAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-colors"
        style={{ background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.15)", color: "#64748b" }}
      >
        <ExternalLink size={11} />
        Polygonscan
      </a>
    </div>
  );
}

function WaitlistSection() {
  const [wallet, setWallet] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState("");

  const { data: countData } = trpc.waitlist.count.useQuery();
  const joinMutation = trpc.waitlist.join.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setPosition(data.position);
      setError("");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    joinMutation.mutate({ walletAddress: wallet, email: email || undefined });
  };

  return (
    <section id="waitlist" className="py-24" style={{ background: "linear-gradient(to bottom, #071428, #020b18)" }}>
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <Badge className="mb-4" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>Early Access</Badge>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Join the{" "}
            <span style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Waitlist</span>
          </h2>
          <p className="text-lg mb-3" style={{ color: "#64748b" }}>
            Register your wallet now to be first in line when mainnet rewards go live. No spam, no obligations.
          </p>
          {countData && countData.count > 0 && (
            <p className="text-sm mb-8 font-mono" style={{ color: "#06b6d4" }}>
              {countData.count.toLocaleString()} wallet{countData.count !== 1 ? "s" : ""} already registered
            </p>
          )}

          {submitted ? (
            <div className="rounded-2xl p-8" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(16,185,129,0.15)" }}>
                <CheckCircle2 size={32} className="text-[#10b981]" />
              </div>
              <h3 className="font-bold text-2xl mb-2" style={{ fontFamily: "Syne, sans-serif", color: "#f0f9ff" }}>You're on the list!</h3>
              <p className="text-sm" style={{ color: "#64748b" }}>
                You're number <span className="font-bold" style={{ color: "#10b981" }}>#{position}</span> on the waitlist.
                We'll notify you when mainnet rewards go live.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Polygon wallet address (0x...)"
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(7,20,40,0.8)",
                    border: "1px solid rgba(6,182,212,0.3)",
                    color: "#f0f9ff",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email address (optional — for launch notifications)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(7,20,40,0.8)",
                    border: "1px solid rgba(51,65,85,0.4)",
                    color: "#f0f9ff",
                  }}
                />
              </div>
              {error && (
                <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
              )}
              <Button
                type="submit"
                disabled={joinMutation.isPending}
                className="w-full h-12 text-base font-semibold"
                style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}
              >
                {joinMutation.isPending ? "Registering..." : "Reserve My Spot"}
              </Button>
              <p className="text-xs" style={{ color: "#475569" }}>
                Your wallet address is stored securely and never shared. You can withdraw at any time.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ Item ────────────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{ background: "rgba(7,20,40,0.8)", border: `1px solid ${open ? "rgba(6,182,212,0.3)" : "rgba(51,65,85,0.4)"}`, transition: "border-color 0.2s" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between gap-4 p-5">
        <span className="font-semibold text-sm md:text-base" style={{ color: "#f0f9ff" }}>{question}</span>
        {open ? <ChevronUp size={18} style={{ color: "#06b6d4", flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: "#475569", flexShrink: 0 }} />}
      </div>
      {open && (
        <div className="px-5 pb-5">
          <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>{answer}</p>
        </div>
      )}
    </div>
  );
}

// ─── Live Tasks Ticker ─────────────────────────────────────────────────────
function LiveTasksTicker() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    // Poll the coordinator every 30 seconds for real task count
    const poll = () => {
      fetch("https://206.81.5.13.nip.io/api/ai/status")
        .then(r => r.json())
        .then((d: { total_tasks?: number }) => {
          if (typeof d.total_tasks === "number") setCount(d.total_tasks);
        })
        .catch(() => {});
    };
    poll();
    const interval = setInterval(poll, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (count === null) return null;

  return (
    <div className="mt-6 flex items-center gap-3 px-4 py-2.5 rounded-xl w-fit"
      style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#10b981" }} />
        <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#10b981" }} />
      </span>
      <span className="text-xs" style={{ color: "#64748b" }}>Tasks completed network-wide:</span>
      <span className="font-mono font-bold text-sm" style={{ color: "#06b6d4", fontFamily: "JetBrains Mono, monospace" }}>
        {count.toLocaleString()}
      </span>
    </div>
  );
}

// ─── Scroll Reveal Hook ─────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.6s cubic-bezier(0.23,1,0.32,1), transform 0.6s cubic-bezier(0.23,1,0.32,1); }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      @media (prefers-reduced-motion: reduce) { .reveal, .reveal.visible { transition: none; opacity: 1; transform: none; } }
    `;
    document.head.appendChild(style);

    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    const els = document.querySelectorAll(".reveal");
    els.forEach(el => observer.observe(el));
    return () => { observer.disconnect(); document.head.removeChild(style); };
  }, []);
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const stats = useNetworkStats();
  const leaders = useLeaderboard();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  useScrollReveal();

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const truncate = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";
  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#roadmap", label: "Roadmap" },
    { href: "#stats", label: "Network" },
    { href: "#tokenomics", label: "Tokenomics" },
    { href: "#waitlist", label: "Waitlist" },
    { href: "#run-worker", label: "Download" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>

      {/* ── Scroll Progress Bar ── */}
      <div className="fixed top-0 left-0 z-[60] h-0.5" style={{ width: `${scrollProgress}%`, background: "linear-gradient(90deg, #06b6d4, #10b981)", transition: "width 0.1s linear" }} />

      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(2, 11, 24, 0.85)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(6, 182, 212, 0.1)" }}>
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>GreenWaveCoin</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#94a3b8" }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="hover:text-[#06b6d4] transition-colors">{l.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="/claim" className="hidden md:block">
              <Button size="sm" className="gap-2 font-semibold" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
                <Coins size={14} /> Claim GWC
              </Button>
            </a>
            <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer" className="hidden md:block">
              <Button variant="outline" size="sm" className="gap-2" style={{ borderColor: "rgba(6, 182, 212, 0.4)", color: "#06b6d4", background: "transparent" }}>
                <Github size={15} /> GitHub
              </Button>
            </a>
            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle menu"
            >
              {mobileNavOpen ? <X size={18} style={{ color: "#06b6d4" }} /> : <Menu size={18} style={{ color: "#06b6d4" }} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileNavOpen && (
          <div className="md:hidden" style={{ background: "rgba(2,11,24,0.97)", borderTop: "1px solid rgba(6,182,212,0.1)" }}>
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  className="py-3 px-2 text-sm rounded-lg hover:text-[#06b6d4] transition-colors"
                  style={{ color: "#94a3b8", borderBottom: "1px solid rgba(51,65,85,0.3)" }}
                  onClick={() => setMobileNavOpen(false)}
                >{l.label}</a>
              ))}
              <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer" className="mt-2">
                <Button variant="outline" size="sm" className="gap-2 w-full" style={{ borderColor: "rgba(6, 182, 212, 0.4)", color: "#06b6d4", background: "transparent" }}>
                  <Github size={15} /> View on GitHub
                </Button>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663681352275/7AUMafBNxaAid4r9BoRGkg/gwc-hero-bg-MU4q4n4srDYMwMvkQ8mBvB.webp"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(2,11,24,0.4) 0%, rgba(2,11,24,0.1) 50%, rgba(2,11,24,0.95) 100%)" }} />
        </div>
        {/* Particle network */}
        <ParticleCanvas />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            {/* Live badge */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full pulse-live" style={{ backgroundColor: "#10b981" }} />
              <span className="text-xs font-mono-data uppercase tracking-widest" style={{ color: "#10b981", fontFamily: "JetBrains Mono, monospace" }}>
                Network {stats.status === "ok" ? "Live" : stats.status === "loading" ? "Connecting..." : "Offline"}
              </span>
            </div>

            <h1 className="font-display font-extrabold leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontFamily: "Syne, sans-serif" }}>
              Your PC Advances{" "}
              <span className="text-gradient-cyan-emerald">AI Research.</span>{" "}
              You Earn GWC.
            </h1>

            <p className="text-lg mb-8 max-w-xl leading-relaxed" style={{ color: "#94a3b8" }}>
              GreenWaveCoin is a distributed AI algorithm research network. Run a worker on your PC,
              help discover more efficient neural architectures, and earn GWC tokens — automatically.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href={DOWNLOAD_EXE_URL} download="GreenWaveCoin-Worker.exe">
                <Button size="lg" className="gap-2 font-semibold" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
                  Download for Windows <ArrowRight size={18} />
                </Button>
              </a>
              <div className="flex items-center gap-2 mt-2 text-xs" style={{ color: "#475569" }}>
                <span style={{ color: "#10b981", fontWeight: 600 }}>v1.0.0</span>
                <span>·</span>
                <span>11 MB</span>
                <span>·</span>
                <span>Windows 10+</span>
              </div>
              <a href="#how-it-works">
                <Button size="lg" variant="outline" className="gap-2" style={{ borderColor: "rgba(6, 182, 212, 0.4)", color: "#06b6d4", background: "rgba(6, 182, 212, 0.05)" }}>
                  How It Works <ChevronRight size={18} />
                </Button>
              </a>
            </div>

            {/* Quick stats row */}
            {stats.status === "ok" && (
              <div className="flex flex-wrap gap-6 mt-10 pt-8" style={{ borderTop: "1px solid rgba(6, 182, 212, 0.1)" }}>
                {[
                  { label: "Tasks Queued", value: stats.queueLength },
                  { label: "Results Submitted", value: stats.totalResults },
                  { label: "Active Workers", value: stats.uniqueWorkers },
                ].map(s => (
                  <div key={s.label}>
                    <div className="font-mono-data text-2xl font-medium" style={{ color: "#06b6d4", fontFamily: "JetBrains Mono, monospace" }}>
                      {s.value.toLocaleString()}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Live tasks running ticker */}
            <LiveTasksTicker />

            {/* GWC live price ticker */}
            <GWCPriceTicker />
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-24" style={{ background: "linear-gradient(to bottom, #020b18, #071428)" }}>
        <div className="container">

          {/* Section header */}
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              Our Mission
            </Badge>
            <h2 className="font-display font-bold text-4xl mb-5" style={{ fontFamily: "Syne, sans-serif" }}>
              What We're Building
            </h2>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: "#94a3b8" }}>
              GreenWaveCoin is an open, decentralised network that turns idle consumer hardware into a
              global AI research engine. We believe the next breakthrough in neural architecture design
              shouldn't be locked behind the compute budgets of a handful of corporations — it should
              emerge from millions of contributors working together, rewarded fairly and transparently
              on-chain.
            </p>
          </div>

          {/* Mission pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 stagger-children">
            {[
              {
                icon: <Target size={22} />,
                color: "#06b6d4",
                title: "Democratise AI Research",
                desc: "Remove the compute monopoly. Anyone with a PC can contribute to cutting-edge neural architecture search and share in the discoveries.",
              },
              {
                icon: <Leaf size={22} />,
                color: "#10b981",
                title: "Greener by Design",
                desc: "Workers run on hardware that's already powered on. We maximise the research output per watt by targeting idle cycles rather than spinning up dedicated data centres.",
              },
              {
                icon: <Network size={22} />,
                color: "#06b6d4",
                title: "Fully Transparent",
                desc: "Every reward epoch, every task hash, and every token distribution is recorded on Polygon. No black boxes — the entire reward pipeline is auditable by anyone.",
              },
            ].map(p => (
              <div key={p.title} className="glass-card rounded-2xl p-8 animate-fade-up">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `rgba(${p.color === "#06b6d4" ? "6, 182, 212" : "16, 185, 129"}, 0.1)`, color: p.color }}
                >
                  {p.icon}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2" style={{ fontFamily: "Syne, sans-serif" }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{p.desc}</p>
              </div>
            ))}
          </div>

          {/* GWC Coin perks */}
          <div className="mb-6 text-center">
            <Badge className="mb-4" style={{ background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
              GWC Token Perks
            </Badge>
            <h2 className="font-display font-bold text-4xl mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Why GWC Has Real Value
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#94a3b8" }}>
              GWC isn't a speculative memecoin. Every token is backed by verifiable compute work
              and tied to a growing ecosystem of utility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {[
              {
                icon: <Coins size={20} />,
                color: "#10b981",
                title: "Earn by Contributing",
                desc: "Every completed and verified task earns GWC. Rewards scale with both task volume and accuracy score — better results, bigger share.",
                tag: "Core Utility",
              },
              {
                icon: <ShieldCheck size={20} />,
                color: "#06b6d4",
                title: "Cryptographic Proof of Work",
                desc: "Results are verified with SHA-256 hashes before any reward is issued. Fake submissions are rejected at the protocol level — no governance vote needed.",
                tag: "Security",
              },
              {
                icon: <TrendingUp size={20} />,
                color: "#10b981",
                title: "Epoch-Based Distribution",
                desc: "Rewards are batched every 24 hours via a Merkle proof system. Gas costs stay low and distributions are trustlessly verifiable on-chain.",
                tag: "Tokenomics",
              },
              {
                icon: <Globe size={20} />,
                color: "#06b6d4",
                title: "Polygon-Powered",
                desc: "Built on Polygon for near-zero transaction fees and fast finality. Claim rewards without burning more in gas than you earned.",
                tag: "Infrastructure",
              },
              {
                icon: <Users size={20} />,
                color: "#10b981",
                title: "Community Governed",
                desc: "GWC holders will vote on network parameters — task types, reward weights, and future research directions — as the protocol matures.",
                tag: "Governance",
              },
              {
                icon: <Zap size={20} />,
                color: "#06b6d4",
                title: "Open Source Forever",
                desc: "The coordinator, worker client, and smart contracts are fully open source. Fork it, audit it, build on it — the network belongs to its contributors.",
                tag: "Transparency",
              },
            ].map(perk => (
              <div
                key={perk.title}
                className="glass-card rounded-2xl p-6 animate-fade-up flex flex-col gap-3"
                style={{ border: `1px solid rgba(${perk.color === "#06b6d4" ? "6, 182, 212" : "16, 185, 129"}, 0.12)` }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `rgba(${perk.color === "#06b6d4" ? "6, 182, 212" : "16, 185, 129"}, 0.1)`, color: perk.color }}
                  >
                    {perk.icon}
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `rgba(${perk.color === "#06b6d4" ? "6, 182, 212" : "16, 185, 129"}, 0.1)`,
                      color: perk.color,
                      border: `1px solid rgba(${perk.color === "#06b6d4" ? "6, 182, 212" : "16, 185, 129"}, 0.25)`,
                    }}
                  >
                    {perk.tag}
                  </span>
                </div>
                <h3 className="font-display font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>{perk.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{perk.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Stats Band ── */}
      <section id="stats" className="py-20" style={{ background: "linear-gradient(to bottom, #020b18, #071428)" }}>
        <div className="container">
          <div className="text-center mb-14 reveal">
            <Badge className="mb-4" style={{ background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
              Live Network Stats
            </Badge>
            <h2 className="font-display font-bold text-4xl" style={{ fontFamily: "Syne, sans-serif" }}>
              The Network at a Glance
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {[
              { icon: <Activity size={24} />, label: "Tasks in Queue", value: stats.queueLength, color: "#06b6d4", desc: "Neural architectures waiting to be tested" },
              { icon: <BarChart3 size={24} />, label: "Results Submitted", value: stats.totalResults, color: "#10b981", desc: "Completed algorithm evaluations" },
              { icon: <Users size={24} />, label: "Unique Workers", value: stats.uniqueWorkers, color: "#06b6d4", desc: "Distinct wallets contributing compute" },
            ].map(s => (
              <div key={s.label} className="glass-card rounded-2xl p-8 animate-fade-up transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: `rgba(${s.color === "#06b6d4" ? "6, 182, 212" : "16, 185, 129"}, 0.1)`, color: s.color }}>
                  {s.icon}
                </div>
                <div className="font-mono-data text-4xl font-medium mb-1" style={{ color: s.color, fontFamily: "JetBrains Mono, monospace" }}>
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="font-semibold text-lg mb-1" style={{ fontFamily: "Syne, sans-serif" }}>{s.label}</div>
                <div className="text-sm" style={{ color: "#64748b" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20" style={{ background: "#071428" }}>
        <div className="container">
          <div className="text-center mb-14 reveal">
            <Badge className="mb-4" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              The Process
            </Badge>
            <h2 className="font-display font-bold text-4xl mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              How GreenWaveCoin Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>
              Like Folding@home, but for AI algorithm research. Your idle CPU/GPU helps discover
              more efficient neural network architectures — and you get paid in GWC.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                { step: "01", icon: <Globe size={20} />, title: "Coordinator Distributes Tasks", desc: "The network coordinator generates neural network configurations — different layer sizes, activation functions, and optimizers — and queues them for testing.", color: "#06b6d4" },
                { step: "02", icon: <Cpu size={20} />, title: "Your Worker Trains & Tests", desc: "The worker software on your PC fetches a task, trains the neural network on a benchmark dataset, and measures its accuracy and efficiency.", color: "#10b981" },
                { step: "03", icon: <Layers size={20} />, title: "Results Are Verified", desc: "The coordinator verifies your result cryptographically using a SHA-256 hash of the metrics. Fake results are rejected before any reward is issued.", color: "#06b6d4" },
                { step: "04", icon: <Trophy size={20} />, title: "You Earn GWC Tokens", desc: "Every 24 hours, an epoch runs. Rewards are calculated based on tasks completed and accuracy scores, then distributed on-chain via a Merkle proof system.", color: "#10b981" },
              ].map(s => (
                <div key={s.step} className="flex gap-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `rgba(${s.color === "#06b6d4" ? "6, 182, 212" : "16, 185, 129"}, 0.1)`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono-data text-xs" style={{ color: s.color, fontFamily: "JetBrains Mono, monospace" }}>{s.step}</span>
                      <span className="font-display font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>{s.title}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(6, 182, 212, 0.2)" }}>
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663681352275/7AUMafBNxaAid4r9BoRGkg/gwc-network-diagram-ZPrtzAM9yS2Z6x4KovBGvG.webp"
                  alt="Neural network architecture visualization"
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 glass-card rounded-xl p-4" style={{ border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                <div className="font-mono-data text-xs" style={{ color: "#10b981", fontFamily: "JetBrains Mono, monospace" }}>
                  Best config found
                </div>
                <div className="font-mono-data text-sm font-medium mt-1" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  layers: [256, 128, 64]
                </div>
                <div className="font-mono-data text-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                  accuracy: <span style={{ color: "#10b981" }}>97.4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Leaderboard ── */}
      <section id="leaderboard" className="py-20" style={{ background: "linear-gradient(to bottom, #071428, #020b18)" }}>
        <div className="container">
          <div className="text-center mb-14">
            <Badge className="mb-4" style={{ background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4", border: "1px solid rgba(6, 182, 212, 0.3)" }}>
              Top Contributors
            </Badge>
            <h2 className="font-display font-bold text-4xl" style={{ fontFamily: "Syne, sans-serif" }}>
              Worker Leaderboard
            </h2>
          </div>

          <div className="max-w-3xl mx-auto glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-4 px-6 py-3 text-xs uppercase tracking-widest" style={{ color: "#475569", borderBottom: "1px solid rgba(6, 182, 212, 0.1)", fontFamily: "JetBrains Mono, monospace" }}>
              <span>Rank</span>
              <span className="col-span-2">Wallet</span>
              <span className="text-right">Tasks / Avg Acc.</span>
            </div>

            {leaders.length === 0 ? (
              <div className="py-16 text-center" style={{ color: "#475569" }}>
                <Trophy size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-display font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>No workers yet</p>
                <p className="text-sm mt-1">Be the first to run a worker and claim the top spot.</p>
              </div>
            ) : (
              leaders.slice(0, 10).map((w, i) => (
                <div key={w.wallet} className="grid grid-cols-4 px-6 py-4 items-center transition-colors hover:bg-white/5" style={{ borderBottom: "1px solid rgba(6, 182, 212, 0.06)" }}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono-data font-medium" style={{ color: i === 0 ? "#f59e0b" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7c2f" : "#475569", fontFamily: "JetBrains Mono, monospace" }}>
                      #{i + 1}
                    </span>
                    {i === 0 && <Trophy size={14} style={{ color: "#f59e0b" }} />}
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-mono-data text-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>{truncate(w.wallet)}</span>
                    <CopyButton text={w.wallet} />
                  </div>
                  <div className="text-right font-mono-data text-sm" style={{ fontFamily: "JetBrains Mono, monospace" }}>
                    <span style={{ color: "#06b6d4" }}>{w.tasks}</span>
                    <span style={{ color: "#475569" }}> / </span>
                    <span style={{ color: "#10b981" }}>{(w.avgAccuracy * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── Roadmap ── */}
      <section id="roadmap" className="py-24" style={{ background: "linear-gradient(to bottom, #071428, #020b18)" }}>
        <div className="container">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4" style={{ background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4", border: "1px solid rgba(6, 182, 212, 0.3)" }}>Roadmap</Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Where We're{" "}
              <span style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Headed</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>
              A transparent view of milestones — completed, in progress, and on the horizon.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-3xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, #06b6d4, rgba(6,182,212,0.1))" }} />

            {[
              { status: "done", label: "Completed", title: "Testnet Launch", desc: "Worker client deployed, coordinator live, first epoch rewards distributed on Polygon Amoy Testnet.", date: "Q1 2025" },
              { status: "done", label: "Completed", title: "Mainnet Launch", desc: "GWC token and reward contracts deployed to Polygon Mainnet. Verified on Polygonscan.", date: "Q2 2026" },
              { status: "done", label: "Completed", title: "Open Source Release", desc: "Full source code published on GitHub. Smart contracts verified on Polygonscan.", date: "Q2 2026" },
              { status: "active", label: "In Progress", title: "Community Growth", desc: "Expanding the worker network, applying for ecosystem grants, building the leaderboard and dashboard.", date: "Q3 2026" },
              
              { status: "upcoming", label: "Upcoming", title: "Governance Module", desc: "GWC holders vote on network parameters: reward weights, epoch length, research directions.", date: "Q2 2027" },
              { status: "upcoming", label: "Upcoming", title: "CEX / DEX Listing", desc: "List GWC on decentralised exchanges (Uniswap, QuickSwap) and pursue centralised exchange listings.", date: "Q3 2027" },
              { status: "upcoming", label: "Upcoming", title: "Mobile Worker App", desc: "Lightweight Android/iOS app that contributes idle compute to the network while your phone charges.", date: "2027" },
            ].map((item, i) => (
              <div key={i} className={`relative flex gap-6 md:gap-0 mb-12 ${
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}>
                {/* Node */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    item.status === "done"
                      ? "border-[#10b981] bg-[#10b981]/20"
                      : item.status === "active"
                      ? "border-[#06b6d4] bg-[#06b6d4]/20"
                      : "border-[#334155] bg-[#0f172a]"
                  }`} style={item.status === "active" ? { boxShadow: "0 0 20px rgba(6,182,212,0.4)" } : {}}>
                    {item.status === "done" ? (
                      <CheckCircle2 size={20} className="text-[#10b981]" />
                    ) : item.status === "active" ? (
                      <div className="w-3 h-3 rounded-full bg-[#06b6d4] animate-pulse" />
                    ) : (
                      <Clock size={18} style={{ color: "#475569" }} />
                    )}
                  </div>
                </div>

                {/* Content card */}
                <div className={`ml-20 md:ml-0 md:w-[45%] ${
                  i % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12"
                }`}>
                  <div className="rounded-xl p-5" style={{ background: "rgba(7,20,40,0.8)", border: `1px solid ${
                    item.status === "done" ? "rgba(16,185,129,0.3)" : item.status === "active" ? "rgba(6,182,212,0.3)" : "rgba(51,65,85,0.5)"
                  }` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded" style={{
                        background: item.status === "done" ? "rgba(16,185,129,0.15)" : item.status === "active" ? "rgba(6,182,212,0.15)" : "rgba(51,65,85,0.3)",
                        color: item.status === "done" ? "#10b981" : item.status === "active" ? "#06b6d4" : "#475569"
                      }}>{item.label}</span>
                      <span className="text-xs" style={{ color: "#475569" }}>{item.date}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-1" style={{ fontFamily: "Syne, sans-serif", color: "#f0f9ff" }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tokenomics ── */}
      <section id="tokenomics" className="py-24" style={{ background: "#020b18" }}>
        <div className="container">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>Tokenomics</Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              GWC Token{" "}
              <span style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Distribution</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#64748b" }}>
              Designed to reward contributors first. The majority of supply flows directly to the workers who power the network.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Donut chart (CSS-based) */}
            <div className="flex items-center justify-center">
              <div className="relative w-72 h-72">
                <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                  {/* Reward Pool 60% */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#06b6d4" strokeWidth="28"
                    strokeDasharray="263.9 175.9" strokeDashoffset="0" />
                  {/* Community Treasury 20% */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="28"
                    strokeDasharray="87.96 351.9" strokeDashoffset="-263.9" />
                  {/* Team/Dev 10% */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#8b5cf6" strokeWidth="28"
                    strokeDasharray="43.98 395.8" strokeDashoffset="-351.9" />
                  {/* Ecosystem Grants 10% */}
                  <circle cx="100" cy="100" r="70" fill="none" stroke="#f59e0b" strokeWidth="28"
                    strokeDasharray="43.98 395.8" strokeDashoffset="-395.8" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ fontFamily: "JetBrains Mono, monospace", color: "#06b6d4" }}>1B</span>
                  <span className="text-sm" style={{ color: "#64748b" }}>Total Supply</span>
                </div>
              </div>
            </div>

            {/* Allocation breakdown */}
            <div className="space-y-4">
              {[
                { label: "Reward Pool", pct: 60, color: "#06b6d4", desc: "Distributed to workers over time via epoch rewards" },
                { label: "Community Treasury", pct: 20, color: "#10b981", desc: "Governed by GWC holders for grants and development" },
                { label: "Team & Development", pct: 10, color: "#8b5cf6", desc: "2-year linear vesting, no cliff" },
                { label: "Ecosystem Grants", pct: 10, color: "#f59e0b", desc: "Partnerships, integrations, and research bounties" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: "rgba(7,20,40,0.6)", border: "1px solid rgba(51,65,85,0.4)" }}>
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm" style={{ color: "#f0f9ff" }}>{item.label}</span>
                      <span className="font-mono font-bold" style={{ color: item.color }}>{item.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "rgba(51,65,85,0.4)" }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#475569" }}>{item.desc}</p>
                  </div>
                </div>
              ))}

              <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.2)" }}>
                <p className="text-sm" style={{ color: "#94a3b8" }}>
                  <span className="font-semibold" style={{ color: "#06b6d4" }}>Smart contract verified</span> on Polygon Mainnet.{" "}
                  <a href={POLYGONSCAN_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#06b6d4] transition-colors">View on Polygonscan →</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24" style={{ background: "linear-gradient(to bottom, #020b18, #071428)" }}>
        <div className="container">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4" style={{ background: "rgba(6, 182, 212, 0.1)", color: "#06b6d4", border: "1px solid rgba(6, 182, 212, 0.3)" }}>FAQ</Badge>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Common{" "}
              <span style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Questions</span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              { q: "Is it safe to run the worker on my PC?", a: "Yes. The worker is open source and only performs mathematical computations — testing neural network configurations. It does not access your files, camera, microphone, or any personal data. The source code is fully auditable on GitHub." },
              { q: "What hardware do I need?", a: "Any modern CPU will work — no GPU required. The worker is designed to run on standard laptops and desktops. Minimum: 2-core CPU, 2 GB RAM, 200 MB disk space, and a stable internet connection." },
              { q: "How much GWC can I earn per day?", a: "Earnings depend on your hardware speed, the number of tasks completed, and the total network size. The more tasks you complete per epoch (24 hours), the larger your share of that epoch's reward pool. The leaderboard on this page shows current top earners." },
              { q: "How are rewards calculated and verified?", a: "After each epoch, the coordinator collects all task results, computes a Merkle root of contributions, and distributes rewards proportionally via the smart contract on Polygon. Every epoch's results are publicly verifiable on-chain." },
              { q: "When can I trade or sell GWC?", a: "GWC is live on Polygon Mainnet. DEX listing is on the roadmap — GWC will be tradeable on Uniswap and QuickSwap once liquidity is seeded." },
              { q: "What blockchain does GWC run on?", a: "GWC is deployed on Polygon Mainnet — a fast, low-fee EVM-compatible blockchain. All reward distributions happen on-chain via verified smart contracts, fully transparent and auditable by anyone." },
              { q: "Is GWC open source? Can I audit the code?", a: "Yes. The worker client, coordinator server, and smart contracts are all open source on GitHub. We encourage the community to audit, fork, and contribute." },
              { q: "How do I claim my rewards?", a: "Rewards are automatically credited to the wallet address you configure in the worker client. After each epoch, the smart contract distributes tokens directly to your wallet — no manual claiming required." },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

            {/* ── Run a Worker ── */}
      <section id="run-worker" className="py-20" style={{ background: "#020b18" }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                Get Started
              </Badge>
              <h2 className="font-display font-bold text-4xl mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
                Start Earning{" "}
                <span className="text-gradient-cyan-emerald">in 2 Clicks</span>
              </h2>
              <p className="text-lg mb-6 leading-relaxed" style={{ color: "#64748b" }}>
                Download the free Windows app, enter your wallet address, and click Start. No Python, no terminal, no setup.
              </p>

              {/* ── Primary Download CTA ── */}
              <a
                href={DOWNLOAD_EXE_URL}
                download="GreenWaveCoin-Worker.exe"
                className="flex items-center gap-4 rounded-2xl p-5 mb-6 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99]"
                style={{
                  background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(16,185,129,0.15))",
                  border: "1px solid rgba(6, 182, 212, 0.4)",
                  textDecoration: "none",
                }}
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 19h18v2H3v-2zm9-3L4 8h5V2h6v6h5l-8 8z" fill="#020b18"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-bold text-lg" style={{ color: "#e2e8f0", fontFamily: "Syne, sans-serif" }}>Download for Windows</div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>v1.0.0</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(100,116,139,0.15)", color: "#94a3b8", border: "1px solid rgba(100,116,139,0.2)" }}>11 MB</span>
                  </div>
                  <div className="text-sm" style={{ color: "#64748b" }}>GreenWaveCoin-Worker.exe · No install required · Windows 10+</div>
                </div>
                <div className="flex-shrink-0">
                  <ChevronRight size={20} style={{ color: "#06b6d4" }} />
                </div>
              </a>

              {/* ── Steps ── */}
              <div className="space-y-3 mb-6">
                {[
                  { n: "1", title: "Download the app", desc: "Click the button above — the .exe downloads immediately (11 MB, no install needed)." },
                  { n: "2", title: "Enter your wallet", desc: "Paste your Ethereum address — rewards go here on Polygon." },
                  { n: "3", title: "Click Start Worker", desc: "Your PC begins training AI models and earning GWC automatically." },
                ].map(s => (
                  <div key={s.n} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18" }}>
                      {s.n}
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: "#ccd6f6", fontFamily: "Syne, sans-serif" }}>{s.title}</div>
                      <div className="text-sm" style={{ color: "#64748b" }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Advanced / CLI toggle ── */}
              <details className="glass-card rounded-xl p-4">
                <summary className="cursor-pointer text-sm font-semibold select-none" style={{ color: "#8892b0", fontFamily: "Syne, sans-serif" }}>
                  Advanced: run from source (Python / Linux / Mac)
                </summary>
                <div className="mt-4 space-y-3">
                  {[
                    { n: "1", title: "Clone the repository", cmd: "git clone https://github.com/xDejaVu89/greenwavecoin" },
                    { n: "2", title: "Install dependencies", cmd: "cd greenwavecoin/ai-worker && pip install -r requirements.txt" },
                    { n: "3", title: "Run the worker", cmd: `python worker.py --backend ${COORDINATOR_URL} --wallet YOUR_WALLET_ADDRESS` },
                  ].map(s => (
                    <div key={s.n} className="rounded-lg p-4" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(6, 182, 212, 0.1)" }}>
                      <div className="text-xs font-semibold mb-2" style={{ color: "#8892b0" }}>{s.n}. {s.title}</div>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs break-all" style={{ color: "#06b6d4", fontFamily: "JetBrains Mono, monospace" }}>{s.cmd}</code>
                        <CopyButton text={s.cmd} />
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            <div className="space-y-6">
              {/* App demo screenshot */}
              <div className="relative">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663681352275/7AUMafBNxaAid4r9BoRGkg/gwc-worker-screenshot-RTajZKyu8p4RZSSjuvYYdi.webp"
                  alt="GreenWaveCoin Worker app running on Windows"
                  className="w-full rounded-2xl shadow-2xl"
                  style={{ border: "1px solid rgba(6, 182, 212, 0.25)" }}
                />
                <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.9)", color: "#020b18" }}>
                  Live Preview
                </div>
              </div>
              {/* SHA-256 checksum */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="#10b981" opacity="0.8"/></svg>
                  <span className="text-xs font-semibold" style={{ color: "#10b981" }}>SHA-256 Checksum</span>
                  <span className="text-xs ml-auto" style={{ color: "#475569" }}>Verify file integrity</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-xs break-all flex-1" style={{ color: "#64748b", fontFamily: "JetBrains Mono, monospace" }}>{EXE_SHA256}</code>
                  <CopyButton text={EXE_SHA256} />
                </div>
              </div>

              {/* Contract info card */}
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full pulse-live" style={{ backgroundColor: "#10b981" }} />
                  <span className="font-display font-semibold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Contract Info</span>
                  <Badge className="ml-auto text-xs" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    {CHAIN_NAME}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "GWC Token", value: GWC_TOKEN, link: POLYGONSCAN_URL },
                    { label: "Reward Pool", value: ESCROW_ADDR, link: `https://polygonscan.com/address/${ESCROW_ADDR}` },
                  ].map(c => (
                    <div key={c.label}>
                      <div className="text-xs mb-1" style={{ color: "#475569" }}>{c.label}</div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono-data text-xs truncate" style={{ color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>{c.value}</code>
                        <CopyButton text={c.value} />
                        <a href={c.link} target="_blank" rel="noopener noreferrer" className="text-[#06b6d4] hover:text-[#10b981] transition-colors flex-shrink-0">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Waitlist ── */}
      <WaitlistSection />

      {/* ── Footer ── */}
      <footer className="py-14" style={{ borderTop: "1px solid rgba(6, 182, 212, 0.1)", background: "#020b18" }}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-bold" style={{ fontFamily: "Syne, sans-serif" }}>GreenWaveCoin</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>Distributed AI research network on Polygon. Open source, community governed.</p>
            </div>
            {/* Explore */}
            <div>
              <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: "#334155" }}>Explore</p>
              <div className="space-y-2">
                <a href="#about" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>About</a>
                <a href="#roadmap" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Roadmap</a>
                <a href="#tokenomics" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Tokenomics</a>
                <a href="#faq" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>FAQ</a>
              </div>
            </div>
            {/* Tools */}
            <div>
              <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: "#334155" }}>Tools</p>
              <div className="space-y-2">
                <a href="/network" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Network Explorer</a>
                <a href="/dashboard" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Worker Dashboard</a>
                <a href="/claim" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Claim Rewards</a>
                <a href="/blog" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Blog & Updates</a>
                <a href="/benchmark" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Earnings Calculator</a>
                <a href="/grants" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Grants & Funding</a>
                <a href="#run-worker" className="block text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>Download Worker</a>
              </div>
            </div>
            {/* Links */}
            <div>
              <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: "#334155" }}>Links</p>
              <div className="space-y-2">
                <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>
                  <Github size={13} /> GitHub
                </a>
                <a href={POLYGONSCAN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>
                  <ExternalLink size={13} /> Polygonscan
                </a>
                <a href="#waitlist" className="flex items-center gap-2 text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>
                  <Zap size={13} /> Join Waitlist
                </a>
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderTop: "1px solid rgba(51,65,85,0.3)" }}>
            <p className="text-xs" style={{ color: "#334155" }}>© 2026 GreenWaveCoin. Open source under MIT License.</p>
            <p className="text-xs" style={{ color: "#334155" }}>Polygon Mainnet — Live</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
