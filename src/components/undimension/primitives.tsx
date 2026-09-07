import { cn } from "@/lib/utils";

export function StarGraphic({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z" />
    </svg>
  );
}

export function Marquee({
  text,
  className,
  repeat = 8,
}: {
  text: string;
  className?: string;
  repeat?: number;
}) {
  return (
    <div className={cn("animate-marquee font-bebas tracking-widest uppercase", className)}>
      {Array.from({ length: repeat }).map((_, i) => (
        <span key={i} className="px-4 whitespace-nowrap">
          {text}
        </span>
      ))}
    </div>
  );
}
