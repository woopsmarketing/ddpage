import type { ClientConfig } from "@/lib/seo/types";

/**
 * FAQPage schema with optional SpeakableSpecification for voice AEO.
 * Returns `null` if there are no FAQs — callers should `.filter(Boolean)`.
 */
export function faqSchema(config: ClientConfig) {
  if (config.faq.length === 0) return null;

  const base = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ko-KR",
    mainEntity: config.faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  if (config.aeo.speakable) {
    return {
      ...base,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["[data-speakable]", ".faq-answer"],
      },
    };
  }
  return base;
}
