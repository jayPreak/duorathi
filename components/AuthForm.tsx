"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { AuthFormState } from "@/lib/actions";
import { googleLoginAction } from "@/lib/actions";

type Action = (
  state: AuthFormState,
  formData: FormData,
) => Promise<AuthFormState>;

export default function AuthForm({
  mode,
  action,
  googleEnabled,
}: {
  mode: "login" | "signup";
  action: Action;
  googleEnabled: boolean;
}) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    action,
    {},
  );

  const isSignup = mode === "signup";

  return (
    <div className="mx-auto w-full max-w-sm px-6 py-12">
      <div className="text-center">
        <div className="text-5xl">🦉</div>
        <h1 className="mt-3 text-2xl font-extrabold text-eel">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1 text-sm text-wolf">
          {isSignup
            ? "Start your Marathi streak today."
            : "Pick up your streak where you left off."}
        </p>
      </div>

      {googleEnabled && (
        <>
          <form action={googleLoginAction} className="mt-8">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-swan bg-white py-3.5 font-extrabold text-eel active:translate-y-px"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs font-bold text-hare">
            <span className="h-px flex-1 bg-swan" />
            OR
            <span className="h-px flex-1 bg-swan" />
          </div>
        </>
      )}

      <form action={formAction} className={googleEnabled ? "space-y-3" : "mt-8 space-y-3"}>
        {isSignup && (
          <Field
            label="Name"
            name="name"
            type="text"
            placeholder="What should we call you?"
            autoComplete="name"
          />
        )}
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder={isSignup ? "At least 8 characters" : "Your password"}
          autoComplete={isSignup ? "new-password" : "current-password"}
        />

        {state?.error && (
          <p className="rounded-xl bg-cardinal/10 px-3 py-2 text-sm font-semibold text-cardinal">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="btn-3d w-full bg-feather text-white py-3.5 mt-2"
          style={{ boxShadow: "0 4px 0 var(--color-feather-dark)" }}
        >
          {pending ? "…" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-wolf">
        {isSignup ? (
          <>
            Already learning?{" "}
            <Link href="/login" className="font-bold text-macaw">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="font-bold text-macaw">
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 4.3 29.3 2.5 24 2.5 12.2 2.5 2.5 12.2 2.5 24S12.2 45.5 24 45.5 45.5 35.8 45.5 24c0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M5 14.7l6.6 4.8C13.4 15.1 18.3 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 4.3 29.3 2.5 24 2.5 16 2.5 9 7 5 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 45.5c5.2 0 9.9-1.8 13.6-4.9l-6.3-5.2c-2 1.5-4.6 2.6-7.3 2.6-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9 41 16 45.5 24 45.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.5l6.3 5.2c-.4.4 6.9-5 6.9-14.7 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        {...props}
        required
        className="w-full rounded-2xl border-2 border-swan bg-polar px-4 py-3 text-eel placeholder:text-hare focus:border-macaw focus:bg-white focus:outline-none"
      />
    </label>
  );
}
