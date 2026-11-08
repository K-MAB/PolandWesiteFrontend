import { SearchX } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center">
      <div>
        <SearchX className="mx-auto size-10 text-cyan" aria-hidden="true" />
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-cyan">404</p>
        <h1 className="mt-2 text-3xl font-bold text-navy">{t("notFoundTitle")}</h1>
        <p className="mt-3 text-sm text-muted">{t("notFoundText")}</p>
        <Button asChild className="mt-6"><Link href="/catalog">{t("returnCatalog")}</Link></Button>
      </div>
    </main>
  );
}
