"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  HEART_REFILL_GEM_COST,
  MAX_STREAK_FREEZES,
  STREAK_FREEZE_GEM_COST,
} from "@/lib/game";
import { buyStreakFreezeAction, refillHeartsAction } from "@/lib/actions";

const REASONS: Record<string, string> = {
  "not-enough-gems": "Not enough gems",
  "already-full": "Hearts already full",
  "max-freezes": "You're stocked up",
};

export default function Boosters({
  hearts,
  maxHearts,
  gems,
  streakFreezes,
}: {
  hearts: number;
  maxHearts: number;
  gems: number;
  streakFreezes: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);

  const heartsFull = hearts >= maxHearts;
  const freezesFull = streakFreezes >= MAX_STREAK_FREEZES;

  function run(action: () => Promise<{ ok: boolean; reason?: string }>) {
    startTransition(async () => {
      const res = await action();
      if (!res.ok && res.reason) setMsg(REASONS[res.reason] ?? "Couldn't do that");
      else setMsg(null);
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border-2 border-swan p-4">
      <h3 className="font-extrabold text-eel">Boosters</h3>

      <div className="mt-3 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">❤️</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-eel">Refill hearts</p>
            <p className="text-xs text-wolf">
              {heartsFull ? "Full hearts" : `${hearts}/${maxHearts} hearts`}
            </p>
          </div>
          <button
            disabled={pending || heartsFull || gems < HEART_REFILL_GEM_COST}
            onClick={() => run(refillHeartsAction)}
            className="btn-3d bg-cardinal px-4 py-2 text-xs text-white"
            style={{ boxShadow: "0 3px 0 #d33" }}
          >
            💎 {HEART_REFILL_GEM_COST}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-2xl">🧊</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-eel">Streak freeze</p>
            <p className="text-xs text-wolf">
              {streakFreezes} owned · protects a missed day
            </p>
          </div>
          <button
            disabled={pending || freezesFull || gems < STREAK_FREEZE_GEM_COST}
            onClick={() => run(buyStreakFreezeAction)}
            className="btn-3d bg-macaw px-4 py-2 text-xs text-white"
            style={{ boxShadow: "0 3px 0 var(--color-macaw-dark)" }}
          >
            💎 {STREAK_FREEZE_GEM_COST}
          </button>
        </div>
      </div>

      {msg && <p className="mt-3 text-xs font-bold text-cardinal">{msg}</p>}
    </div>
  );
}
