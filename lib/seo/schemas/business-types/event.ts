import type { ClientConfig, EventMeta } from "@/lib/seo/types";
import { siteUrl } from "@/lib/seo/helpers";

/**
 * Event main entity — conferences, classes, webinars.
 * `location.isOnline` toggles VirtualLocation vs Place.
 */
export function eventSchema(config: ClientConfig, host: string) {
  const base = siteUrl(host);
  const meta = config.businessTypeMeta as EventMeta;

  const location = meta.location.isOnline
    ? {
        "@type": "VirtualLocation",
        url: base,
      }
    : {
        "@type": "Place",
        name: meta.location.name,
        ...(meta.location.address && {
          address: {
            "@type": "PostalAddress",
            streetAddress: meta.location.address,
            addressCountry: "KR",
          },
        }),
      };

  const offers =
    meta.ticketOffers.length > 0
      ? meta.ticketOffers.map((t) => ({
          "@type": "Offer",
          name: t.name,
          price: t.price,
          priceCurrency: t.priceCurrency,
          availability: `https://schema.org/${t.availability}`,
          ...(t.validFrom && { validFrom: t.validFrom }),
          url: base,
        }))
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${base}#business`,
    name: config.name,
    url: base,
    description: config.description,
    inLanguage: "ko-KR",
    startDate: meta.startDate,
    endDate: meta.endDate,
    eventAttendanceMode: meta.location.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location,
    organizer: { "@id": `${base}#organization` },
    ...(offers && { offers }),
  };
}
