import { CircuitBoard } from "lucide-react";

export function Logo({ tagline, compactOnMobile = false }: { tagline: string; compactOnMobile?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="grid size-10 place-items-center rounded-md bg-navy text-white shadow-sm">
        <CircuitBoard className="size-6" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <span className={`${compactOnMobile ? "hidden sm:block" : ""} leading-none`}>
        <span className="block text-[1.0625rem] font-extrabold tracking-[-0.03em] text-navy">VISTULA</span>
        <span className="mt-1 block text-[0.5625rem] font-bold tracking-[0.18em] text-cyan">{tagline.toUpperCase()}</span>
      </span>
    </span>
  );
}
