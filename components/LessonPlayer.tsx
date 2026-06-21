"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  BuildExercise,
  ChoiceExercise,
  Exercise,
  MatchExercise,
} from "@/lib/curriculum";
import { completeLessonAction } from "@/lib/actions";
import type { CompleteLessonResult } from "@/lib/actions";

// ---- helpers --------------------------------------------------------------

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "mr-IN";
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function localToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function SpeakerButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      className="ml-2 text-xl text-macaw"
      title="Listen"
      aria-label="Listen"
    >
      🔊
    </button>
  );
}

// ---- main -----------------------------------------------------------------

type Phase = "play" | "results" | "failed";
type Checked = null | "correct" | "wrong";

export default function LessonPlayer({
  lessonId,
  title,
  exercises,
  startingHearts,
  maxHearts,
  nextLessonId,
}: {
  lessonId: string;
  title: string;
  exercises: Exercise[];
  startingHearts: number;
  maxHearts: number;
  nextLessonId: string | null;
}) {
  const router = useRouter();
  const total = exercises.length;

  const [i, setI] = useState(0);
  const [hearts, setHearts] = useState(startingHearts);
  const [mistakes, setMistakes] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [checked, setChecked] = useState<Checked>(null);
  const [phase, setPhase] = useState<Phase>("play");
  const [result, setResult] = useState<CompleteLessonResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // current-exercise interaction state
  const [choiceSel, setChoiceSel] = useState<number | null>(null);
  const [matchSolved, setMatchSolved] = useState(false);
  // build-exercise words, lifted here so check() can read them
  const [builtWords, setBuiltWords] = useState<string[]>([]);

  const ex = exercises[i];

  // No hearts to even start.
  if (startingHearts <= 0) {
    return <OutOfHearts />;
  }

  async function finish(completed: boolean, finalMistakes: number, finalCorrect: number) {
    setSubmitting(true);
    const res = await completeLessonAction({
      lessonId,
      correct: finalCorrect,
      total,
      mistakes: finalMistakes,
      completed,
      localDay: localToday(),
    });
    setResult(res);
    setPhase(completed ? "results" : "failed");
    setSubmitting(false);
  }

  function loseHeart(currentMistakes: number) {
    const nextHearts = hearts - 1;
    setHearts(nextHearts);
    const m = currentMistakes + 1;
    setMistakes(m);
    return { nextHearts, m };
  }

  // Evaluate the current choice/build answer.
  function check() {
    if (ex.type === "match") return; // match auto-validates
    let isCorrect = false;
    if (ex.type === "choice") {
      isCorrect = choiceSel === ex.answer;
    } else if (ex.type === "build") {
      isCorrect =
        builtWords.join(" ").toLowerCase().trim() ===
        ex.answerWords.join(" ").toLowerCase().trim();
    }

    if (isCorrect) {
      setCorrect((c) => c + 1);
      setChecked("correct");
    } else {
      const { nextHearts } = loseHeart(mistakes);
      setChecked("wrong");
      if (nextHearts <= 0) {
        // Out of hearts — end the lesson as failed after showing feedback.
        // We still show the red footer; Continue button will trigger finish.
      }
    }
  }

  function advance() {
    // Called from the footer "Continue".
    const wasWrong = checked === "wrong";
    const outOfHearts = wasWrong && hearts <= 0;

    if (outOfHearts) {
      finish(false, mistakes, correct);
      return;
    }

    if (i + 1 >= total) {
      finish(true, mistakes, correct);
      return;
    }

    // next exercise
    setI(i + 1);
    setChecked(null);
    setChoiceSel(null);
    setMatchSolved(false);
    setBuiltWords([]);
  }

  // Whether the primary action is enabled.
  const canCheck =
    ex.type === "choice"
      ? choiceSel !== null
      : ex.type === "build"
        ? builtWords.length > 0
        : false;

  // ---------------- render: results / failed ----------------
  if (phase === "results" && result) {
    return <Results result={result} title={title} nextLessonId={nextLessonId} />;
  }
  if (phase === "failed") {
    return <OutOfHearts failedMidLesson />;
  }

  // ---------------- render: playing ----------------
  const progress = (i / total) * 100;

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-white">
      {/* Header: close + progress + hearts */}
      <div className="flex items-center gap-3 px-4 py-4">
        <Link href="/learn" className="text-2xl text-hare" aria-label="Quit">
          ✕
        </Link>
        <div className="h-4 flex-1 rounded-full bg-swan">
          <div
            className="h-4 rounded-full bg-feather transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-extrabold text-cardinal">
          {hearts > 0 ? "❤️" : "💔"} {hearts}
        </span>
      </div>

      {/* Exercise body */}
      <div className="mx-auto w-full max-w-xl flex-1 overflow-y-auto px-5 py-4">
        {ex.type === "choice" && (
          <ChoiceView
            ex={ex}
            selected={choiceSel}
            disabled={checked !== null}
            onSelect={setChoiceSel}
          />
        )}
        {ex.type === "build" && (
          <BuildView
            key={ex.id}
            ex={ex}
            disabled={checked !== null}
            onChange={setBuiltWords}
          />
        )}
        {ex.type === "match" && (
          <MatchView
            key={ex.id}
            ex={ex}
            solved={matchSolved}
            onSolved={() => {
              setMatchSolved(true);
              setCorrect((c) => c + 1);
              setChecked("correct");
            }}
          />
        )}
      </div>

      {/* Footer */}
      <Footer
        checked={checked}
        ex={ex}
        canCheck={canCheck}
        submitting={submitting}
        onCheck={check}
        onContinue={advance}
        outOfHearts={hearts <= 0}
        lastQuestion={i + 1 >= total}
      />
    </div>
  );
}

