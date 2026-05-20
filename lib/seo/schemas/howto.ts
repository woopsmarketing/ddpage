import type { ClientConfig } from "@/lib/seo/types";
import { detectHowToSteps } from "@/lib/seo/helpers";

/**
 * HowTo schema — derived from static page HTML if the page has 3+ step-like
 * headings (`HOWTO_STEP_PATTERNS` in constants). Returns `null` when:
 *   - `config.aeo.howToAutoDetect === false`, or
 *   - `detectHowToSteps` finds fewer than `HOWTO_MIN_STEPS` steps.
 *
 * 1st pass (ddpage): pages are React JSX so this is essentially a no-op. v2
 * static content pages will plug into this without further changes.
 */
export function howToSchema(
  config: ClientConfig,
  pageTitle: string,
  html: string,
) {
  if (!config.aeo.howToAutoDetect) return null;
  const steps = detectHowToSteps(html);
  if (!steps) return null;

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    inLanguage: "ko-KR",
    name: pageTitle,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
