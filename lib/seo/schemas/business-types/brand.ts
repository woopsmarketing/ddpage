import type { ClientConfig, BrandMeta } from "@/lib/seo/types";
import { siteUrl, buildSameAs } from "@/lib/seo/helpers";

/**
 * CreativeWork-shaped entity for personal brands / studios.
 *
 * `meta.creativeWorkType` lets the operator pick a more specific
 * schema.org sub-type (e.g. "Book", "VisualArtwork", "MusicGroup") while
 * defaulting to plain "CreativeWork".
 */
export function brandSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);
  const meta = config.businessTypeMeta as BrandMeta;

  const creator = {
    "@type": "Person",
    "@id": `${base}#person`,
    name: config.registration.representativeName ?? config.name,
    sameAs: buildSameAs(config.social),
  };

  const workExample =
    meta.portfolio.length > 0
      ? meta.portfolio.map((p) => ({
          "@type": "CreativeWork",
          name: p.title,
          ...(p.url && { url: p.url }),
          ...(p.image && { image: p.image }),
          ...(p.description && { description: p.description }),
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": meta.creativeWorkType, // "CreativeWork" by default, or a user-picked sub-type.
    "@id": `${base}#business`,
    name: config.name,
    url: base,
    description: config.description,
    inLanguage: "ko-KR",
    creator,
    ...(workExample && { workExample }),
  };
}
