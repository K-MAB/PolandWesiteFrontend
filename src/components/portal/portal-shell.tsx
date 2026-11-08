"use client";

import {
  ArrowLeft,
  ChevronRight,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/brand/logo";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export interface PortalNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function PortalShell({
  children,
  items,
  title,
  subtitle,
  user,
  mode,
  storefrontLabel,
  demoLabel,
}: {
  children: ReactNode;
  items: readonly PortalNavItem[];
  title: string;
  subtitle: string;
  user: string;
  mode: "admin" | "account";
  storefrontLabel: string;
  demoLabel: string;
}) {
  const pathname = usePathname();
  const t = useTranslations("portal");
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f6fa] text-foreground">
      <aside className={cn("fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-navy text-white transition-transform lg:translate-x-0", open ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link href="/" className="rounded bg-white px-3 py-2"><Logo tagline={t("storeLabel")} /></Link>
          <button type="button" className="grid size-10 place-items-center rounded-md hover:bg-white/10 lg:hidden" onClick={() => setOpen(false)} aria-label={t("closeMenu")}><X className="size-5" /></button>
        </div>
        <div className="border-b border-white/10 px-5 py-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-cyan/15 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-cyan">
            {mode === "admin" ? <ShieldCheck className="size-3.5" /> : <UserRound className="size-3.5" />}{mode === "admin" ? title : demoLabel}
          </span>
          <p className="mt-3 text-sm font-bold text-white">{user}</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">{subtitle}</p>
        </div>
        <nav className="no-scrollbar h-[calc(100vh-17.5rem)] space-y-1 overflow-y-auto p-3" aria-label={title}>
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== `/${mode}` && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cn("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/8 hover:text-white", active && "bg-blue text-white shadow-sm")}><Icon className="size-4.5 shrink-0" /><span>{item.label}</span>{active && <ChevronRight className="ml-auto size-4" />}</Link>;
          })}
        </nav>
        <div className="absolute inset-x-0 bottom-0 border-t border-white/10 p-3">
          <Link href="/" className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-white/8 hover:text-white"><ArrowLeft className="size-4" />{storefrontLabel}</Link>
          <Link href="/login" className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-slate-300 hover:bg-white/8 hover:text-white"><LogOut className="size-4" />{t("logout")}</Link>
        </div>
      </aside>
      {open && <button type="button" aria-label={t("closeMenu")} className="fixed inset-0 z-40 bg-navy/50 lg:hidden" onClick={() => setOpen(false)} />}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex min-h-20 items-center gap-4 border-b border-border bg-white/95 px-4 backdrop-blur sm:px-7">
          <button type="button" className="grid size-10 place-items-center rounded-md border border-border lg:hidden" onClick={() => setOpen(true)} aria-label={t("openMenu")}><Menu className="size-5" /></button>
          <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan">{mode === "admin" ? demoLabel : title}</p><h1 className="text-lg font-black text-navy sm:text-xl">{title}</h1></div>
          <div className="ml-auto hidden text-right sm:block"><p className="text-sm font-bold text-navy">{user}</p><p className="text-xs text-muted">{subtitle}</p></div>
        </header>
        <main className="p-4 sm:p-7">{children}</main>
      </div>
    </div>
  );
}
