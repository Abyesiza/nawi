import Image from "next/image";
import Link from "next/link";

interface NawiLogoProps {
  /** size = h-X tailwind value applied to image */
  size?: "sm" | "md" | "lg" | "xl";
  /** Show "Nawi Experiences" wordmark next to icon */
  showWordmark?: boolean;
  /** Variant: light = for dark backgrounds (white text), dark = for light backgrounds */
  variant?: "light" | "dark";
  /** Wrap in <Link href="/"> */
  asLink?: boolean;
  className?: string;
}

const sizes = {
  sm: { h: 32, w: 80 },
  md: { h: 44, w: 110 },
  lg: { h: 56, w: 140 },
  xl: { h: 80, w: 200 },
};

export function NawiLogo({
  size = "md",
  showWordmark = true,
  variant = "dark",
  asLink = true,
  className = "",
}: NawiLogoProps) {
  const dims = sizes[size];
  const wordmarkColor = variant === "light" ? "text-white" : "text-burgundy";
  const subColor = variant === "light" ? "text-white/60" : "text-burgundy/70";

  const inner = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Image
        src="/nawilogo.png"
        alt="Nawi Experiences"
        width={dims.w}
        height={dims.h}
        className="object-contain"
        style={{ height: dims.h, width: "auto" }}
        priority
      />
      {showWordmark && (
        <span className="leading-tight">
          <span className={`block font-bold tracking-tight text-base ${wordmarkColor}`}>
            Nawi
          </span>
          <span className={`block text-[9px] font-bold tracking-[0.28em] uppercase ${subColor}`}>
            Experiences
          </span>
        </span>
      )}
    </span>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-flex transition-opacity hover:opacity-80">
        {inner}
      </Link>
    );
  }
  return inner;
}
