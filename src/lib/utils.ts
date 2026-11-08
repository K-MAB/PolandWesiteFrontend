import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { LocalizedContent } from "@/core/domain/models";
import type { AppLocale } from "@/i18n/routing";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function localizedText(content: LocalizedContent, locale: AppLocale): string {
  return content[locale] ?? content.en;
}
