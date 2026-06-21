// Core gamification rules for Duorathi. Pure, server-authoritative helpers so
// the UI and the database always agree on hearts/XP/streak/levels.

export const MAX_HEARTS = 5;
// One heart regenerates every 30 minutes (gentler than Duolingo's ~4-5h so the
// MVP stays fun to test).
export const HEART_REGEN_MS = 30 * 60 * 1000;
export const HEART_REFILL_GEM_COST = 350;
export const STREAK_FREEZE_GEM_COST = 200;
export const MAX_STREAK_FREEZES = 2;

export const DAILY_GOAL_OPTIONS = [
  { xp: 20, label: "Casual" },
  { xp: 50, label: "Regular" },
  { xp: 100, label: "Serious" },
  { xp: 200, label: "Intense" },
] as const;

// ---------------------------------------------------------------------------
// Hearts
// ---------------------------------------------------------------------------

/** Recompute hearts given how long it's been since they were last touched. */
export function regenerateHearts(
  storedHearts: number,
  heartsUpdatedAt: Date,
  now: Date = new Date(),
): { hearts: number; heartsUpdatedAt: Date } {
  if (storedHearts >= MAX_HEARTS) {
    // Full — keep the clock pinned to now so it doesn't bank time.
    return { hearts: MAX_HEARTS, heartsUpdatedAt: now };
  }
  const elapsed = now.getTime() - heartsUpdatedAt.getTime();
  const regened = Math.floor(elapsed / HEART_REGEN_MS);
  if (regened <= 0) return { hearts: storedHearts, heartsUpdatedAt };

  const hearts = Math.min(MAX_HEARTS, storedHearts + regened);
  // Carry the remainder so partial progress toward the next heart isn't lost.
  const consumed = regened * HEART_REGEN_MS;
  const newUpdatedAt =
    hearts >= MAX_HEARTS
      ? now
      : new Date(heartsUpdatedAt.getTime() + consumed);
  return { hearts, heartsUpdatedAt: newUpdatedAt };
}

/** Milliseconds until the next heart regenerates (0 if already full). */
export function msUntilNextHeart(
  hearts: number,
  heartsUpdatedAt: Date,
  now: Date = new Date(),
): number {
  if (hearts >= MAX_HEARTS) return 0;
  const elapsedInCurrent =
    (now.getTime() - heartsUpdatedAt.getTime()) % HEART_REGEN_MS;
  return HEART_REGEN_MS - elapsedInCurrent;
}

// ---------------------------------------------------------------------------
// Levels
// ---------------------------------------------------------------------------

/** XP required to *reach* a given level (level 1 starts at 0 XP). */
export function xpForLevel(level: number): number {
  // Smoothly increasing curve: 0, 60, 160, 300, 480, ...
  return 20 * (level - 1) * level;
}

export function levelInfo(xp: number): {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number; // 0..1 toward next level
} {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = next - base;
  const xpIntoLevel = xp - base;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel: span,
    progress: span > 0 ? xpIntoLevel / span : 0,
  };
}

// ---------------------------------------------------------------------------
// XP earned from a lesson attempt
// ---------------------------------------------------------------------------

export function xpForLesson(
  correct: number,
  total: number,
  firstTime: boolean,
): number {
  const base = firstTime ? 10 : 5; // replays are worth less
  const perfectBonus = total > 0 && correct === total ? 5 : 0;
  return base + perfectBonus;
}

// ---------------------------------------------------------------------------
// Streaks (operate on "YYYY-MM-DD" local-day strings)
// ---------------------------------------------------------------------------

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidDay(day: string): boolean {
  return DAY_RE.test(day);
}

function daysBetween(from: string, to: string): number {
  // Both are YYYY-MM-DD; compare as UTC midnights to avoid TZ drift.
  const a = Date.parse(`${from}T00:00:00Z`);
  const b = Date.parse(`${to}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

/**
 * Given the current streak state and that the user just finished a lesson on
 * `today`, return the updated streak. Banked freezes auto-cover a single missed
 * day so the streak survives.
 */
export function advanceStreak(
  currentStreak: number,
  lastLessonDay: string | null,
  today: string,
  freezes: number,
): { streak: number; freezesUsed: number; alreadyCountedToday: boolean } {
  if (!lastLessonDay) {
    return { streak: 1, freezesUsed: 0, alreadyCountedToday: false };
  }
  const gap = daysBetween(lastLessonDay, today);

  if (gap <= 0) {
    // Same day (or clock skew) — streak already counted today.
    return {
      streak: Math.max(currentStreak, 1),
      freezesUsed: 0,
      alreadyCountedToday: true,
    };
  }
  if (gap === 1) {
    return { streak: currentStreak + 1, freezesUsed: 0, alreadyCountedToday: false };
  }
  // Missed one or more days. Each banked freeze covers one missed day.
  const missed = gap - 1;
  if (freezes >= missed) {
    return {
      streak: currentStreak + 1,
      freezesUsed: missed,
      alreadyCountedToday: false,
    };
  }
  // Streak broken — start fresh at 1 for today.
  return { streak: 1, freezesUsed: freezes, alreadyCountedToday: false };
}
