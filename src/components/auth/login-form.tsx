"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginWithEmail, type AuthActionState } from "@/app/(auth)/actions";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {};

export function LoginForm({ errorMessage }: { errorMessage?: string }) {
  const [state, formAction, pending] = useActionState(
    loginWithEmail,
    initialState,
  );

  const error = state.error ?? errorMessage;

  return (
    <AuthShell
      variant="login"
      footer={
        <p className={typography.bodyMuted}>
          New to RIZEN?{" "}
          <Link
            href="/signup"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Take your first step
          </Link>
        </p>
      }
    >
      <GoogleSignInButton />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="border-border/60 w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className={cn(typography.bodyMuted, "bg-background px-3 text-xs")}>
            or sign in with email
          </span>
        </div>
      </div>

      <form action={formAction} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className={typography.formLabel}>
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className={typography.formLabel}>
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="h-11"
            required
          />
        </div>

        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="h-11 w-full font-medium transition-transform active:scale-[0.98]"
          disabled={pending}
        >
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
