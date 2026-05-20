import { z } from "zod";

// ───── 사업 분류 ─────
export const BusinessTypeSchema = z.enum([
  "local-business",
  "professional",
  "digital-product",
  "event",
  "brand",
  "profile",
]);
export type BusinessType = z.infer<typeof BusinessTypeSchema>;

// ───── 사업 분류별 메타 (6종) ─────
export const LocalBusinessMetaSchema = z.object({
  geoCoordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .nullable(),
  openingHours: z
    .array(
      z.object({
        dayOfWeek: z.enum(["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]),
        opens: z.string(),
        closes: z.string(),
      }),
    )
    .default([]),
  priceRange: z.string().nullable(),
});
export type LocalBusinessMeta = z.infer<typeof LocalBusinessMetaSchema>;

export const ProfessionalMetaSchema = z.object({
  profession: z.string(),
  yearsOfExperience: z.number().int().nullable(),
  credentials: z.array(z.string()).default([]),
  servesAreas: z.array(z.string()).default([]),
});
export type ProfessionalMeta = z.infer<typeof ProfessionalMetaSchema>;

export const DigitalProductMetaSchema = z.object({
  productType: z
    .enum(["Service", "Product", "SoftwareApplication"])
    .default("Service"),
  offers: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        priceCurrency: z.string().default("KRW"),
        frequency: z.enum(["monthly", "yearly", "once"]).default("once"),
        description: z.string(),
      }),
    )
    .default([]),
});
export type DigitalProductMeta = z.infer<typeof DigitalProductMetaSchema>;

export const EventMetaSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  location: z.object({
    name: z.string(),
    address: z.string().nullable(),
    isOnline: z.boolean().default(false),
  }),
  ticketOffers: z
    .array(
      z.object({
        name: z.string(),
        price: z.number(),
        priceCurrency: z.string().default("KRW"),
        availability: z
          .enum(["InStock", "SoldOut", "PreOrder"])
          .default("InStock"),
        validFrom: z.string().nullable(),
      }),
    )
    .default([]),
});
export type EventMeta = z.infer<typeof EventMetaSchema>;

export const BrandMetaSchema = z.object({
  creativeWorkType: z.string().default("CreativeWork"),
  portfolio: z
    .array(
      z.object({
        title: z.string(),
        url: z.string().nullable(),
        image: z.string().nullable(),
        description: z.string().nullable(),
      }),
    )
    .default([]),
});
export type BrandMeta = z.infer<typeof BrandMetaSchema>;

export const ProfileMetaSchema = z.object({
  headline: z.string(),
  jobTitle: z.string().nullable(),
  knowsAbout: z.array(z.string()).default([]),
  channels: z
    .array(
      z.object({
        name: z.string(),
        url: z.string(),
      }),
    )
    .default([]),
});
export type ProfileMeta = z.infer<typeof ProfileMetaSchema>;

// ───── businessType → meta schema 매핑 ─────
export function metaSchemaFor(type: BusinessType) {
  switch (type) {
    case "local-business":
      return LocalBusinessMetaSchema;
    case "professional":
      return ProfessionalMetaSchema;
    case "digital-product":
      return DigitalProductMetaSchema;
    case "event":
      return EventMetaSchema;
    case "brand":
      return BrandMetaSchema;
    case "profile":
      return ProfileMetaSchema;
  }
}

// ───── ClientConfig 본체 ─────
export const ClientConfigSchema = z.object({
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "lowercase + hyphen"),
  businessType: BusinessTypeSchema,
  name: z.string(),
  domain: z.string(),
  subdomain: z.string().nullable(),
  locale: z.literal("ko").default("ko"),

  tagline: z.string(),
  description: z.string(),
  keywords: z.array(z.string()).min(3),

  contact: z.object({
    email: z.string().email(),
    phone: z.string().nullable(),
    kakaoChannel: z.string().nullable(),
    address: z.string().nullable(),
    addressVisible: z.boolean().default(false),
  }),

  registration: z.object({
    businessRegNumber: z.string().nullable(),
    ecommerceRegNumber: z.string().nullable(),
    representativeName: z.string().nullable(),
  }),

  social: z.object({
    instagram: z.string().nullable(),
    twitter: z.string().nullable(),
    youtube: z.string().nullable(),
    blog: z.string().nullable(),
    linkedin: z.string().nullable().default(null),
    github: z.string().nullable().default(null),
  }),

  verification: z.object({
    google: z.string().nullable(),
    naver: z.string().nullable(),
  }),

  ogImage: z.object({
    theme: z.enum([
      "dark-violet",
      "light-neutral",
      "warm-peach",
      "azure-blue",
      "fire-orange",
      "deep-indigo",
      "dot-grid",
    ]),
    logo: z.string().nullable(),
  }),

  faq: z
    .array(
      z.object({
        q: z.string(),
        a: z.string(),
      }),
    )
    .default([]),

  aeo: z.object({
    llmsFullText: z.boolean().default(true),
    speakable: z.boolean().default(true),
    howToAutoDetect: z.boolean().default(true),
    aiCrawlersAllow: z.boolean().default(true),
  }),

  businessTypeMeta: z.union([
    LocalBusinessMetaSchema,
    ProfessionalMetaSchema,
    DigitalProductMetaSchema,
    EventMetaSchema,
    BrandMetaSchema,
    ProfileMetaSchema,
  ]),

  pages: z
    .object({
      home: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
      portfolio: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
      order: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type ClientConfig = z.infer<typeof ClientConfigSchema>;

// ───── businessType ↔ businessTypeMeta cross-check (D-10) ─────
export const ClientConfigSchemaStrict = ClientConfigSchema.superRefine(
  (cfg, ctx) => {
    const expected = metaSchemaFor(cfg.businessType);
    const parsed = expected.safeParse(cfg.businessTypeMeta);
    if (!parsed.success) {
      ctx.addIssue({
        code: "custom",
        path: ["businessTypeMeta"],
        message: `businessTypeMeta does not match businessType="${cfg.businessType}". Detail: ${parsed.error.message}`,
      });
    }
  },
);

// ───── businessType 기반 narrowing 타입 (schema-agent용) ─────
export type NarrowedConfig<T extends BusinessType> = ClientConfig & {
  businessType: T;
  businessTypeMeta: T extends "local-business"
    ? LocalBusinessMeta
    : T extends "professional"
      ? ProfessionalMeta
      : T extends "digital-product"
        ? DigitalProductMeta
        : T extends "event"
          ? EventMeta
          : T extends "brand"
            ? BrandMeta
            : T extends "profile"
              ? ProfileMeta
              : never;
};
