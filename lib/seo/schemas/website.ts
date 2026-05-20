import type { ClientConfig } from "@/lib/seo/types";
import { siteUrl, buildSameAs } from "@/lib/seo/helpers";

/**
 * WebSite schema — global, attached at the root layout.
 * `@id` is the base URL with `#website` anchor so other schemas can reference.
 */
export function websiteSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}#website`,
    url: base,
    name: config.name,
    alternateName: config.tagline,
    inLanguage: "ko-KR",
    description: config.description,
    publisher: { "@id": `${base}#organization` },
  };
}

/**
 * Organization schema — global publisher entity.
 * `sameAs` is derived from `config.social.*` via `buildSameAs`.
 * Contact / address fields are exposed only when `addressVisible === true`
 * (or the field itself is set).
 */
export function organizationSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);

  const sameAs = buildSameAs(config.social);

  const contactPoint =
    config.contact.email || config.contact.phone
      ? {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: config.contact.email,
          telephone: config.contact.phone ?? undefined,
          availableLanguage: ["Korean"],
        }
      : undefined;

  const address =
    config.contact.addressVisible && config.contact.address
      ? {
          "@type": "PostalAddress",
          streetAddress: config.contact.address,
          addressCountry: "KR",
        }
      : undefined;

  // inLanguage 는 의도적으로 제외: schema.org 스펙상 Organization 에는
  // inLanguage 가 표준 속성이 아니라 Rich Results 가 경고로 표시한다.
  // (WebSite, Article, CreativeWork 등에는 유효 — 그쪽엔 유지)
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}#organization`,
    name: config.name,
    url: base,
    logo: {
      "@type": "ImageObject",
      url: config.ogImage.logo ?? `${base}/icon`,
    },
    description: config.description,
    ...(sameAs.length > 0 && { sameAs }),
    ...(contactPoint && { contactPoint }),
    ...(address && { address }),
  };
}
