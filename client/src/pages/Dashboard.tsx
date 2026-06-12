/**
 * GreenWaveCoin — Worker Dashboard
 * Protected page: requires login. Shows worker stats, wallet linkage, and leaderboard rank.
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import {
  Zap, Trophy, Cpu, Wallet, Github, ExternalLink,
  LogOut, ArrowLeft, CheckCircle2, AlertCircle, Loader2,
  Activity, Users, BarChart3, Share2, ShieldCheck, Settings
} from "lucide-react";

const POLYGONSCAN_URL = "https://polygonscan.com/address/";

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  // Use server-side cached tRPC procedures instead of direct coordinator fetches
  const { data: statsResult } = trpc.network.getStats.useQuery(undefined, { refetchInterval: 30_000, retry: 2, retryDelay: 3000, retryOnMount: true });
  const coordinatorStats = statsResult?.data ?? null;

  const { data: lbResult } = trpc.network.getLeaderboard.useQuery(undefined, { refetchInterval: 60_000, retry: 2, retryDelay: 3000, retryOnMount: true });
  const rawLb = Array.isArray(lbResult?.data) ? lbResult.data : [];
  const leaderboard: { wallet: string; tasks: number; rank: number }[] = rawLb.map(
    (e: { wallet: string; tasks: number }, i: number) => ({ ...e, rank: i + 1 })
  );

  const [walletInput, setWalletInput] = useState("");
  const [walletSaved, setWalletSaved] = useState(false);
  const [walletError, setWalletError] = useState("");

  const { data: myBadges } = trpc.badges.getMy.useQuery(undefined, { enabled: !!user });

  const claimBadge = trpc.badges.claim.useMutation({
    onSuccess: () => utils.badges.getMy.invalidate(),
  });

  const utils = trpc.useUtils();

  const { data: profile, refetch: refetchProfile } = trpc.dashboard.getProfile.useQuery(
    undefined,
    { enabled: !!user }
  );

  const setWalletMutation = trpc.dashboard.setWallet.useMutation({
    onSuccess: () => {
      setWalletSaved(true);
      setWalletError("");
      refetchProfile();
      setTimeout(() => setWalletSaved(false), 3000);
    },
    onError: (err) => setWalletError(err.message),
  });

  // Find this user's rank on the leaderboard by wallet
  const myRank = profile?.walletAddress
    ? leaderboard.find(l => l.wallet.toLowerCase() === profile.walletAddress?.toLowerCase())
    : null;

  const truncate = (addr: string) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";

  // Redirect to login if not authenticated
  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>
        <div className="text-center max-w-sm mx-auto px-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)" }}>
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>Sign in to access your dashboard</h1>
          <p className="text-sm mb-6" style={{ color: "#64748b" }}>Track your contributions, link your wallet, and see your rank on the leaderboard.</p>
          <a href={getLoginUrl()}>
            <Button className="w-full" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
              Sign In
            </Button>
          </a>
          <a href="/" className="mt-4 flex items-center justify-center gap-2 text-sm" style={{ color: "#64748b" }}>
            <ArrowLeft size={14} /> Back to home
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#020b18" }}>
        <Loader2 size={32} className="animate-spin" style={{ color: "#06b6d4" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#020b18", color: "#f0f9ff" }}>

      {/* ── Top Bar ── */}
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
              <span className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Worker Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.role === "admin" && (
              <a href="/admin">
                <Button variant="outline" size="sm" className="gap-2" style={{ borderColor: "rgba(139,92,246,0.4)", color: "#a78bfa", background: "rgba(139,92,246,0.05)" }}>
                  <Settings size={14} /> Admin
                </Button>
              </a>
            )}
            <span className="text-sm hidden sm:block" style={{ color: "#64748b" }}>{user?.name || user?.email || "Worker"}</span>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => logout()} style={{ borderColor: "rgba(51,65,85,0.5)", color: "#64748b", background: "transparent" }}>
              <LogOut size={14} /> Sign out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container pt-24 pb-16">

        {/* ── Welcome ── */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
            Welcome back, <span style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user?.name?.split(" ")[0] || "Worker"}</span>
          </h1>
          <p className="text-sm" style={{ color: "#64748b" }}>Your contribution to the GreenWaveCoin research network</p>
        </div>

        {/* ── Network Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Activity size={18} />, label: "Total Tasks", value: coordinatorStats?.total_tasks?.toLocaleString() ?? "—", color: "#06b6d4" },
            { icon: <Users size={18} />, label: "Active Workers", value: coordinatorStats?.active_workers?.toLocaleString() ?? "—", color: "#10b981" },
            { icon: <BarChart3 size={18} />, label: "Current Epoch", value: coordinatorStats?.current_epoch?.toString() ?? "—", color: "#8b5cf6" },
            { icon: <Trophy size={18} />, label: "Best Accuracy", value: coordinatorStats?.best_accuracy ? `${(coordinatorStats.best_accuracy * 100).toFixed(1)}%` : "—", color: "#f59e0b" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(51,65,85,0.4)" }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: s.color }}>{s.icon}<span className="text-xs">{s.label}</span></div>
              <div className="text-2xl font-bold font-mono" style={{ color: "#f0f9ff" }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Wallet Linkage ── */}
          <div className="lg:col-span-1 rounded-2xl p-6" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(6,182,212,0.2)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Wallet size={18} style={{ color: "#06b6d4" }} />
              <h2 className="font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Your Wallet</h2>
            </div>

            {profile?.walletAddress ? (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 size={14} className="text-[#10b981]" />
                  <span className="text-xs" style={{ color: "#10b981" }}>Wallet linked</span>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(6,182,212,0.15)" }}>
                  <code className="text-xs flex-1 truncate" style={{ color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>{profile.walletAddress}</code>
                  <a href={`${POLYGONSCAN_URL}${profile.walletAddress}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={13} style={{ color: "#06b6d4" }} />
                  </a>
                </div>
                {myRank && (
                  <div className="mt-3 rounded-lg" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <div className="flex items-center gap-2 p-3">
                      <Trophy size={14} className="text-[#f59e0b]" />
                      <span className="text-sm flex-1" style={{ color: "#f0f9ff" }}>Rank <strong>#{myRank.rank}</strong> — {myRank.tasks.toLocaleString()} tasks</span>
                    </div>
                    <div className="px-3 pb-3">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm rank #${myRank.rank} on the GreenWaveCoin network with ${myRank.tasks.toLocaleString()} tasks completed! 🌊⚡\n\nContributing idle CPU power to advance AI research — and earning GWC tokens for it.\n\nJoin the network: ${window.location.origin}\n\n#GreenWaveCoin #GWC #DeFi #AI`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="w-full gap-2 text-xs"
                          style={{ borderColor: "rgba(29,161,242,0.4)", color: "#1da1f2", background: "rgba(29,161,242,0.05)" }}>
                          <Share2 size={12} /> Share your rank on X
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm mb-4" style={{ color: "#64748b" }}>Link your Polygon wallet to track your rewards on-chain.</p>
            )}

            <form onSubmit={e => { e.preventDefault(); setWalletError(""); setWalletMutation.mutate({ walletAddress: walletInput }); }} className="space-y-3">
              <input
                type="text"
                placeholder="0x... Polygon wallet address"
                value={walletInput}
                onChange={e => setWalletInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(6,182,212,0.25)", color: "#f0f9ff", fontFamily: "JetBrains Mono, monospace" }}
              />
              {walletError && <p className="text-xs" style={{ color: "#f87171" }}>{walletError}</p>}
              {walletSaved && <p className="text-xs" style={{ color: "#10b981" }}>Wallet saved successfully!</p>}
              <Button type="submit" size="sm" disabled={setWalletMutation.isPending || !walletInput} className="w-full" style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18", border: "none" }}>
                {setWalletMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : profile?.walletAddress ? "Update Wallet" : "Link Wallet"}
              </Button>
            </form>
          </div>

          {/* ── Leaderboard ── */}
          <div className="lg:col-span-2 rounded-2xl p-6" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(51,65,85,0.4)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Trophy size={18} style={{ color: "#f59e0b" }} />
              <h2 className="font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Network Leaderboard</h2>
              <Badge className="ml-auto text-xs" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>Live</Badge>
            </div>

            {leaderboard.length === 0 ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 size={20} className="animate-spin" style={{ color: "#475569" }} />
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {leaderboard.slice(0, 20).map((entry: { wallet: string; tasks: number; rank: number }) => {
                  const isMe = profile?.walletAddress?.toLowerCase() === entry.wallet.toLowerCase();
                  return (
                    <div
                      key={entry.wallet}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                      style={{
                        background: isMe ? "rgba(6,182,212,0.08)" : "rgba(0,0,0,0.2)",
                        border: isMe ? "1px solid rgba(6,182,212,0.3)" : "1px solid transparent",
                      }}
                    >
                      <span className="w-6 text-center text-xs font-mono font-bold" style={{ color: entry.rank <= 3 ? "#f59e0b" : "#475569" }}>
                        {entry.rank <= 3 ? ["🥇","🥈","🥉"][entry.rank - 1] : `#${entry.rank}`}
                      </span>
                      <code className="flex-1 text-xs truncate" style={{ color: isMe ? "#06b6d4" : "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
                        {truncate(entry.wallet)}{isMe && " (you)"}
                      </code>
                      <span className="text-xs font-mono font-semibold" style={{ color: "#f0f9ff" }}>{entry.tasks.toLocaleString()}</span>
                      <span className="text-xs" style={{ color: "#475569" }}>tasks</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Milestone Badges ── */}
        <div className="mt-8 rounded-2xl p-6" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(51,65,85,0.4)" }}>
          <div className="flex items-center gap-2 mb-5">
            <ShieldCheck size={18} style={{ color: "#06b6d4" }} />
            <h2 className="text-base font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Milestone Badges</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {([
              { milestone: "tasks_100" as const, label: "100 Tasks", emoji: "🌱", desc: "Complete 100 tasks", threshold: 100 },
              { milestone: "tasks_1000" as const, label: "1,000 Tasks", emoji: "⚡", desc: "Complete 1,000 tasks", threshold: 1000 },
              { milestone: "tasks_10000" as const, label: "10,000 Tasks", emoji: "🔥", desc: "Complete 10,000 tasks", threshold: 10000 },
              { milestone: "top_10" as const, label: "Top 10", emoji: "🏆", desc: "Reach top 10 on leaderboard", threshold: 0 },
            ]).map(b => {
              const earned = myBadges?.some(mb => mb.milestone === b.milestone);
              const myTasks = myRank?.tasks ?? 0;
              const isTop10 = myRank ? myRank.rank <= 10 : false;
              const eligible = b.milestone === "top_10" ? isTop10 : myTasks >= b.threshold;
              return (
                <div key={b.milestone} className="rounded-xl p-4 text-center transition-all" style={{
                  background: earned ? "rgba(16,185,129,0.08)" : "rgba(0,0,0,0.3)",
                  border: earned ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(51,65,85,0.3)",
                  opacity: !earned && !eligible ? 0.5 : 1,
                }}>
                  <div className="text-3xl mb-2" style={{ filter: earned ? "none" : "grayscale(1)" }}>{b.emoji}</div>
                  <div className="text-xs font-bold mb-1" style={{ color: earned ? "#10b981" : "#f0f9ff" }}>{b.label}</div>
                  <div className="text-xs mb-3" style={{ color: "#475569" }}>{b.desc}</div>
                  {earned ? (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>Earned ✓</span>
                  ) : eligible ? (
                    <button
                      onClick={() => claimBadge.mutate({ milestone: b.milestone, taskCount: myTasks, isTop10 })}
                      disabled={claimBadge.isPending}
                      className="text-xs px-3 py-1 rounded-full font-semibold transition-all"
                      style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", color: "#020b18" }}
                    >
                      Claim
                    </button>
                  ) : (
                    <span className="text-xs" style={{ color: "#334155" }}>Locked</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Github size={16} />, label: "Source Code", href: "https://github.com/xDejaVu89/greenwavecoin", desc: "View the open-source codebase" },
            { icon: <ExternalLink size={16} />, label: "Polygonscan", href: "https://polygonscan.com/address/0x11b48853Ce85Ebf4b1a0AEd9cbE1c951017E16F9", desc: "Verify the smart contract" },
            { icon: <Cpu size={16} />, label: "Download Worker", href: "/#run-worker", desc: "Get the latest worker client" },
          ].map(l => (
            <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl hover:border-[rgba(6,182,212,0.4)] transition-colors"
              style={{ background: "rgba(7,20,40,0.6)", border: "1px solid rgba(51,65,85,0.4)" }}>
              <div style={{ color: "#06b6d4" }}>{l.icon}</div>
              <div>
                <div className="text-sm font-semibold" style={{ color: "#f0f9ff" }}>{l.label}</div>
                <div className="text-xs" style={{ color: "#475569" }}>{l.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
