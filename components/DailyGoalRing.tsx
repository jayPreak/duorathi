"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { DAILY_GOAL_OPTIONS } from "@/lib/game";
import { setDailyGoalAction } from "@/lib/actions";

function localToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DailyGoalRing({
  goalXp,
  recentDailyXp,
}: {
  goalXp: number;
  recentDailyXp: { day: string; xp: number }[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  const today = localToday();
  const todayXp = recentDailyXp.find((d) => d.day === today)?.xp ?? 0;
  const progress = Math.min(1, todayXp / goalXp);
  const met = todayXp >= goalXp;

  const R = 34;
  const C = 2 * Math.PI * R;

  function chooseGoal(xp: number) {
    startTransition(async () => {
      await setDailyGoalAction(xp);
      setEditing(false);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border-2 border-swan p-4">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0">
          <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
            <circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              stroke="var(--color-swan)"
              strokeWidth="8"
            />
            <circle
              cx="40"
              cy="40"
              r={R}
              fill="none"
              stroke={met ? "var(--color-feather)" : "var(--color-fox)"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              style={{ transition: "stroke-dashoffset 0.5s" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {met ? "✅" : "🔥"}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-eel">Daily goal</h3>
            <button
              onClick={() => setEditing((e) => !e)}
              className="text-xs font-bold text-macaw"
            >
              {editing ? "Close" : "Edit"}
            </button>
          </div>
          <p className="text-sm text-wolf">
            {met ? (
              <>Goal complete — see you tomorrow! 🎉</>
            ) : (
              <>
                <span className="font-bold text-eel tabular-nums">
                  {todayXp}
                </span>{" "}
                / {goalXp} XP today
              </>
            )}
          </p>
        </div>
      </div>

      {editing && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DAILY_GOAL_OPTIONS.map((o) => (
            <button
              key={o.xp}
              disabled={pending}
              onClick={() => chooseGoal(o.xp)}
              className={`rounded-xl border-2 px-3 py-2 text-sm font-bold ${
                o.xp === goalXp
                  ? "border-feather bg-feather/10 text-feather"
                  : "border-swan text-eel hover:bg-polar"
              }`}
            >
              {o.label} · {o.xp} XP
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
