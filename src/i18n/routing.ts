import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pl", "en", "tr"],
  defaultLocale: "pl",
  localePrefix: "always",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
