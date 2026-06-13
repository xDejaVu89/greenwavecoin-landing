/**
 * useCoordinator — client-side hooks that fetch directly from the coordinator API.
 * Works on static Vercel deployments (no server/tRPC required).
 */

import { useState, useEffect, useCallback } from "react";

const COORDINATOR_URL = "https://api.greenwavecoin.com";
const GECKO_TERMINAL_URL =
  "https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/0x11b48853Ce85Ebf4b1a0AEd9cbE1c951017E16F9";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NetworkStats {
  networkStatus: "active" | "unknown";
  totalTasksCompleted: number;
  uniqueWorkers: number;
  queueLength: number;
  currentEpoch?: number;
  bestAccuracy?: number;
  tasksThisEpoch?: number;
  epochStart?: string;
}

export interface LeaderEntry {
  wallet: string;
  tasks: number;
  avgAccuracy?: number;
}

export interface GWCPrice {
  price_usd: string | null;
  price_change_24h: number | null;
  fdv_usd: string | null;
}

// ─── useNetworkStats ─────────────────────────────────────────────────────────

export function useNetworkStats(refetchInterval = 30_000) {
  const [data, setData] = useState<NetworkStats | null>(null);
  const [isError, setIsError] = useState(false);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${COORDINATOR_URL}/api/ai/stats`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
      setIsError(false);
    } catch {
      setIsError(true);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, refetchInterval);
    return () => clearInterval(id);
  }, [fetch_, refetchInterval]);

  // Default to "ok" while loading — only show "offline" on confirmed error or explicit "unknown" from coordinator
  const status =
    isError ? "offline" : (data !== null && data.networkStatus === "unknown") ? "offline" : "ok";

  return {
    status,
    queueLength: data?.queueLength ?? 0,
    totalResults: data?.totalTasksCompleted ?? 0,
    uniqueWorkers: data?.uniqueWorkers ?? 0,
    currentEpoch: data?.currentEpoch,
    bestAccuracy: data?.bestAccuracy,
    tasksThisEpoch: data?.tasksThisEpoch,
    epochStart: data?.epochStart,
    isError,
    refetch: fetch_,
  };
}

// ─── useLeaderboard ──────────────────────────────────────────────────────────

export function useLeaderboard(refetchInterval = 60_000) {
  const [data, setData] = useState<LeaderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${COORDINATOR_URL}/api/ai/leaderboard`, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const arr: LeaderEntry[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.leaderboard)
        ? json.leaderboard
        : [];
      setData(arr);
      setUpdatedAt(new Date());
    } catch {
      // keep stale data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, refetchInterval);
    return () => clearInterval(id);
  }, [fetch_, refetchInterval]);

  return { data, isLoading, updatedAt, refetch: fetch_ };
}

// ─── useGWCPrice ─────────────────────────────────────────────────────────────

export function useGWCPrice(refetchInterval = 60_000) {
  const [data, setData] = useState<GWCPrice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(GECKO_TERMINAL_URL, {
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const attrs = json?.data?.attributes;
      setData({
        price_usd: attrs?.price_usd ?? null,
        price_change_24h: attrs?.price_change_percentage?.h24
          ? parseFloat(attrs.price_change_percentage.h24)
          : null,
        fdv_usd: attrs?.fdv_usd ?? null,
      });
    } catch {
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, refetchInterval);
    return () => clearInterval(id);
  }, [fetch_, refetchInterval]);

  return { data, isLoading };
}
