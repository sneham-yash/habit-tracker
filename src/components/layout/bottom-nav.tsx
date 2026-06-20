"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3Icon,
  FolderOpenIcon,
  HomeIcon,
  PlusCircleIcon,
  UserIcon,
} from "lucide-react";

import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: HomeIcon },
  { href: "/categories", label: "Categories", icon: FolderOpenIcon },
  { href: "/create", label: "Create", icon: PlusCircleIcon },
  { href: "/insights", label: "Insights", icon: BarChart3Icon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="border-border bg-background/95 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                typography.navLabel,
                "flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
