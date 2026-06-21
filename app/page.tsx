import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { COURSE, TOTAL_LESSONS } from "@/lib/curriculum";

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/learn");

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-10 text-center">
        <div className="text-6xl">🦉</div>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-eel">
          Learn <span className="deva text-feather">मराठी</span> the fun way
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-wolf">
          Free, bite-sized Marathi lessons that take two minutes a day. Build a
          streak, earn XP, keep your hearts — and actually keep coming back.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href="/signup"
            className="btn-3d bg-feather text-white px-10 py-4 text-lg"
            style={{ boxShadow: "0 4px 0 var(--color-feather-dark)" }}
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="btn-3d bg-white text-macaw px-10 py-3.5 text-base"
            style={{
              boxShadow: "0 4px 0 var(--color-swan)",
              border: "2px solid var(--color-swan)",
            }}
          >
            I already have an account
          </Link>
        </div>
      </section>

      {/* Why it works */}
      <section className="mx-auto max-w-5xl px-6 py-10 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: "🔥",
            title: "Daily streaks",
            body: "A streak you don't want to break is the strongest reason to come back tomorrow.",
          },
          {
            icon: "⚡",
            title: "Earn XP & level up",
            body: "Every correct answer rewards you instantly, so progress always feels good.",
          },
          {
            icon: "❤️",
            title: "Hearts keep you sharp",
            body: "A few mistakes cost a heart — so each finished lesson feels earned.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border-2 border-swan p-6 text-center"
          >
            <div className="text-4xl">{f.icon}</div>
            <h3 className="mt-3 font-extrabold text-eel">{f.title}</h3>
            <p className="mt-2 text-sm text-wolf">{f.body}</p>
          </div>
        ))}
      </section>

      {/* What you'll learn */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-center text-2xl font-extrabold text-eel">
          {TOTAL_LESSONS} lessons across {COURSE.length} units
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {COURSE.map((u) => (
            <span
              key={u.id}
              className="rounded-full px-4 py-2 text-sm font-bold text-white"
              style={{ background: u.color }}
            >
              {u.title}
            </span>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-hare">
        Made with 🦉 for Marathi learners · Duorathi
      </footer>
    </main>
  );
}
