import { redirect } from "next/navigation";
import { auth, googleEnabled } from "@/auth";
import AuthForm from "@/components/AuthForm";
import { loginAction } from "@/lib/actions";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/learn");
  return <AuthForm mode="login" action={loginAction} googleEnabled={googleEnabled} />;
}
