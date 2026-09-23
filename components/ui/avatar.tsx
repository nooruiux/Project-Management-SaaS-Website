import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

export type AvatarProps = {
  src: string | StaticImageData;
  alt: string;
  /** Rendered diameter in px (Figma hero avatars: 48). */
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
      className={cn("shrink-0 rounded-full border border-white object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
