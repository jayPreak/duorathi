"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserState } from "@/lib/user-state";
import { logoutAction } from "@/lib/actions";

function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function StatsBar({ state }: { state: UserState }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(state.nextHeartInMs);
  const [menuOpen, setMenuOpen] = useState(false);

  // Live countdown to the next heart; refresh server state when it lands.
  useEffect(() => {
    setRemaining(state.nextHeartInMs);
    if (state.hearts >= state.maxHearts) return;

    const tick = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1000;
        if (next <= 0) {
          router.refresh();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [state.nextHeartInMs, state.hearts, state.maxHearts, router]);

  const heartsFull = state.hearts >= state.maxHearts;

  return (
    <header className="sticky top-0 z-20 border-b-2 border-swan bg-white">
      <div className="mx-auto flex max-w-3xl items-center gap-1.5 px-3 py-3 sm:gap-2 sm:px-4">
        <span className="mr-auto text-xl font-extrabold text-feather">
          🦉<span className="hidden sm:inline"> Duorathi</span>
        </span>

        <Pill title="Day streak">
          <span>🔥</span>
          <span className="text-fox">{state.streak}</span>
        </Pill>

        <Pill title="Gems">
          <span>💎</span>
          <span className="text-macaw">{state.gems}</span>
        </Pill>

        <Pill title={heartsFull ? "Hearts full" : "Next heart"}>
          <span>{state.hearts > 0 ? "❤️" : "💔"}</span>
          <span className="text-cardinal">
            {heartsFull ? state.hearts : `${state.hearts} · ${formatCountdown(remaining)}`}
          </span>
        </Pill>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-feather font-extrabold text-white"
            title="Menu"
          >
            {(state.name ?? state.email)[0]?.toUpperCase()}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl border-2 border-swan bg-white p-3 shadow-lg">
              <p className="px-1 text-sm font-bold text-eel">
                {state.name ?? "Learner"}
              </p>
              <p className="px-1 text-xs text-hare">Level {state.level}</p>
              <hr className="my-2 border-swan" />
              <form action={logoutAction}>
                <button className="w-full rounded-xl px-1 py-2 text-left text-sm font-bold text-cardinal hover:bg-polar">
                  Log out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function Pill({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title={title}
      className="flex items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-1 text-sm font-extrabold tabular-nums sm:px-2.5"
    >
      {children}
    </span>
  );
}
