"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { cn } from "@/lib/utils";

export const ADMIN_PAGE_SIZE = 5;

export function usePagination<T>(items: readonly T[], pageSize = ADMIN_PAGE_SIZE) {
  const [requestedPage, setRequestedPage] = useState(1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
    setPage: (nextPage: number) => setRequestedPage(Math.min(Math.max(nextPage, 1), totalPages)),
  };
}

export function TablePagination({
  page,
  totalPages,
  from,
  to,
  total,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const t = useTranslations("portal");
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label={t("pagination")} className="flex min-w-[720px] flex-col gap-3 border-t border-border px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-semibold text-muted">{t("paginationSummary", { from, to, total })}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border px-3 text-xs font-bold text-navy transition hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="size-4" />{t("previous")}
        </button>
        {pages.map((number) => (
          <button
            key={number}
            type="button"
            aria-current={number === page ? "page" : undefined}
            aria-label={t("goToPage", { page: number })}
            onClick={() => onPageChange(number)}
            className={cn(
              "grid size-9 place-items-center rounded-md border text-xs font-bold transition",
              number === page ? "border-blue bg-blue text-white" : "border-border bg-white text-navy hover:border-blue hover:text-blue",
            )}
          >
            {number}
          </button>
        ))}
        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex min-h-9 items-center gap-1 rounded-md border border-border px-3 text-xs font-bold text-navy transition hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("next")}<ChevronRight className="size-4" />
        </button>
      </div>
    </nav>
  );
}
