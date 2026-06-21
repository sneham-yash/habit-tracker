import Image from "next/image";

import {
  APP_NAME,
  RIZEN_LOGO_SRC,
  RIZEN_LOGO_WHITE_SRC,
} from "@/constants/brand";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-7",
  md: "h-10",
  lg: "h-12",
} as const;

const sizeDimensions = {
  sm: { width: 100, height: 32 },
  md: { width: 120, height: 40 },
  lg: { width: 140, height: 48 },
} as const;

type RizenLogoProps = {
  size?: keyof typeof sizeClasses;
  priority?: boolean;
  className?: string;
};

export function RizenLogo({
  size = "sm",
  priority = false,
  className,
}: RizenLogoProps) {
  const { width, height } = sizeDimensions[size];
  const heightClass = sizeClasses[size];

  return (
    <>
      <Image
        src={RIZEN_LOGO_SRC}
        alt={APP_NAME}
        width={width}
        height={height}
        className={cn(
          heightClass,
          "w-auto object-contain dark:hidden",
          className,
        )}
        priority={priority}
      />
      <Image
        src={RIZEN_LOGO_WHITE_SRC}
        alt={APP_NAME}
        width={width}
        height={height}
        className={cn(
          "hidden",
          heightClass,
          "w-auto object-contain dark:block",
          className,
        )}
        priority={priority}
      />
    </>
  );
}
