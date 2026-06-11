import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createPost,
  getCacheEntry,
  getPostBySlug,
  getPublishedPosts,
  getWaitlistCount,
  getWorkerProfile,
  joinWaitlist,
  setCacheEntry,
  upsertWorkerProfile,
  walletAlreadyOnWaitlist,
} from "./db";

const COORDINATOR_URL = "https://206.81.5.13.nip.io";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(
  key: string,
  url: string,
  fallback: T
): Promise<{ data: T; fromCache: boolean; updatedAt: Date | null }> {
  const cached = await getCacheEntry(key).catch(() => undefined);
  const now = Date.now();

  if (cached && now - cached.updatedAt.getTime() < CACHE_TTL_MS) {
    try {
      return { data: JSON.parse(cached.value) as T, fromCache: true, updatedAt: cached.updatedAt };
    } catch { /* fall through */ }
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as T;
    await setCacheEntry(key, JSON.stringify(data)).catch(() => {});
    return { data, fromCache: false, updatedAt: new Date() };
  } catch {
    if (cached) {
      try {
        return { data: JSON.parse(cached.value) as T, fromCache: true, updatedAt: cached.updatedAt };
      } catch { /* fall through */ }
    }
    return { data: fallback, fromCache: false, updatedAt: null };
  }
}

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── Waitlist ────────────────────────────────────────────────────────────────
  waitlist: router({
    count: publicProcedure.query(async () => {
      return { count: await getWaitlistCount() };
    }),

    join: publicProcedure
      .input(
        z.object({
          walletAddress: z
            .string()
            .min(26, "Invalid wallet address")
            .max(64, "Invalid wallet address"),
          email: z.string().email("Invalid email").optional().or(z.literal("")),
        })
      )
      .mutation(async ({ input }) => {
        const wallet = input.walletAddress.trim();
        const email = input.email?.trim() || undefined;

        const exists = await walletAlreadyOnWaitlist(wallet);
        if (exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This wallet address is already on the waitlist.",
          });
        }

        await joinWaitlist({ walletAddress: wallet, email: email ?? null });

        const total = await getWaitlistCount();

        // Notify owner
        await notifyOwner({
          title: "New Waitlist Registration",
          content: `Wallet: ${wallet}${email ? `\nEmail: ${email}` : ""}\nTotal on waitlist: ${total}`,
        }).catch(() => {});

        return { success: true, position: total };
      }),
  }),

  // ── Worker Dashboard ────────────────────────────────────────────────────────
  dashboard: router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const profile = await getWorkerProfile(ctx.user.id);
      return profile ?? null;
    }),

    setWallet: protectedProcedure
      .input(
        z.object({
          walletAddress: z
            .string()
            .min(26, "Invalid wallet address")
            .max(64, "Invalid wallet address"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await upsertWorkerProfile({
          userId: ctx.user.id,
          walletAddress: input.walletAddress.trim(),
        });
        return { success: true };
      }),
  }),


  // ── Network Proxy ─────────────────────────────────────────────────────────
  network: router({
    getStats: publicProcedure.query(async () => {
      return fetchWithCache(
        "coordinator:status",
        `${COORDINATOR_URL}/api/ai/status`,
        { total_tasks: 0, active_workers: 0, total_workers: 0, current_epoch: 0, best_accuracy: 0 }
      );
    }),

    getLeaderboard: publicProcedure.query(async () => {
      return fetchWithCache(
        "coordinator:leaderboard",
        `${COORDINATOR_URL}/api/ai/leaderboard`,
        [] as { wallet: string; tasks: number }[]
      );
    }),
  }),

  // ── Blog ────────────────────────────────────────────────────────────────────
  blog: router({
    list: publicProcedure.query(async () => {
      return getPublishedPosts();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getPostBySlug(input.slug);
        if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
        return post;
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
          content: z.string().min(1),
          excerpt: z.string().max(500).optional(),
          published: z.boolean().default(false),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
        }
        await createPost({
          ...input,
          excerpt: input.excerpt ?? null,
          authorId: ctx.user.id,
          publishedAt: input.published ? new Date() : null,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
