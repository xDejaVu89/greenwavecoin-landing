/**
 * GreenWaveCoin — Network Explorer
 * Live stats, full leaderboard, and network health indicators.
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import {
  Zap, ArrowLeft, Activity, Users, Trophy, BarChart3,
  Cpu, Clock, RefreshCw, Loader2, ExternalLink
} from "lucide-react";

const POLYGONSCAN_URL = "https://polygonscan.com/address/";

interface NetworkStatus {
  total_tasks?: number;
  active_workers?: number;
  total_workers?: number;
  current_epoch?: number;
  best_accuracy?: number;
  tasks_this_epoch?: number;
  epoch_start?: string;
}

interface LeaderEntry {
  wallet: string;
  tasks: number;
  accuracy?: number;
}

export default function Network() {
  const [page, setPage] = useState(1);
  const PER_PAGE = 25;

  const { data: statsResult, isLoading: statsLoading, isError: statsError, refetch: refetchStats } =
    trpc.network.getStats.useQuery(undefined, { refetchInterval: 30_000, retry: 2, retryDelay: 3000, retryOnMount: true });
  const { data: lbResult, isLoading: lbLoading, refetch: refetchLb } =
    trpc.network.getLeaderboard.useQuery(undefined, { refetchInterval: 60_000, retry: 2, retryDelay: 3000, retryOnMount: true });

  const status: NetworkStatus | null = statsResult?.data ?? null;
  const leaders: LeaderEntry[] = Array.isArray(lbResult?.data) ? lbResult.data : [];
  const loading = statsLoading || lbLoading;
  const error = statsError;
  const lastUpdated = statsResult?.updatedAt ?? null;

  const handleRefresh = () => { refetchStats(); refetchLb(); };

  const truncate = (addr: string) => addr ? `${addr.slice(0, 8)}...${addr.slice(-6)}` : "—";
  const totalPages = Math.ceil(leaders.length / PER_PAGE);
  const pageLeaders = leaders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
              <span className="font-bold text-sm" style={{ fontFamily: "Syne, sans-serif" }}>Network Explorer</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs hidden sm:block" style={{ color: "#475569" }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4" }}
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
        </div>
      </nav>

      <div className="container pt-24 pb-16">

        {/* Header */}
        <div className="mb-10">
          <Badge className="mb-4" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4", border: "1px solid rgba(6,182,212,0.3)" }}>Live Data</Badge>
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
            Network{" "}
            <span style={{ background: "linear-gradient(135deg, #06b6d4, #10b981)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Explorer</span>
          </h1>
          <p style={{ color: "#64748b" }}>Real-time view of the GreenWaveCoin distributed research network.</p>
        </div>

        {/* Health Banner */}
        <div className="flex items-center gap-3 mb-8 px-4 py-3 rounded-xl" style={{
          background: error ? "rgba(248,113,113,0.05)" : "rgba(16,185,129,0.05)",
          border: `1px solid ${error ? "rgba(248,113,113,0.2)" : "rgba(16,185,129,0.2)"}`
        }}>
          <div className={`w-2.5 h-2.5 rounded-full ${error ? "" : "animate-pulse"}`}
            style={{ background: error ? "#f87171" : "#10b981", boxShadow: error ? "none" : "0 0 8px #10b981" }} />
          <span className="text-sm font-semibold" style={{ color: error ? "#f87171" : "#10b981" }}>
            {error ? "Coordinator Offline" : "Network Healthy"}
          </span>
          <span className="text-xs ml-auto" style={{ color: "#475569" }}>Polygon Mainnet</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {[
            { icon: <Activity size={16} />, label: "Total Tasks", value: status?.total_tasks?.toLocaleString() ?? "—", color: "#06b6d4" },
            { icon: <Users size={16} />, label: "Total Workers", value: status?.total_workers?.toLocaleString() ?? "—", color: "#10b981" },
            { icon: <Cpu size={16} />, label: "Active Now", value: status?.active_workers?.toLocaleString() ?? "—", color: "#8b5cf6" },
            { icon: <Clock size={16} />, label: "Current Epoch", value: status?.current_epoch?.toString() ?? "—", color: "#f59e0b" },
            { icon: <BarChart3 size={16} />, label: "Best Accuracy", value: status?.best_accuracy ? `${(status.best_accuracy * 100).toFixed(2)}%` : "—", color: "#06b6d4" },
            { icon: <Trophy size={16} />, label: "Epoch Tasks", value: status?.tasks_this_epoch?.toLocaleString() ?? "—", color: "#10b981" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(51,65,85,0.4)" }}>
              <div className="flex items-center gap-1.5 mb-2 text-xs" style={{ color: s.color }}>{s.icon}{s.label}</div>
              {loading ? (
                <div className="h-7 w-16 rounded animate-pulse" style={{ background: "rgba(51,65,85,0.4)" }} />
              ) : (
                <div className="text-xl font-bold font-mono" style={{ color: "#f0f9ff" }}>{s.value}</div>
              )}
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(7,20,40,0.8)", border: "1px solid rgba(51,65,85,0.4)" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(51,65,85,0.4)" }}>
            <div className="flex items-center gap-2">
              <Trophy size={18} style={{ color: "#f59e0b" }} />
              <h2 className="font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
                Full Leaderboard
                {leaders.length > 0 && <span className="ml-2 text-sm font-normal" style={{ color: "#475569" }}>({leaders.length} workers)</span>}
              </h2>
            </div>
            <Badge style={{ background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" }}>Live</Badge>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-12 px-6 py-3 text-xs font-semibold" style={{ color: "#475569", borderBottom: "1px solid rgba(51,65,85,0.3)" }}>
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">Wallet Address</div>
            <div className="col-span-2 text-right">Tasks</div>
            <div className="col-span-2 text-right">Explorer</div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin" style={{ color: "#06b6d4" }} />
            </div>
          ) : pageLeaders.length === 0 ? (
            <div className="text-center py-16" style={{ color: "#475569" }}>No leaderboard data available.</div>
          ) : (
            pageLeaders.map((entry, idx) => {
              const rank = (page - 1) * PER_PAGE + idx + 1;
              return (
                <div
                  key={entry.wallet}
                  className="grid grid-cols-12 px-6 py-3.5 items-center hover:bg-[rgba(6,182,212,0.03)] transition-colors"
                  style={{ borderBottom: "1px solid rgba(51,65,85,0.2)" }}
                >
                  <div className="col-span-1">
                    <span className="text-sm font-mono font-bold" style={{ color: rank <= 3 ? "#f59e0b" : "#475569" }}>
                      {rank <= 3 ? ["🥇","🥈","🥉"][rank - 1] : `#${rank}`}
                    </span>
                  </div>
                  <div className="col-span-7">
                    <code className="text-xs" style={{ color: "#94a3b8", fontFamily: "JetBrains Mono, monospace" }}>
                      <span className="hidden sm:inline">{entry.wallet}</span>
                      <span className="sm:hidden">{truncate(entry.wallet)}</span>
                    </code>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-sm font-mono font-semibold" style={{ color: "#f0f9ff" }}>{entry.tasks.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <a href={`${POLYGONSCAN_URL}${entry.wallet}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={13} style={{ color: "#475569" }} className="hover:text-[#06b6d4] transition-colors inline" />
                    </a>
                  </div>
                </div>
              );
            })
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-6 py-4" style={{ borderTop: "1px solid rgba(51,65,85,0.3)" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-40"
                style={{ background: "rgba(51,65,85,0.3)", color: "#94a3b8" }}
              >← Prev</button>
              <span className="text-sm" style={{ color: "#475569" }}>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm disabled:opacity-40"
                style={{ background: "rgba(51,65,85,0.3)", color: "#94a3b8" }}
              >Next →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
