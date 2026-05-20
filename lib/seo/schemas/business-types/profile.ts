import type { ClientConfig, ProfileMeta } from "@/lib/seo/types";
import { siteUrl, buildSameAs } from "@/lib/seo/helpers";

/**
 * ProfilePage wrapping a single Person — used for creators / writers /
 * speakers who effectively run a Link-in-Bio style site.
 *
 * `sameAs` is the union of standard social URLs and any extra `channels[]`
 * entries (newsletter, podcast etc.).
 */
export function profileSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);
  const meta = config.businessTypeMeta as ProfileMeta;

  const sameAs = [
    ...buildSameAs(config.social),
    ...meta.channels.map((c) => c.url),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${base}#business`,
    url: base,
    inLanguage: "ko-KR",
    name: `${config.name} 프로필`,
    mainEntity: {
      "@type": "Person",
      "@id": `${base}#person`,
      name: config.registration.representativeName ?? config.name,
      description: meta.headline,
      ...(meta.jobTitle && { jobTitle: meta.jobTitle }),
      ...(meta.knowsAbout.length > 0 && { knowsAbout: meta.knowsAbout }),
      sameAs,
      url: base,
      image: config.ogImage.logo ?? `${base}/icon`,
    },
  };
}
