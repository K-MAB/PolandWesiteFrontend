"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatMoney } from "@/core/services/commerce";
import { useSessionStore } from "@/features/auth/session-store";
import { useCartStore } from "@/features/cart/cart-store";
import { Link, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const inputClass = "min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-navy placeholder:text-slate-400 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10";

export function LoginForm() {
  const t = useTranslations("portal");
  const router = useRouter();
  const signIn = useSessionStore((state) => state.signIn);
  const [email, setEmail] = useState("anna@example.com");
  const [password, setPassword] = useState("demo2026");
  const enter = (mode: "admin" | "customer", address: string) => { signIn(mode, address); router.push(mode === "admin" ? "/admin" : "/account"); };

  return <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
    <form className="rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8" onSubmit={(event) => { event.preventDefault(); enter(email.toLowerCase().includes("admin") ? "admin" : "customer", email); }}>
      <label className="text-xs font-bold text-navy">{t("email")}<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`${inputClass} mt-2`} /></label>
      <label className="mt-5 block text-xs font-bold text-navy">{t("password")}<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className={`${inputClass} mt-2`} /></label>
      <Button type="submit" size="lg" className="mt-7 w-full">{t("signIn")}</Button>
      <p className="mt-5 text-center text-sm text-muted"><Link href="/register" className="font-bold text-blue hover:underline">{t("createAccount")}</Link></p>
    </form>
    <aside className="space-y-3 rounded-2xl bg-navy p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.12em] text-cyan">{t("demoEnvironment")}</p><button type="button" onClick={() => enter("customer", "anna@example.com")} className="w-full rounded-xl border border-white/15 bg-white/5 p-4 text-left transition hover:bg-white/10"><strong className="block text-sm">{t("customerDemo")}</strong><span className="mt-2 block text-xs text-slate-400">anna@example.com</span></button><button type="button" onClick={() => enter("admin", "admin@vistula.example")} className="w-full rounded-xl border border-white/15 bg-white/5 p-4 text-left transition hover:bg-white/10"><strong className="block text-sm">{t("adminDemo")}</strong><span className="mt-2 block text-xs text-slate-400">admin@vistula.example</span></button></aside>
  </div>;
}

export function CheckoutForm({ locale }: { locale: AppLocale }) {
  const t = useTranslations("portal");
  const lines = useCartStore((state) => state.lines);
  const clear = useCartStore((state) => state.clear);
  const [confirmed, setConfirmed] = useState<string | null>(null);
  const total = lines.reduce((sum, line) => sum + line.quantity * line.unitPrice.amount, 0);
  if (confirmed) return <SuccessPanel title={t("orderConfirmed")} reference={confirmed} href="/account/orders" />;
  return <form className="grid gap-6 lg:grid-cols-[1fr_22rem]" onSubmit={(event) => { event.preventDefault(); if (!lines.length) return; clear(); setConfirmed(`VC-2026-${String(Date.now()).slice(-6)}`); }}>
    <section className="space-y-6 rounded-2xl border border-border bg-white p-5 shadow-card sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2"><Field label={t("fullName")} required /><Field label={t("email")} type="email" required /></div>
      <Field label={t("address")} required /><div className="grid gap-4 sm:grid-cols-2"><Field label={t("postalCode")} required /><Field label={t("city")} required /></div>
      <div><h2 className="text-lg font-black text-navy">{t("delivery")}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Choice name="delivery" value="standard" label={t("standardDelivery")} defaultChecked /><Choice name="delivery" value="express" label={t("expressDelivery")} /></div></div>
      <div><h2 className="text-lg font-black text-navy">{t("payment")}</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><Choice name="payment" value="transfer" label={t("bankTransfer")} defaultChecked /><Choice name="payment" value="hosted" label={t("hostedPayment")} /></div><p className="mt-3 flex items-center gap-2 text-xs text-muted"><ShieldCheck className="size-4 text-success" />{t("paymentSafety")}</p></div>
    </section>
    <aside className="h-fit rounded-2xl border border-border bg-white p-5 shadow-card"><h2 className="font-black text-navy">{t("orderSummary")}</h2><div className="mt-4 space-y-3">{lines.map((line) => <div key={line.productId} className="flex justify-between gap-4 text-xs"><span className="text-muted">{line.sku} × {line.quantity}</span><strong className="text-navy">{formatMoney({ amount: line.unitPrice.amount * line.quantity, currency: line.unitPrice.currency }, locale)}</strong></div>)}</div><div className="mt-5 flex justify-between border-t border-border pt-4"><strong>{t("orderTotal")}</strong><strong className="text-lg text-navy">{formatMoney({ amount: total, currency: "PLN" }, locale)}</strong></div><Button type="submit" size="lg" className="mt-5 w-full" disabled={!lines.length}>{t("placeOrder")}</Button>{!lines.length && <Link href="/catalog" className="mt-4 block text-center text-sm font-bold text-blue hover:underline">{t("continueShopping")}</Link>}</aside>
  </form>;
}

export function CustomerRegistrationForm() {
  const t = useTranslations("portal");
  const [sent, setSent] = useState(false);
  if (sent) return <SuccessPanel title={t("registrationComplete")} reference="" href="/login" />;
  return <form className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-6 shadow-card sm:p-8" onSubmit={(event) => { event.preventDefault(); setSent(true); }}><div className="grid gap-5 sm:grid-cols-2"><Field label={t("fullName")} required /><Field label={t("email")} type="email" required /><Field label={t("password")} type="password" minLength={6} required /><Field label={t("passwordRepeat")} type="password" minLength={6} required /></div><Button type="submit" size="lg" className="mt-7 w-full sm:w-auto">{t("createAccount")}</Button></form>;
}

function Field({ label, type = "text", ...props }: { label: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) { return <label className="block text-xs font-bold text-navy">{label}<input type={type} className={`${inputClass} mt-2`} {...props} /></label>; }
function Choice({ name, value, label, defaultChecked }: { name: string; value: string; label: string; defaultChecked?: boolean }) { return <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 text-sm font-bold text-navy has-checked:border-blue has-checked:bg-blue/5"><input type="radio" name={name} value={value} defaultChecked={defaultChecked} className="size-4 accent-blue" />{label}</label>; }
function SuccessPanel({ title, reference, href }: { title: string; reference: string; href: string }) { const t = useTranslations("portal"); return <div className="mx-auto max-w-xl rounded-2xl border border-success/20 bg-white p-8 text-center shadow-card"><span className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 className="size-8" /></span><h2 className="mt-5 text-2xl font-black text-navy">{title}</h2>{reference && <p className="mt-2 font-mono text-sm text-muted">{reference}</p>}<Button asChild className="mt-6"><Link href={href}>{t("continue")}</Link></Button></div>; }
