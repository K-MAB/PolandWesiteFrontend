import type { MetadataRoute } from "next";

import { catalogCategories } from "@/config/catalog";
import { routing } from "@/i18n/routing";
import { mockProducts } from "@/infrastructure/mock/fixtures";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const paths = [
    "",
    "/catalog",
    "/cart",
    "/compare",
    ...catalogCategories.map((category) => `/catalog/${category.id}`),
    ...mockProducts.map((product) => `/products/${product.id}`),
  ];

  return paths.flatMap((path) => routing.locales.map((locale) => ({
    url: `${baseUrl}/${locale}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/products/") ? "weekly" as const : "daily" as const,
    priority: path === "" ? 1 : path === "/catalog" ? 0.9 : 0.7,
    alternates: { languages: Object.fromEntries(routing.locales.map((item) => [item, `${baseUrl}/${item}${path}`])) },
  })));
}
