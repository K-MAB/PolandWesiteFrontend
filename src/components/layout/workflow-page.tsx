import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/catalog/breadcrumbs";

export function WorkflowPage({ eyebrow, title, description, children, crumbs = [] }: { eyebrow: string; title: string; description: string; children: ReactNode; crumbs?: { label: string; href?: string }[] }) {
  return <main className="min-h-[70vh] pb-20">
    <section className="border-b border-border bg-white"><div className="container-shell py-10"><Breadcrumbs items={crumbs.length ? crumbs : [{ label: title }]} /><p className="eyebrow mt-7">{eyebrow}</p><h1 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.04em] text-navy sm:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">{description}</p></div></section>
    <div className="container-shell py-9">{children}</div>
  </main>;
}
