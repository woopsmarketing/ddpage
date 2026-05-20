import type { ClientConfig } from "@/lib/seo/types";
import { localBusinessSchema } from "./business-types/local-business";
import { professionalSchema } from "./business-types/professional";
import { digitalProductSchema } from "./business-types/digital-product";
import { eventSchema } from "./business-types/event";
import { brandSchema } from "./business-types/brand";
import { profileSchema } from "./business-types/profile";

// Common schemas
export { websiteSchema, organizationSchema } from "./website";
export { breadcrumbSchema } from "./breadcrumb";
export { faqSchema } from "./faq";
export { howToSchema } from "./howto";
export { personSchema } from "./person";
export { itemListSchema } from "./itemlist";

// Business-type schemas (named exports for direct import too)
export { localBusinessSchema } from "./business-types/local-business";
export { professionalSchema } from "./business-types/professional";
export { digitalProductSchema } from "./business-types/digital-product";
export { eventSchema } from "./business-types/event";
export { brandSchema } from "./business-types/brand";
export { profileSchema } from "./business-types/profile";

/**
 * Dispatch on `config.businessType` and return the appropriate main entity
 * schema. Caller is expected to spread the return value into a JsonLd `data`
 * array.
 */
export function businessTypeSchema(config: ClientConfig, host: string) {
  switch (config.businessType) {
    case "local-business":
      return localBusinessSchema(config, host);
    case "professional":
      return professionalSchema(config, host);
    case "digital-product":
      return digitalProductSchema(config, host);
    case "event":
      return eventSchema(config, host);
    case "brand":
      return brandSchema(config, host);
    case "profile":
      return profileSchema(config, host);
    default: {
      // Exhaustiveness check — unreachable as long as BusinessType stays in
      // sync with this switch.
      const _exhaustive: never = config.businessType;
      throw new Error(`unknown businessType: ${String(_exhaustive)}`);
    }
  }
}
