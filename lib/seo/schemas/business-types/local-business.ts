import type { ClientConfig, LocalBusinessMeta } from "@/lib/seo/types";
import { siteUrl, ogImageUrl } from "@/lib/seo/helpers";

/**
 * LocalBusiness main entity — used for storefronts / studios with a physical
 * presence. Includes GeoCoordinates and OpeningHoursSpecification when the
 * config provides them.
 */
export function localBusinessSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);
  const meta = config.businessTypeMeta as LocalBusinessMeta;

  const address =
    config.contact.address
      ? {
          "@type": "PostalAddress",
          streetAddress: config.contact.address,
          addressCountry: "KR",
        }
      : undefined;

  const geo = meta.geoCoordinates
    ? {
        "@type": "GeoCoordinates",
        latitude: meta.geoCoordinates.latitude,
        longitude: meta.geoCoordinates.longitude,
      }
    : undefined;

  const openingHoursSpecification =
    meta.openingHours.length > 0
      ? meta.openingHours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.dayOfWeek,
          opens: h.opens,
          closes: h.closes,
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${base}#business`,
    name: config.name,
    url: base,
    description: config.description,
    image: ogImageUrl(host, {
      title: config.name,
      theme: config.ogImage.theme,
    }),
    telephone: config.contact.phone ?? undefined,
    email: config.contact.email,
    ...(address && { address }),
    ...(geo && { geo }),
    ...(openingHoursSpecification && { openingHoursSpecification }),
    ...(meta.priceRange && { priceRange: meta.priceRange }),
  };
}
