import type { ClientConfig } from "@/lib/seo/types";
import { PORTFOLIOS } from "@/lib/portfolios";
import { siteUrl } from "@/lib/seo/helpers";

/**
 * ItemList for /portfolio catalog. Sources from `lib/portfolios.ts`
 * (single source of truth — D-01).
 */
export function itemListSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    inLanguage: "ko-KR",
    name: `${config.name} 포트폴리오`,
    numberOfItems: PORTFOLIOS.length,
    itemListElement: PORTFOLIOS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/portfolio/${p.slug}`,
      name: p.title,
      description: p.description,
    })),
  };
}
