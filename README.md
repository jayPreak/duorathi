# 🦉 Duorathi — Learn Marathi, Duolingo-style

A free, gamified Marathi (मराठी) learning app modeled on Duolingo: bite-sized
daily lessons, a daily streak, XP & levels, hearts, gems, and a daily goal —
all designed around the habit loop that makes people come back every day.

## What's inside

**Learning content** (`lib/curriculum.ts`) — 5 units / 10 lessons of beginner
Marathi in Devanagari with romanization:

1. **Greetings** — नमस्कार, धन्यवाद, yes/no, sorry
2. **Numbers** — एक to दहा (1–10)
3. **Family** — आई, बाबा, भाऊ, बहीण, मित्र…
4. **Everyday words** — पाणी, दूध, चहा, घर, शाळा…
5. **First phrases** — मी / तू, "my name is…", "how are you?"

Each lesson is ~5 exercises across three types: **multiple choice**,
**word-bank translation** (tap tiles to build a sentence), and **match the
pairs**. Devanagari words have a 🔊 button (browser speech synthesis, `mr-IN`).

**Gamification** (`lib/game.ts`) — the Duolingo habit mechanics:

| Mechanic | Behavior |
|---|---|
| 🔥 Streak | +1 per day you complete a lesson; resets if you miss a day |
| 🧊 Streak freeze | Banked freeze auto-protects one missed day (buy for 💎200) |
| ⚡ XP & levels | +10 XP per first completion (+5 perfect bonus); levels on an increasing curve |
| ❤️ Hearts | Lose one per wrong answer; out of hearts ends the lesson |
| ⏳ Heart regen | +1 heart every 30 min, with a live countdown in the header |
| 💎 Gems | Earned per lesson; spend to refill hearts (350) or buy freezes (200) |
| 🎯 Daily goal | Pick a target (20/50/100/200 XP); progress ring on the home screen |

All progress is stored **server-side per account** (real signup/login), so it
syncs across sessions and devices.

## Tech stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** — mobile-first; installable to the home screen (web manifest, `display: standalone`)
- **Auth.js (next-auth v5)** — Google sign-in + email/password, JWT sessions, Prisma adapter so every account (incl. Google) is persisted and progress is tracked per user
- **Prisma 7** with the `better-sqlite3` driver adapter

> It's a **web app** — open it in your phone's browser. On iOS, Share → "Add to
> Home Screen"; on Android, Chrome will offer "Install". It then launches
> full-screen like a native app, no app store needed.

## Run locally

```bash
pnpm install
pnpm prisma migrate dev   # creates the SQLite db at prisma/dev.db
pnpm dev                  # http://localhost:3000
```

Environment (`.env`):

```env
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="<run: openssl rand -base64 33>"

# Optional — enables the "Continue with Google" button when both are set:
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""
```

### Enabling Google sign-in

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials) → **Create Credentials → OAuth client ID → Web application**.
2. Add **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://YOUR_DOMAIN/api/auth/callback/google` (prod)
3. Put the client ID/secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` (and into the Vercel project's env vars for production), then restart.

Until those are set, the Google button is hidden and email/password still works.

## Deploying with cloud sync (Postgres)

Local dev uses SQLite. Vercel's filesystem is read-only/ephemeral, so for a
deployed app point Prisma at a managed Postgres (e.g. Neon via the Vercel
Marketplace):

1. In `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
2. Swap the Prisma driver adapter in `lib/prisma.ts` to `@prisma/adapter-pg`
   (`pnpm add @prisma/adapter-pg`) — the data models are already Postgres-safe.
3. Set `DATABASE_URL` to your Postgres connection string and `AUTH_SECRET` in
   the Vercel project's environment variables.
4. Run `pnpm prisma migrate deploy` against the new database.

## Project map

```
app/
  page.tsx                  landing (redirects to /learn if signed in)
  login/ signup/            auth pages
  learn/                    the lesson path + stats (auth-guarded layout)
  lesson/[lessonId]/        the lesson player
  api/auth/[...nextauth]/   Auth.js route handlers
lib/
  curriculum.ts             the Marathi course data
  game.ts                   hearts / XP / streak / level rules (pure functions)
  actions.ts                server actions (signup, login, complete lesson, economy)
  user-state.ts             loads a user's full game state
  prisma.ts  validation.ts  db client + zod schemas
components/                 StatsBar, LessonPlayer, DailyGoalRing, Boosters, AuthForm
prisma/schema.prisma        data model
```
