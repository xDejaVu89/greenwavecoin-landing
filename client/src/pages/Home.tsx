/*
 * GreenWaveCoin Landing Page — Home
 * Design: Deep Space / Cosmic Research
 * Sections: Nav, Hero (particle network), Stats, How It Works, Leaderboard, Worker Setup, Footer
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Cpu, Trophy, Zap, Globe, ChevronRight, Copy, Check,
  Activity, Users, BarChart3, Layers, ArrowRight, Github, ExternalLink
} from "lucide-react";

const COORDINATOR_URL = "https://206.81.5.13.nip.io";
const DOWNLOAD_EXE_URL = "https://github.com/xDejaVu89/greenwavecoin/releases/download/v1.0.0/GreenWaveCoin-Worker.exe";
const EXE_SHA256 = "ad409c4a3a055775c700ef0bf6aef0e6c76f4c2c0eef8023f17d9e7a178045b4";
const GWC_TOKEN = "0x6D938b4C48300A29905FBa272cCdC1207538865f";
const ESCROW_ADDR = "0x2F3F050Ba9701c18E852011258fe6FF858BC0ED0";
const CHAIN_NAME = "Polygon Amoy Testnet";
const POLYGONSCAN_URL = `https://amoy.polygonscan.com/address/${GWC_TOKEN}`;

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
  const [stats, setStats] = useState({ queueLength: 0, totalResults: 0, uniqueWorkers: 0, status: "loading" });

  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch(`${COORDINATOR_URL}/health`);
      if (r.ok) {
        const d = await r.json();
        setStats({ queueLength: d.queueLength ?? 0, totalResults: d.totalResults ?? 0, uniqueWorkers: d.uniqueWorkers ?? 0, status: "ok" });
      }
    } catch {
      setStats(s => ({ ...s, status: "offline" }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return stats;
}

// ─── Leaderboard Hook ────────────────────────────────────────────────────────
function useLeaderboard() {
  const [leaders, setLeaders] = useState<{ wallet: string; tasks: number; avgAccuracy: number }[]>([]);

  useEffect(() => {
    fetch(`${COORDINATOR_URL}/api/ai/leaderboard`)
      .then(r => r.json())
      .then(d => setLeaders(d.leaderboard ?? []))
      .catch(() => {});
  }, []);

  return leaders;
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Home() {
  const stats = useNetworkStats();
  const leaders = useLeaderboard();

  const truncate = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>

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
            <a href="#how-it-works" className="hover:text-[#06b6d4] transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-[#06b6d4] transition-colors">Network</a>
            <a href="#leaderboard" className="hover:text-[#06b6d4] transition-colors">Leaderboard</a>
            <a href="#run-worker" className="hover:text-[#06b6d4] transition-colors">Download</a>
          </div>
          <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="gap-2" style={{ borderColor: "rgba(6, 182, 212, 0.4)", color: "#06b6d4", background: "transparent" }}>
              <Github size={15} /> GitHub
            </Button>
          </a>
        </div>
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
          </div>
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section id="stats" className="py-20" style={{ background: "linear-gradient(to bottom, #020b18, #071428)" }}>
        <div className="container">
          <div className="text-center mb-14">
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
          <div className="text-center mb-14">
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
                    { label: "Reward Escrow", value: ESCROW_ADDR, link: `https://amoy.polygonscan.com/address/${ESCROW_ADDR}` },
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

      {/* ── Footer ── */}
      <footer className="py-12" style={{ borderTop: "1px solid rgba(6, 182, 212, 0.1)", background: "#020b18" }}>
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-display font-bold" style={{ fontFamily: "Syne, sans-serif" }}>GreenWaveCoin</span>
            </div>
            <p className="text-sm text-center" style={{ color: "#475569" }}>
              Distributed AI research network on Polygon Amoy Testnet. Open source.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/xDejaVu89/greenwavecoin" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>
                <Github size={16} /> Source Code
              </a>
              <a href={POLYGONSCAN_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:text-[#06b6d4] transition-colors" style={{ color: "#64748b" }}>
                <ExternalLink size={16} /> Polygonscan
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
