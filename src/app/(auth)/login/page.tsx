import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  const errorMessage =
    params.error === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : undefined;

  return <LoginForm errorMessage={errorMessage} />;
}
