import { redirect } from "next/navigation";
import { getCurrentUserState } from "@/lib/user-state";
import StatsBar from "@/components/StatsBar";

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = await getCurrentUserState();
  if (!state) redirect("/login");

  return (
    <div className="flex-1 bg-white">
      <StatsBar state={state} />
      <main className="mx-auto max-w-3xl px-4 pb-24 pt-6">{children}</main>
    </div>
  );
}
