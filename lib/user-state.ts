import "server-only";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  MAX_HEARTS,
  levelInfo,
  msUntilNextHeart,
  regenerateHearts,
} from "@/lib/game";
import { TOTAL_LESSONS } from "@/lib/curriculum";

export interface UserState {
  id: string;
  name: string | null;
  email: string;
  xp: number;
  level: number;
  levelProgress: number; // 0..1
  xpIntoLevel: number;
  xpForNextLevel: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  nextHeartInMs: number; // ms until +1 heart (0 when full)
  streak: number;
  longestStreak: number;
  streakFreezes: number;
  dailyGoalXp: number;
  completedLessonIds: string[];
  completedCount: number;
  totalLessons: number;
  recentDailyXp: { day: string; xp: number }[];
}

/**
 * Load the signed-in user's full game state. Lazily regenerates hearts and
 * persists them so every read reflects elapsed time. Returns null if signed out.
 */
export async function getCurrentUserState(): Promise<UserState | null> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  // Regenerate hearts based on elapsed time, persisting if anything changed.
  const now = new Date();
  const regen = regenerateHearts(user.hearts, user.heartsUpdatedAt, now);
  if (
    regen.hearts !== user.hearts ||
    regen.heartsUpdatedAt.getTime() !== user.heartsUpdatedAt.getTime()
  ) {
    await prisma.user.update({
      where: { id: userId },
      data: { hearts: regen.hearts, heartsUpdatedAt: regen.heartsUpdatedAt },
    });
  }

  const [progress, recent] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      select: { lessonId: true },
    }),
    prisma.dailyStat.findMany({
      where: { userId },
      orderBy: { day: "desc" },
      take: 14,
      select: { day: true, xpEarned: true },
    }),
  ]);

  const lvl = levelInfo(user.xp);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    xp: user.xp,
    level: lvl.level,
    levelProgress: lvl.progress,
    xpIntoLevel: lvl.xpIntoLevel,
    xpForNextLevel: lvl.xpForNextLevel,
    gems: user.gems,
    hearts: regen.hearts,
    maxHearts: MAX_HEARTS,
    nextHeartInMs: msUntilNextHeart(regen.hearts, regen.heartsUpdatedAt, now),
    streak: user.streak,
    longestStreak: user.longestStreak,
    streakFreezes: user.streakFreezes,
    dailyGoalXp: user.dailyGoalXp,
    completedLessonIds: progress.map((p: { lessonId: string }) => p.lessonId),
    completedCount: progress.length,
    totalLessons: TOTAL_LESSONS,
    recentDailyXp: recent.map((d: { day: string; xpEarned: number }) => ({
      day: d.day,
      xp: d.xpEarned,
    })),
  };
}
