import { ThemeModePicker } from "@/components/theme/theme-mode-picker";
import { AuthBackgroundArt } from "@/components/auth/auth-background-art";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-primary/[0.07] via-background to-background px-6 py-12 dark:from-primary/[0.04]">
      <AuthBackgroundArt />
      <ThemeModePicker className="fixed top-4 right-4 z-50" />

      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}
