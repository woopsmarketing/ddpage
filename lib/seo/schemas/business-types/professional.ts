import type { ClientConfig, ProfessionalMeta } from "@/lib/seo/types";
import { siteUrl, buildSameAs } from "@/lib/seo/helpers";

/**
 * ProfessionalService main entity for solo experts (lawyer, designer, coach…).
 * Wraps a `Person` provider with credentials and `areaServed`.
 *
 * schema.org has no native `yearsOfExperience` field on Person, so we surface
 * it via a Korean description string when present.
 */
export function professionalSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);
  const meta = config.businessTypeMeta as ProfessionalMeta;

  const personDescription =
    meta.yearsOfExperience !== null
      ? `${meta.profession} ${meta.yearsOfExperience}년차`
      : undefined;

  const provider = {
    "@type": "Person",
    "@id": `${base}#person`,
    name: config.registration.representativeName ?? config.name,
    jobTitle: meta.profession,
    sameAs: buildSameAs(config.social),
    ...(personDescription && { description: personDescription }),
    ...(meta.credentials.length > 0 && {
      hasCredential: meta.credentials.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c,
      })),
    }),
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${base}#business`,
    name: config.name,
    url: base,
    description: config.description,
    ...(meta.servesAreas.length > 0 && { areaServed: meta.servesAreas }),
    provider,
  };
}
