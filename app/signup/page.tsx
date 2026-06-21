import { redirect } from "next/navigation";
import { auth, googleEnabled } from "@/auth";
import AuthForm from "@/components/AuthForm";
import { signupAction } from "@/lib/actions";

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) redirect("/learn");
  return <AuthForm mode="signup" action={signupAction} googleEnabled={googleEnabled} />;
}
