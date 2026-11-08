import { ChevronRight, Home } from "lucide-react";

import { Link } from "@/i18n/navigation";

export function Breadcrumbs({ items }: { items: readonly { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
      <Link href="/" className="hover:text-blue" aria-label="Home"><Home className="size-3.5" /></Link>
      {items.map((item) => (
        <span key={`${item.href}-${item.label}`} className="flex items-center gap-1.5">
          <ChevronRight className="size-3 text-slate-300" />
          {item.href ? <Link href={item.href} className="hover:text-blue">{item.label}</Link> : <span className="font-semibold text-slate-700">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
