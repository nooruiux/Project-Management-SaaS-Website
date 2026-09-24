import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

export type AvatarProps = {
  src: string | StaticImageData;
  alt: string;
  /** Intrinsic size in px (Figma hero avatars: 48). Override the rendered size via className, e.g. `size-[0.75em]`. */
  size?: number;
  className?: string;
};

export function Avatar({ src, alt, size = 48, className }: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      sizes={`${size}px`}
      className={cn("shrink-0 rounded-full border border-white object-cover", className)}
    />
  );
}
