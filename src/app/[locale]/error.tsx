"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("common");
  return (
    <main className="grid min-h-[70vh] place-items-center bg-background px-6 text-center">
      <div>
        <AlertTriangle className="mx-auto size-10 text-warning" aria-hidden="true" />
        <h1 className="mt-4 text-2xl font-bold text-navy">{t("pageLoadError")}</h1>
        <p className="mt-2 text-sm text-muted">{t("retrySupport")}</p>
        <Button className="mt-6" onClick={reset}>{t("tryAgain")}</Button>
      </div>
    </main>
  );
}
