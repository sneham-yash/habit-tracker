import { ThemeModePicker } from "@/components/theme/theme-mode-picker";
import { AuthBackgroundArt } from "@/components/auth/auth-background-art";
import { CreatorCredit } from "@/components/brand/creator-credit";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col bg-gradient-to-b from-primary/[0.07] via-background to-background dark:from-primary/[0.04]">
      <AuthBackgroundArt />
      <ThemeModePicker className="fixed top-4 right-4 z-50" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>

      <CreatorCredit variant="auth" className="relative z-10 pb-6" />
    </div>
  );
}