// ---- footer ---------------------------------------------------------------

function Footer({
  checked,
  ex,
  canCheck,
  submitting,
  onCheck,
  onContinue,
  outOfHearts,
  lastQuestion,
}: {
  checked: Checked;
  ex: Exercise;
  canCheck: boolean;
  submitting: boolean;
  onCheck: () => void;
  onContinue: () => void;
  outOfHearts: boolean;
  lastQuestion: boolean;
}) {
  const correctAnswer =
    ex.type === "choice"
      ? ex.options[ex.answer]
      : ex.type === "build"
        ? ex.answerWords.join(" ")
        : "";

  const bg =
    checked === "correct"
      ? "bg-feather/10"
      : checked === "wrong"
        ? "bg-cardinal/10"
        : "bg-white";

  const continueLabel = outOfHearts
    ? "See results"
    : lastQuestion
      ? "Finish"
      : "Continue";

  return (
    <div className={`border-t-2 border-swan ${bg}`}>
      <div className="mx-auto flex max-w-xl flex-col gap-2 px-5 py-4">
        {checked === "correct" && (
          <p className="font-extrabold text-feather">Correct! 🎉</p>
        )}
        {checked === "wrong" && (
          <p className="font-extrabold text-cardinal">
            Answer: <span className="deva">{correctAnswer}</span>
          </p>
        )}

        {checked === null ? (
          <button
            disabled={!canCheck || ex.type === "match"}
            onClick={onCheck}
            className="btn-3d bg-feather py-3.5 text-white"
            style={{ boxShadow: "0 4px 0 var(--color-feather-dark)" }}
          >
            {ex.type === "match" ? "Match all pairs" : "Check"}
          </button>
        ) : (
          <button
            disabled={submitting}
            onClick={onContinue}
            className={`btn-3d py-3.5 text-white ${
              checked === "wrong" ? "bg-cardinal" : "bg-feather"
            }`}
            style={{
              boxShadow: `0 4px 0 ${
                checked === "wrong" ? "#d33" : "var(--color-feather-dark)"
              }`,
            }}
          >
            {submitting ? "…" : continueLabel}
          </button>
        )}
      </div>
    </div>
  );
}

// ---- choice ---------------------------------------------------------------

