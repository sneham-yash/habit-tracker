import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/profile/initials";

type UserAvatarProps = {
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-9 text-xs",
  md: "size-10 text-sm",
  lg: "size-20 text-xl",
};

export function UserAvatar({
  displayName,
  email,
  avatarUrl,
  size = "md",
  className,
}: UserAvatarProps) {
  const initials = getInitials(displayName, email);

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className={cn(
          "shrink-0 rounded-full object-cover ring-2 ring-border",
          sizeClasses[size],
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-primary/15 text-primary flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-border",
        sizeClasses[size],
        className,
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}
