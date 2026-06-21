import { cn } from "@/lib/utils";

export function LandingSection({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative mx-auto max-w-6xl px-6", className)}>
      {children}
    </section>
  );
}
