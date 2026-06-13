import { count, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { badges, InsertBadge, InsertUser, InsertWaitlist, InsertWorkerProfile, networkCache, posts, users, waitlist, workerProfiles } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ── Waitlist ──────────────────────────────────────────────────────────────────

/** Generate a random 8-character alphanumeric referral code */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusable chars (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export async function joinWaitlist(data: InsertWaitlist) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(waitlist).values(data);
}

export async function getWaitlistCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ value: count() }).from(waitlist);
  return result[0]?.value ?? 0;
}

export async function walletAlreadyOnWaitlist(walletAddress: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select({ id: waitlist.id }).from(waitlist).where(eq(waitlist.walletAddress, walletAddress)).limit(1);
  return result.length > 0;
}

export async function getReferralCount(referralCode: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ value: count() }).from(waitlist).where(eq(waitlist.referredBy, referralCode));
  return result[0]?.value ?? 0;
}

export async function getWaitlistEntryByCode(referralCode: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(waitlist).where(eq(waitlist.referralCode, referralCode)).limit(1);
  return result[0] ?? undefined;
}

// ── Worker Profiles ───────────────────────────────────────────────────────────

export async function getWorkerProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(workerProfiles).where(eq(workerProfiles.userId, userId)).limit(1);
  return result[0] ?? undefined;
}

export async function upsertWorkerProfile(data: InsertWorkerProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(workerProfiles).values(data).onDuplicateKeyUpdate({
    set: { walletAddress: data.walletAddress },
  });
}

// ── Blog Posts ────────────────────────────────────────────────────────────────

export async function getPublishedPosts() {
  const { posts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).where(eq(posts.published, true)).orderBy(posts.publishedAt);
}

export async function getPostBySlug(slug: string) {
  const { posts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result[0] ?? undefined;
}

export async function createPost(data: import("../drizzle/schema").InsertPost) {
  const { posts } = await import("../drizzle/schema");
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(posts).values(data);
}

// ── Network Cache ───────────────────────────────────────────────────────────────────

export async function getCacheEntry(key: string): Promise<{ value: string; updatedAt: Date } | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(networkCache).where(eq(networkCache.key, key)).limit(1);
  return result[0] ?? undefined;
}

export async function setCacheEntry(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(networkCache)
    .values({ key, value })
    .onDuplicateKeyUpdate({ set: { value } });
}

// ── Badges ────────────────────────────────────────────────────────────────────────────────

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(badges).where(eq(badges.userId, userId));
}

export async function hasBadge(userId: number, milestone: InsertBadge["milestone"]): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select({ id: badges.id }).from(badges)
    .where(eq(badges.userId, userId))
    .limit(1);
  return result.some(b => {
    const row = b as { id: number };
    return row.id > 0;
  });
}

export async function claimBadge(data: InsertBadge) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(badges).values(data);
}

// ── Admin Blog ──────────────────────────────────────────────────────────────────────────

export async function getAllPosts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function updatePost(id: number, data: Partial<import("../drizzle/schema").InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(posts).set({ ...data, updatedAt: new Date() }).where(eq(posts.id, id));
}

export async function deletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(posts).where(eq(posts.id, id));
}
