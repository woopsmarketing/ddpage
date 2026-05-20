import type { ClientConfig } from "@/lib/seo/types";
import { siteUrl, buildSameAs } from "@/lib/seo/helpers";

/**
 * Person schema — used directly for `profile` businessType and embedded as
 * creator/author by `brand`, `professional` etc.
 *
 * Falls back to `config.name` when `registration.representativeName` is null
 * so the schema is still valid for solo operators that haven't set a personal
 * name.
 */
export function personSchema(
  config: ClientConfig,
  host: string,
  opts?: {
    jobTitle?: string;
    knowsAbout?: string[];
    hasCredential?: string[];
  },
) {
  const base = siteUrl(host);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${base}#person`,
    name: config.registration.representativeName ?? config.name,
    url: base,
    image: config.ogImage.logo ?? `${base}/icon`,
    inLanguage: "ko-KR",
    sameAs: buildSameAs(config.social),
    ...(opts?.jobTitle && { jobTitle: opts.jobTitle }),
    ...(opts?.knowsAbout && { knowsAbout: opts.knowsAbout }),
    ...(opts?.hasCredential && {
      hasCredential: opts.hasCredential.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c,
      })),
    }),
  };
}
