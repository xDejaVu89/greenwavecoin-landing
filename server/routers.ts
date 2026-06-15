import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { sendWaitlistConfirmation } from "./email";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  claimBadge,
  createPost,
  deletePost,
  getAllPosts,
  getCacheEntry,
  getPostBySlug,
  getPublishedPosts,
  getUserBadges,
  getWaitlistCount,
  getWaitlistEntryByCode,
  getWorkerProfile,
  generateReferralCode,
  getReferralCount,
  joinWaitlist,
  setCacheEntry,
  updatePost,
  upsertWorkerProfile,
  walletAlreadyOnWaitlist,
} from "./db";

const COORDINATOR_URL = "https://api.greenwavecoin.com";
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
          referredBy: z.string().max(12).optional(), // referral code of the person who referred this user
        })
      )
      .mutation(async ({ input }) => {
        const wallet = input.walletAddress.trim();
        const email = input.email?.trim() || undefined;
        const referredBy = input.referredBy?.trim().toUpperCase() || undefined;

        const exists = await walletAlreadyOnWaitlist(wallet);
        if (exists) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This wallet address is already on the waitlist.",
          });
        }

        // Validate referral code if provided
        let validatedReferredBy: string | undefined = undefined;
        if (referredBy) {
          const referrer = await getWaitlistEntryByCode(referredBy);
          if (referrer) validatedReferredBy = referredBy;
        }

        // Generate a unique referral code for this new user
        let referralCode = generateReferralCode();
        // Retry up to 5 times on collision (extremely unlikely)
        for (let i = 0; i < 5; i++) {
          const collision = await getWaitlistEntryByCode(referralCode);
          if (!collision) break;
          referralCode = generateReferralCode();
        }

        await joinWaitlist({
          walletAddress: wallet,
          email: email ?? null,
          referralCode,
          referredBy: validatedReferredBy ?? null,
        });

        const total = await getWaitlistCount();

        // Notify owner
        await notifyOwner({
          title: "New Waitlist Registration",
          content: `Wallet: ${wallet}${email ? `\nEmail: ${email}` : ""}\nReferral code: ${referralCode}${validatedReferredBy ? `\nReferred by: ${validatedReferredBy}` : ""}\nTotal on waitlist: ${total}`,
        }).catch(() => {});

        // Send confirmation email to subscriber if email provided
        if (email) {
          await sendWaitlistConfirmation({ email, walletAddress: wallet, position: total }).catch(() => {});
        }

        return { success: true, position: total, referralCode };
      }),

    getReferralStats: publicProcedure
      .input(z.object({ referralCode: z.string().max(12) }))
      .query(async ({ input }) => {
        const code = input.referralCode.trim().toUpperCase();
        const count = await getReferralCount(code);
        return { referralCount: count };
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
    getPrice: publicProcedure.query(async () => {
      // GeckoTerminal API — free, no key required
      // Once a QuickSwap pool exists for GWC, replace PAIR_ADDRESS with the actual pair address
      const GWC_CONTRACT = "0x7709cD433dCCf28467d2c9084f4d4db89f3E87B2";
      const GECKO_URL = `https://api.geckoterminal.com/api/v2/networks/polygon_pos/tokens/${GWC_CONTRACT}`;

      const result = await fetchWithCache<{
        price_usd: string | null;
        fdv_usd: string | null;
        volume_usd_24h: string | null;
        price_change_24h: number | null;
      }>(
        "gwc:price",
        GECKO_URL,
        { price_usd: null, fdv_usd: null, volume_usd_24h: null, price_change_24h: null }
      );

      // GeckoTerminal wraps the data in data.attributes
      const raw = result.data as unknown as {
        data?: { attributes?: {
          price_usd?: string | null;
          fdv_usd?: string | null;
          volume_usd?: { h24?: string } | null;
          price_change_percentage?: { h24?: number } | null;
        } }
      };
      const attrs = raw?.data?.attributes;

      return {
        price_usd: attrs?.price_usd ?? null,
        fdv_usd: attrs?.fdv_usd ?? null,
        volume_usd_24h: attrs?.volume_usd?.h24 ?? null,
        price_change_24h: attrs?.price_change_percentage?.h24 ?? null,
        fromCache: result.fromCache,
        updatedAt: result.updatedAt,
      };
    }),


    getStats: publicProcedure.query(async () => {
      // /api/ai/stats returns { totalTasksCompleted, uniqueWorkers, networkStatus: "active", ... }
      const result = await fetchWithCache<{
        totalTasksCompleted: number;
        uniqueWorkers: number;
        networkStatus: string;
        bestAccuracyEver: number;
      }>(
        "coordinator:status",
        `${COORDINATOR_URL}/api/ai/stats`,
        { totalTasksCompleted: 0, uniqueWorkers: 0, networkStatus: "unknown", bestAccuracyEver: 0 }
      );
      // Normalise to the shape the frontend expects
      const d = result.data;
      return {
        data: {
          total_tasks: d.totalTasksCompleted,
          active_workers: d.uniqueWorkers,
          total_workers: d.uniqueWorkers,
          current_epoch: 0,
          best_accuracy: d.bestAccuracyEver,
          networkStatus: d.networkStatus,
        },
        fromCache: result.fromCache,
        updatedAt: result.updatedAt,
      };
    }),

    getLeaderboard: publicProcedure.query(async () => {
      // /api/ai/leaderboard returns { leaderboard: [...], totalResults: N }
      const result = await fetchWithCache<{
        leaderboard: { wallet: string; tasks: number; avgAccuracy?: number }[];
        totalResults: number;
      }>(
        "coordinator:leaderboard",
        `${COORDINATOR_URL}/api/ai/leaderboard`,
        { leaderboard: [], totalResults: 0 }
      );
      // Unwrap to the array the frontend expects
      return {
        data: result.data.leaderboard ?? [],
        fromCache: result.fromCache,
        updatedAt: result.updatedAt,
      };
    }),
  }),

  // ── Badges ──────────────────────────────────────────────────────────────────
  badges: router({
    getMy: protectedProcedure.query(async ({ ctx }) => {
      return getUserBadges(ctx.user.id);
    }),

    claim: protectedProcedure
      .input(z.object({
        milestone: z.enum(["tasks_100", "tasks_1000", "tasks_10000", "top_10"]),
        taskCount: z.number().int().min(0),
        isTop10: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const eligible =
          (input.milestone === "tasks_100" && input.taskCount >= 100) ||
          (input.milestone === "tasks_1000" && input.taskCount >= 1000) ||
          (input.milestone === "tasks_10000" && input.taskCount >= 10000) ||
          (input.milestone === "top_10" && input.isTop10 === true);

        if (!eligible) {
          throw new TRPCError({ code: "FORBIDDEN", message: "You have not reached this milestone yet." });
        }

        const existing = await getUserBadges(ctx.user.id);
        if (existing.some(b => b.milestone === input.milestone)) {
          throw new TRPCError({ code: "CONFLICT", message: "Badge already claimed." });
        }

        await claimBadge({ userId: ctx.user.id, milestone: input.milestone });
        return { success: true };
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

  // ── Admin ───────────────────────────────────────────────────────────────────
  admin: router({
    listPosts: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return getAllPosts();
    }),

    updatePost: protectedProcedure
      .input(z.object({
        id: z.number().int(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().max(500).optional(),
        published: z.boolean().optional(),
        slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        const { id, ...data } = input;
        const updateData: Record<string, unknown> = { ...data };
        if (data.published === true) updateData.publishedAt = new Date();
        if (data.published === false) updateData.publishedAt = null;
        await updatePost(id, updateData as Parameters<typeof updatePost>[1]);
        return { success: true };
      }),

    deletePost: protectedProcedure
      .input(z.object({ id: z.number().int() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await deletePost(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
