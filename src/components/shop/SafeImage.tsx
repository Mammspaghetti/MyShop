import { useState } from "react";
import { PLACEHOLDER_IMAGE } from "@/lib/shop-api";
import { cn } from "@/lib/utils";

export function SafeImage({
  src,
  alt,
  className,
}: {
  src: string | undefined;
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(src || PLACEHOLDER_IMAGE);
  return (
    <img
      src={current}
      alt={alt}
      loading="lazy"
      onError={() => setCurrent(PLACEHOLDER_IMAGE)}
      className={cn("h-full w-full object-cover", className)}
    />
  );
}
