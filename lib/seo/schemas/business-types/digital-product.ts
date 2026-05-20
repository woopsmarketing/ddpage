import type { ClientConfig, DigitalProductMeta } from "@/lib/seo/types";
import { siteUrl } from "@/lib/seo/helpers";

/**
 * Digital product / SaaS / online service main entity.
 *
 * `productType` controls the top-level @type:
 *   - "Service"             → Service + OfferCatalog (multi-tier pricing)
 *   - "SoftwareApplication" → SoftwareApplication + Offer(s)
 *   - "Product"             → Product + Offer(s)
 *
 * Each `offer` in `businessTypeMeta.offers` becomes an `Offer` node. When
 * `frequency` is `monthly` / `yearly` we attach a UnitPriceSpecification with
 * billingDuration (ISO 8601 duration: P1M, P1Y).
 */
export function digitalProductSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);
  const meta = config.businessTypeMeta as DigitalProductMeta;

  const offers = meta.offers.map(offerSchema);

  switch (meta.productType) {
    case "Service":
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${base}#business`,
        name: config.name,
        url: base,
        description: config.description,
        inLanguage: "ko-KR",
        provider: { "@id": `${base}#organization` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `${config.name} 요금제`,
          itemListElement: offers,
        },
      };

    case "SoftwareApplication":
      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": `${base}#business`,
        name: config.name,
        url: base,
        description: config.description,
        inLanguage: "ko-KR",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        ...(offers.length > 0 && {
          offers: offers.length === 1 ? offers[0] : offers,
        }),
      };

    case "Product":
    default:
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": `${base}#business`,
        name: config.name,
        url: base,
        description: config.description,
        inLanguage: "ko-KR",
        brand: { "@id": `${base}#organization` },
        ...(offers.length > 0 && {
          offers: offers.length === 1 ? offers[0] : offers,
        }),
      };
  }
}

function offerSchema(o: DigitalProductMeta["offers"][number]) {
  const base = {
    "@type": "Offer",
    name: o.name,
    description: o.description,
    price: o.price,
    priceCurrency: o.priceCurrency,
    availability: "https://schema.org/InStock",
  };

  if (o.frequency === "monthly" || o.frequency === "yearly") {
    return {
      ...base,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: o.price,
        priceCurrency: o.priceCurrency,
        billingDuration: o.frequency === "monthly" ? "P1M" : "P1Y",
        unitText: o.frequency === "monthly" ? "MONTH" : "YEAR",
      },
    };
  }

  return base;
}
