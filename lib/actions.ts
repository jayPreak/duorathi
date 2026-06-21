"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/validation";
import {
  HEART_REFILL_GEM_COST,
  MAX_HEARTS,
  MAX_STREAK_FREEZES,
  STREAK_FREEZE_GEM_COST,
  advanceStreak,
  isValidDay,
  levelInfo,
  regenerateHearts,
  xpForLesson,
  DAILY_GOAL_OPTIONS,
} from "@/lib/game";
import { getLessonRef } from "@/lib/curriculum";

export type AuthFormState = { error?: string | null };

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid details" };
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "That email is already registered. Try logging in." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { name, email, passwordHash } });

  // Throws a redirect to /learn on success.
  await signIn("credentials", { email, password, redirectTo: "/learn" });
  return {};
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  try {
    await signIn("credentials", { email, password, redirectTo: "/learn" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Wrong email or password." };
    }
    throw error; // re-throw the redirect
  }
  return {};
}

export async function googleLoginAction() {
  await signIn("google", { redirectTo: "/learn" });
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

// ---------------------------------------------------------------------------
// Lesson completion
// ---------------------------------------------------------------------------

export interface CompleteLessonInput {
  lessonId: string;
  correct: number;
  total: number;
  mistakes: number;
  completed: boolean; // false if the learner ran out of hearts
  localDay: string; // "YYYY-MM-DD" in the learner's timezone
}

export interface CompleteLessonResult {
  ok: boolean;
  reason?: string;
  xpEarned: number;
  gemsEarned: number;
  hearts: number;
  streak: number;
  streakIncreased: boolean;
  leveledUp: boolean;
  newLevel: number;
}

export async function completeLessonAction(
  input: CompleteLessonInput,
): Promise<CompleteLessonResult> {
  const empty: CompleteLessonResult = {
    ok: false,
    xpEarned: 0,
    gemsEarned: 0,
    hearts: 0,
    streak: 0,
    streakIncreased: false,
    leveledUp: false,
    newLevel: 1,
  };

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ...empty, reason: "not-signed-in" };

  const ref = getLessonRef(input.lessonId);
  if (!ref) return { ...empty, reason: "unknown-lesson" };

  const day = isValidDay(input.localDay)
    ? input.localDay
    : new Date().toISOString().slice(0, 10);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ...empty, reason: "no-user" };

  const now = new Date();

  // 1) Hearts: regenerate, then spend one per mistake.
  const regen = regenerateHearts(user.hearts, user.heartsUpdatedAt, now);
  let hearts = regen.hearts;
  let heartsUpdatedAt = regen.heartsUpdatedAt;
  if (input.mistakes > 0) {
    const before = hearts;
    hearts = Math.max(0, hearts - input.mistakes);
    if (before >= MAX_HEARTS) heartsUpdatedAt = now; // start the regen clock
  }

  // If the lesson wasn't completed (ran out of hearts), just persist hearts.
  if (!input.completed) {
    await prisma.user.update({
      where: { id: userId },
      data: { hearts, heartsUpdatedAt },
    });
    revalidatePath("/learn");
    return {
      ...empty,
      reason: "not-completed",
      hearts,
      streak: user.streak,
      newLevel: levelInfo(user.xp).level,
    };
  }

  // 2) Lesson progress (was this the first completion?).
  const existing = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId: input.lessonId } },
  });
  const firstTime = !existing?.completed;
  const total = ref.lesson.exercises.length;
  const correct = Math.max(0, Math.min(input.correct, total));

  const xpEarned = xpForLesson(correct, total, firstTime);
  const gemsEarned = firstTime ? 5 : 0;

  // 3) Streak.
  const streakResult = advanceStreak(
    user.streak,
    user.lastLessonDate,
    day,
    user.streakFreezes,
  );
  const newStreak = streakResult.streak;
  const newLongest = Math.max(user.longestStreak, newStreak);

  const newXp = user.xp + xpEarned;
  const leveledUp = levelInfo(newXp).level > levelInfo(user.xp).level;

  // 4) Persist everything in one transaction.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        gems: user.gems + gemsEarned,
        hearts,
        heartsUpdatedAt,
        streak: newStreak,
        longestStreak: newLongest,
        streakFreezes: user.streakFreezes - streakResult.freezesUsed,
        lastLessonDate: day,
      },
    }),
    prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: input.lessonId } },
      create: {
        userId,
        lessonId: input.lessonId,
        completed: true,
        timesCompleted: 1,
        bestCorrect: correct,
        totalQuestions: total,
      },
      update: {
        completed: true,
        timesCompleted: { increment: 1 },
        bestCorrect: Math.max(existing?.bestCorrect ?? 0, correct),
        totalQuestions: total,
      },
    }),
    prisma.dailyStat.upsert({
      where: { userId_day: { userId, day } },
      create: { userId, day, xpEarned, lessonsCompleted: 1 },
      update: {
        xpEarned: { increment: xpEarned },
        lessonsCompleted: { increment: 1 },
      },
    }),
  ]);

  revalidatePath("/learn");

  return {
    ok: true,
    xpEarned,
    gemsEarned,
    hearts,
    streak: newStreak,
    streakIncreased: !streakResult.alreadyCountedToday,
    leveledUp,
    newLevel: levelInfo(newXp).level,
  };
}

// ---------------------------------------------------------------------------
// Economy: refill hearts, buy streak freeze, set daily goal
// ---------------------------------------------------------------------------

export async function refillHeartsAction(): Promise<{
  ok: boolean;
  reason?: string;
}> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, reason: "not-signed-in" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, reason: "no-user" };

  const current = regenerateHearts(user.hearts, user.heartsUpdatedAt).hearts;
  if (current >= MAX_HEARTS) return { ok: false, reason: "already-full" };
  if (user.gems < HEART_REFILL_GEM_COST) {
    return { ok: false, reason: "not-enough-gems" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      hearts: MAX_HEARTS,
      heartsUpdatedAt: new Date(),
      gems: user.gems - HEART_REFILL_GEM_COST,
    },
  });
  revalidatePath("/learn");
  return { ok: true };
}

export async function buyStreakFreezeAction(): Promise<{
  ok: boolean;
  reason?: string;
}> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, reason: "not-signed-in" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, reason: "no-user" };
  if (user.streakFreezes >= MAX_STREAK_FREEZES) {
    return { ok: false, reason: "max-freezes" };
  }
  if (user.gems < STREAK_FREEZE_GEM_COST) {
    return { ok: false, reason: "not-enough-gems" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      streakFreezes: { increment: 1 },
      gems: user.gems - STREAK_FREEZE_GEM_COST,
    },
  });
  revalidatePath("/learn");
  return { ok: true };
}

export async function setDailyGoalAction(
  goalXp: number,
): Promise<{ ok: boolean }> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false };

  const allowed = DAILY_GOAL_OPTIONS.some((o) => o.xp === goalXp);
  if (!allowed) return { ok: false };

  await prisma.user.update({
    where: { id: userId },
    data: { dailyGoalXp: goalXp },
  });
  revalidatePath("/learn");
  return { ok: true };
}
