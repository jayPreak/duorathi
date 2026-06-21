import Link from "next/link";
import { getCurrentUserState } from "@/lib/user-state";
import { COURSE, LESSON_SEQUENCE } from "@/lib/curriculum";
import DailyGoalRing from "@/components/DailyGoalRing";
import Boosters from "@/components/Boosters";

export default async function LearnPage() {
  const state = await getCurrentUserState();
  if (!state) return null; // layout already guards/redirects

  const completed = new Set(state.completedLessonIds);

  // First unlocked-and-incomplete lesson is the "current" one to start.
  let currentId: string | null = null;
  for (let i = 0; i < LESSON_SEQUENCE.length; i++) {
    const id = LESSON_SEQUENCE[i].lesson.id;
    const unlocked = i === 0 || completed.has(LESSON_SEQUENCE[i - 1].lesson.id);
    if (unlocked && !completed.has(id)) {
      currentId = id;
      break;
    }
  }

  function statusOf(lessonId: string, globalIndex: number) {
    if (completed.has(lessonId)) return "done" as const;
    if (lessonId === currentId) return "current" as const;
    const unlocked =
      globalIndex === 0 ||
      completed.has(LESSON_SEQUENCE[globalIndex - 1].lesson.id);
    return unlocked ? "open" : ("locked" as const);
  }

  const orderOf = new Map(LESSON_SEQUENCE.map((r, i) => [r.lesson.id, i]));
  const courseDone = state.completedCount >= state.totalLessons;

  return (
    <div className="space-y-6">
      {/* Top cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <DailyGoalRing
          goalXp={state.dailyGoalXp}
          recentDailyXp={state.recentDailyXp}
        />
        <Boosters
          hearts={state.hearts}
          maxHearts={state.maxHearts}
          gems={state.gems}
          streakFreezes={state.streakFreezes}
        />
      </div>

      {/* Progress summary */}
      <div className="flex items-center justify-between rounded-2xl bg-polar px-4 py-3 text-sm">
        <span className="font-bold text-eel">
          ⚡ {state.xp} XP · Level {state.level}
        </span>
        <span className="text-wolf">
          {state.completedCount}/{state.totalLessons} lessons
        </span>
      </div>

      {courseDone && (
        <div className="rounded-2xl border-2 border-feather bg-feather/10 p-4 text-center font-bold text-feather">
          🎉 You finished every lesson! Replay any to keep your streak alive.
        </div>
      )}

      {/* The path */}
      <div className="space-y-10">
        {COURSE.map((unit) => (
          <section key={unit.id}>
            <div
              className="rounded-2xl px-5 py-4 text-white shadow-sm"
              style={{ background: unit.color }}
            >
              <p className="text-xs font-bold uppercase tracking-wide opacity-90">
                {unit.title}
              </p>
              <p className="text-lg font-extrabold">{unit.description}</p>
            </div>

            <ol className="mt-6 flex flex-col items-center gap-6">
              {unit.lessons.map((lesson, idxInUnit) => {
                const gi = orderOf.get(lesson.id)!;
                const status = statusOf(lesson.id, gi);
                // gentle zig-zag like Duolingo's path
                const offset = [0, 56, 0, -56][idxInUnit % 4];
                return (
                  <li
                    key={lesson.id}
                    style={{ transform: `translateX(${offset}px)` }}
                    className="flex flex-col items-center"
                  >
                    <LessonNode
                      lessonId={lesson.id}
                      title={lesson.title}
                      status={status}
                      color={unit.color}
                    />
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function LessonNode({
  lessonId,
  title,
  status,
  color,
}: {
  lessonId: string;
  title: string;
  status: "done" | "current" | "open" | "locked";
  color: string;
}) {
  const base =
    "flex h-16 w-16 items-center justify-center rounded-full text-2xl font-extrabold shadow-[0_4px_0_rgba(0,0,0,0.15)]";

  if (status === "locked") {
    return (
      <div className="flex flex-col items-center gap-1 opacity-60">
        <div
          className={`${base} bg-swan text-hare`}
          title={`${title} (locked)`}
        >
          🔒
        </div>
        <span className="text-xs font-bold text-hare">{title}</span>
      </div>
    );
  }

  const icon = status === "done" ? "✓" : "★";
  const ring =
    status === "current" ? "ring-4 ring-offset-2 ring-feather/40" : "";

  return (
    <Link
      href={`/lesson/${lessonId}`}
      className="flex flex-col items-center gap-1"
    >
      {status === "current" && (
        <span className="mb-1 animate-bounce rounded-xl bg-white px-2 py-0.5 text-xs font-extrabold text-feather shadow border-2 border-swan">
          START
        </span>
      )}
      <div
        className={`${base} ${ring} text-white`}
        style={{ background: status === "done" ? "var(--color-feather)" : color }}
        title={title}
      >
        {icon}
      </div>
      <span className="text-xs font-bold text-eel">{title}</span>
    </Link>
  );
}
