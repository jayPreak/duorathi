import { redirect } from "next/navigation";
import { getCurrentUserState } from "@/lib/user-state";
import { getLessonRef } from "@/lib/curriculum";
import LessonPlayer from "@/components/LessonPlayer";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const state = await getCurrentUserState();
  if (!state) redirect("/login");

  const ref = getLessonRef(lessonId);
  if (!ref) redirect("/learn");

  return (
    <LessonPlayer
      lessonId={ref.lesson.id}
      title={ref.lesson.title}
      exercises={ref.lesson.exercises}
      startingHearts={state.hearts}
      maxHearts={state.maxHearts}
    />
  );
}