function ChoiceView({
  ex,
  selected,
  disabled,
  onSelect,
}: {
  ex: ChoiceExercise;
  selected: number | null;
  disabled: boolean;
  onSelect: (i: number) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-eel">{ex.prompt}</h2>
      {ex.headword && (
        <div className="mt-4 flex items-center rounded-2xl bg-polar px-5 py-4">
          <div>
            <div className="deva text-3xl text-eel">{ex.headword.marathi}</div>
            <div className="text-sm text-hare">{ex.headword.roman}</div>
          </div>
          <SpeakerButton text={ex.headword.marathi} />
        </div>
      )}
      <div className="mt-6 space-y-3">
        {ex.options.map((opt, idx) => {
          const active = selected === idx;
          const isDeva = /[ऀ-ॿ]/.test(opt);
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelect(idx)}
              className={`flex w-full items-center rounded-2xl border-2 px-4 py-4 text-left text-lg font-bold ${
                active
                  ? "border-macaw bg-macaw/10 text-macaw"
                  : "border-swan text-eel hover:bg-polar"
              }`}
            >
              <span className={isDeva ? "deva text-2xl" : ""}>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- build (word bank) ----------------------------------------------------

function BuildView({
  ex,
  disabled,
  onChange,
}: {
  ex: BuildExercise;
  disabled: boolean;
  onChange: (words: string[]) => void;
}) {
  const bank = useMemo(
    () => shuffle(ex.bank.map((w, idx) => ({ w, idx }))),
    [ex],
  );
  const [picked, setPicked] = useState<number[]>([]); // indices into `bank`

  const usedSet = new Set(picked);

  function update(next: number[]) {
    setPicked(next);
    onChange(next.map((bi) => bank[bi].w));
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-eel">{ex.prompt}</h2>
      <div className="mt-4 flex items-center rounded-2xl bg-polar px-5 py-4">
        <div>
          <div className="deva text-3xl text-eel">{ex.marathi}</div>
          <div className="text-sm text-hare">{ex.roman}</div>
        </div>
        <SpeakerButton text={ex.marathi} />
      </div>

      {/* answer area */}
      <div className="mt-6 flex min-h-14 flex-wrap gap-2 border-b-2 border-swan pb-3">
        {picked.map((bi, pos) => (
          <button
            key={`${bi}-${pos}`}
            disabled={disabled}
            onClick={() => update(picked.filter((_, p) => p !== pos))}
            className="rounded-xl border-2 border-swan bg-white px-3 py-2 font-bold text-eel"
          >
            {bank[bi].w}
          </button>
        ))}
      </div>

      {/* bank */}
      <div className="mt-6 flex flex-wrap gap-2">
        {bank.map((b, bi) =>
          usedSet.has(bi) ? (
            <span
              key={bi}
              className="rounded-xl border-2 border-swan px-3 py-2 font-bold text-transparent"
              style={{ background: "var(--color-polar)" }}
            >
              {b.w}
            </span>
          ) : (
            <button
              key={bi}
              disabled={disabled}
              onClick={() => update([...picked, bi])}
              className="rounded-xl border-2 border-swan bg-white px-3 py-2 font-bold text-eel shadow-[0_2px_0_var(--color-swan)] hover:bg-polar"
            >
              {b.w}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

// ---- match ----------------------------------------------------------------

function MatchView({
  ex,
  solved,
  onSolved,
}: {
  ex: MatchExercise;
  solved: boolean;
  onSolved: () => void;
}) {
  // Build two shuffled columns referencing the same pair index.
  const left = useMemo(
    () => shuffle(ex.pairs.map((_, idx) => idx)),
    [ex],
  );
  const right = useMemo(
    () => shuffle(ex.pairs.map((_, idx) => idx)),
    [ex],
  );

  const [pickL, setPickL] = useState<number | null>(null);
  const [pickR, setPickR] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState(false);

  function tryMatch(l: number | null, r: number | null) {
    if (l === null || r === null) return;
    if (l === r) {
      const next = new Set(done);
      next.add(l);
      setDone(next);
      setPickL(null);
      setPickR(null);
      if (next.size === ex.pairs.length && !solved) onSolved();
    } else {
      setWrongFlash(true);
      setTimeout(() => {
        setWrongFlash(false);
        setPickL(null);
        setPickR(null);
      }, 500);
    }
  }

  function tile(
    pairIdx: number,
    side: "L" | "R",
    label: string,
    isDeva: boolean,
  ) {
    const isDone = done.has(pairIdx);
    const picked = side === "L" ? pickL === pairIdx : pickR === pairIdx;
    return (
      <button
        key={`${side}-${pairIdx}`}
        disabled={isDone}
        onClick={() => {
          if (side === "L") {
            setPickL(pairIdx);
            tryMatch(pairIdx, pickR);
          } else {
            setPickR(pairIdx);
            tryMatch(pickL, pairIdx);
          }
        }}
        className={`w-full rounded-2xl border-2 px-3 py-4 font-bold ${
          isDone
            ? "border-feather bg-feather/10 text-feather opacity-60"
            : picked
              ? wrongFlash
                ? "border-cardinal bg-cardinal/10 text-cardinal"
                : "border-macaw bg-macaw/10 text-macaw"
              : "border-swan text-eel hover:bg-polar"
        } ${isDeva ? "deva text-2xl" : "text-lg"}`}
      >
        {label}
      </button>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-extrabold text-eel">{ex.prompt}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {left.map((pi) => tile(pi, "L", ex.pairs[pi].marathi, true))}
        </div>
        <div className="space-y-3">
          {right.map((pi) => tile(pi, "R", ex.pairs[pi].english, false))}
        </div>
      </div>
    </div>
  );
}

// ---- results & out-of-hearts ----------------------------------------------

function Results({
  result,
  title,
  nextLessonId,
}: {
  result: CompleteLessonResult;
  title: string;
  nextLessonId: string | null;
}) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="text-6xl">🎉</div>
      <h1 className="mt-4 text-3xl font-extrabold text-feather">
        Lesson complete!
      </h1>
      <p className="mt-1 text-wolf">{title}</p>

      <div className="mt-8 grid w-full max-w-sm grid-cols-2 gap-3">
        <Stat label="XP earned" value={`+${result.xpEarned}`} color="text-fox" />
        <Stat
          label="Day streak"
          value={`${result.streak} 🔥`}
          color="text-fox"
        />
      </div>

      {result.gemsEarned > 0 && (
        <p className="mt-4 font-bold text-macaw">💎 +{result.gemsEarned} gems</p>
      )}
      {result.leveledUp && (
        <p className="mt-2 font-extrabold text-beetle">
          ⭐ Level up! You're now level {result.newLevel}
        </p>
      )}

      <button
        onClick={() => {
          if (nextLessonId) {
            router.push(`/lesson/${nextLessonId}`);
          } else {
            router.push("/learn");
            router.refresh();
          }
        }}
        className="btn-3d mt-10 w-full max-w-sm bg-feather py-3.5 text-white"
        style={{ boxShadow: "0 4px 0 var(--color-feather-dark)" }}
      >
        {nextLessonId ? "Next lesson →" : "Back to lessons"}
      </button>

      {nextLessonId && (
        <button
          onClick={() => {
            router.push("/learn");
            router.refresh();
          }}
          className="mt-3 text-sm font-bold text-wolf underline"
        >
          Exit to lesson map
        </button>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border-2 border-swan p-4">
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs font-bold uppercase text-hare">{label}</div>
    </div>
  );
}

function OutOfHearts({ failedMidLesson }: { failedMidLesson?: boolean }) {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="text-6xl">💔</div>
      <h1 className="mt-4 text-2xl font-extrabold text-cardinal">
        You're out of hearts
      </h1>
      <p className="mt-2 max-w-xs text-wolf">
        {failedMidLesson
          ? "So close! Hearts refill over time, or you can refill them with gems."
          : "Hearts refill over time, or refill instantly with gems from the learn screen."}
      </p>
      <Link
        href="/learn"
        className="btn-3d mt-8 w-full max-w-sm bg-macaw py-3.5 text-white"
        style={{ boxShadow: "0 4px 0 var(--color-macaw-dark)" }}
      >
        Back to lessons
      </Link>
    </div>
  );
}
