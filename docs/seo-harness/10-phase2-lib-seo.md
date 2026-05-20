# Phase 2 — `lib/seo/` 공통 모듈 명세

> 본 모듈들은 6개 에이전트가 모두 import해서 쓰는 공용 라이브러리.
> 변경 시 모든 에이전트 출력에 영향 → 신중히 변경.

---

## 파일 구조

```
lib/seo/
├── constants.ts   — 변하지 않는 상수 / 매직 넘버 / 크롤러 리스트
├── types.ts       — TypeScript 타입 + Zod 스키마
├── loader.ts      — JSON 로드 + 검증 + host 기반 resolve
└── helpers.ts     — URL 생성, 이미지 최적화, HowTo 감지, buildPageMetadata
```

---

## 📄 `lib/seo/constants.ts`

### 책임
프로젝트 전체에서 공유하는 상수. 매직 넘버/문자열 단일 출처.

### 내보낼 상수

```ts
// ───── 사이트 / 로케일 ─────
export const DEFAULT_LOCALE = "ko" as const;
export const DEFAULT_LANG_HTML = "ko" as const;
export const DEFAULT_LOCALE_OG = "ko_KR" as const;

// ───── OG 이미지 ─────
export const OG_DIMENSIONS = { width: 1200, height: 630 } as const;
export const OG_GENERATOR_PATH = "/og" as const;       // /og?title=...&theme=...

// ───── 본문 이미지 (CLS 방지) ─────
export const CONTENT_IMG_FALLBACK = { width: 800, height: 450 } as const;

// ───── 캐싱 / ISR ─────
export const ISR_REVALIDATE_SECONDS = 3600;            // 1시간 (D-12)
export const ROUTE_CACHE_HEADER = "public, s-maxage=3600, stale-while-revalidate=86400";

// ───── robots / crawler ─────
export const DISALLOW_PATHS = ["/admin", "/api", "/dashboard", "/auth"] as const;

export const AI_CRAWLERS = [
  "GPTBot", "ChatGPT-User", "OAI-SearchBot",       // OpenAI
  "ClaudeBot", "Claude-Web", "anthropic-ai",       // Anthropic
  "PerplexityBot",                                  // Perplexity
  "CCBot",                                          // Common Crawl
  "Google-Extended",                                // Gemini 학습
  "Applebot-Extended",                              // Apple Intelligence
  "Bytespider",                                     // ByteDance
  "YouBot", "DuckAssistBot", "MistralAI-User",
] as const;

// ───── HowTo 감지 (D-11) ─────
export const HOWTO_STEP_PATTERNS = [
  /^(\d+)단계/,                                       // "1단계"
  /^Step\s*(\d+)/i,                                  // "Step 1"
  /^(\d+)\.\s/,                                      // "1. "
  /^(첫|두|세|네|다섯|여섯|일곱|여덟|아홉|열)\s*번째/,    // 한국어 서수
];
export const HOWTO_MIN_STEPS = 3;

// ───── 사이트맵 priority / changeFreq 정책 ─────
export const SITEMAP_POLICY = {
  home:            { priority: 1.0, changeFrequency: "weekly"  },
  portfolio:       { priority: 0.9, changeFrequency: "weekly"  },
  portfolioDetail: { priority: 0.8, changeFrequency: "monthly" },
  order:           { priority: 0.9, changeFrequency: "monthly" },
  generic:         { priority: 0.5, changeFrequency: "monthly" },
} as const;

// ───── 사업 분류 ─────
export const BUSINESS_TYPES = [
  "local-business",
  "professional",
  "digital-product",
  "event",
  "brand",
  "profile",
] as const;
```

### 의존성
없음 (순수 상수)

---

## 📄 `lib/seo/types.ts`

### 책임
- `ClientConfig` TypeScript 타입 정의 (시스템의 데이터 모델 핵심)
- 사업 분류별 메타 데이터 union
- **Zod 스키마가 1차 진실 → TS 타입은 `z.infer`로 도출** (D-07)

### 핵심 타입 개요

```ts
import { z } from "zod";

// ───── 사업 분류 ─────
export const BusinessTypeSchema = z.enum([
  "local-business", "professional", "digital-product",
  "event", "brand", "profile",
]);
export type BusinessType = z.infer<typeof BusinessTypeSchema>;

// ───── 사업 분류별 메타 (6종) ─────
export const LocalBusinessMetaSchema = z.object({
  geoCoordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).nullable(),
  openingHours: z.array(z.object({
    dayOfWeek: z.enum(["Mo","Tu","We","Th","Fr","Sa","Su"]),
    opens:  z.string(),   // "09:00"
    closes: z.string(),   // "18:00"
  })).default([]),
  priceRange: z.string().nullable(),    // "₩₩"
});

export const ProfessionalMetaSchema = z.object({
  profession:        z.string(),
  yearsOfExperience: z.number().int().nullable(),
  credentials:       z.array(z.string()).default([]),
  servesAreas:       z.array(z.string()).default([]),
});

export const DigitalProductMetaSchema = z.object({
  productType: z.enum(["Service", "Product", "SoftwareApplication"]).default("Service"),
  offers: z.array(z.object({
    name:          z.string(),
    price:         z.number(),
    priceCurrency: z.string().default("KRW"),
    frequency:     z.enum(["monthly","yearly","once"]).default("once"),
    description:   z.string(),
  })).default([]),
});

export const EventMetaSchema = z.object({
  startDate: z.string(),   // ISO 8601 +09:00
  endDate:   z.string(),
  location:  z.object({
    name:     z.string(),
    address:  z.string().nullable(),
    isOnline: z.boolean().default(false),
  }),
  ticketOffers: z.array(z.object({
    name:          z.string(),
    price:         z.number(),
    priceCurrency: z.string().default("KRW"),
    availability:  z.enum(["InStock","SoldOut","PreOrder"]).default("InStock"),
    validFrom:     z.string().nullable(),
  })).default([]),
});

export const BrandMetaSchema = z.object({
  creativeWorkType: z.string().default("CreativeWork"),
  portfolio: z.array(z.object({
    title:       z.string(),
    url:         z.string().nullable(),
    image:       z.string().nullable(),
    description: z.string().nullable(),
  })).default([]),
});

export const ProfileMetaSchema = z.object({
  headline:   z.string(),
  jobTitle:   z.string().nullable(),
  knowsAbout: z.array(z.string()).default([]),
  channels:   z.array(z.object({
    name: z.string(),     // "Instagram", "YouTube"
    url:  z.string(),
  })).default([]),
});

// ───── ClientConfig 본체 ─────
export const ClientConfigSchema = z.object({
  slug:         z.string().regex(/^[a-z0-9][a-z0-9-]*$/, "lowercase + hyphen"),
  businessType: BusinessTypeSchema,
  name:         z.string(),
  domain:       z.string(),                    // "ddpage.kr"
  subdomain:    z.string().nullable(),         // null = apex
  locale:       z.literal("ko").default("ko"), // D-04

  tagline:     z.string(),
  description: z.string(),
  keywords:    z.array(z.string()).min(3),

  contact: z.object({
    email:          z.string().email(),
    phone:          z.string().nullable(),
    kakaoChannel:   z.string().nullable(),
    address:        z.string().nullable(),
    addressVisible: z.boolean().default(false),
  }),

  registration: z.object({
    businessRegNumber:   z.string().nullable(),
    ecommerceRegNumber:  z.string().nullable(),
    representativeName:  z.string().nullable(),
  }),

  social: z.object({
    instagram: z.string().nullable(),
    twitter:   z.string().nullable(),
    youtube:   z.string().nullable(),
    blog:      z.string().nullable(),
    linkedin:  z.string().nullable().default(null),
    github:    z.string().nullable().default(null),
  }),

  verification: z.object({
    google: z.string().nullable(),
    naver:  z.string().nullable(),
  }),

  ogImage: z.object({
    theme: z.enum([
      "dark-violet", "light-neutral", "warm-peach",
      "azure-blue", "fire-orange", "deep-indigo", "dot-grid",
    ]),
    logo: z.string().nullable(),
  }),

  faq: z.array(z.object({
    q: z.string(),
    a: z.string(),
  })).default([]),

  aeo: z.object({
    llmsFullText:     z.boolean().default(true),
    speakable:        z.boolean().default(true),
    howToAutoDetect:  z.boolean().default(true),
    aiCrawlersAllow:  z.boolean().default(true),
  }),

  businessTypeMeta: z.union([
    LocalBusinessMetaSchema,
    ProfessionalMetaSchema,
    DigitalProductMetaSchema,
    EventMetaSchema,
    BrandMetaSchema,
    ProfileMetaSchema,
  ]),

  pages: z.object({
    home:      z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
    portfolio: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
    order:     z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
  }).optional(),
});

export type ClientConfig = z.infer<typeof ClientConfigSchema>;
```

### businessType ↔ businessTypeMeta 정합성 (D-10)
Zod의 `superRefine`을 loader에서 사용해 cross-check:

```ts
ClientConfigSchema.superRefine((cfg, ctx) => {
  const expected = expectedMetaShapeFor(cfg.businessType);
  if (!matches(cfg.businessTypeMeta, expected)) {
    ctx.addIssue({ code: "custom", message: `meta-mismatch: businessType=${cfg.businessType}` });
  }
});
```

### 의존성
- `zod`
- `./constants` (BUSINESS_TYPES 일부 참조)

---

## 📄 `lib/seo/loader.ts`

### 책임
- `config/clients/<slug>.json` 파일 시스템에서 읽기
- Zod 파싱 → 검증 → typed `ClientConfig` 반환
- host 헤더 기반 resolve (멀티테넌트)
- 명확한 에러 (어떤 필드가 왜 잘못되었는지)

### 내보낼 함수

```ts
import { promises as fs } from "node:fs";
import path from "node:path";
import { ClientConfigSchema, type ClientConfig } from "./types";

// 1) slug 직접 (빌드 타임 + 명시 호출)
export async function loadClient(slug: string): Promise<ClientConfig>;

// 2) host 헤더 기반 (런타임 멀티테넌트)
export async function resolveClient(headers: Headers): Promise<ClientConfig>;
//   host → hostnameToSlug → loadClient 위임
//   localhost → process.env.NEXT_PUBLIC_DEFAULT_SLUG ?? "ddpage" (D-13)

// 3) 모든 슬러그 목록 (sitemap-agent 등 사용)
export async function listClientSlugs(): Promise<string[]>;

// 4) 캐시 (mtime 기반 자동 invalidate)
// 내부 Map<slug, {config, mtime}>
```

### 에러 타입

```ts
export class ClientConfigError extends Error {
  constructor(
    public kind: "not-found" | "invalid-json" | "schema" | "meta-mismatch",
    public slug: string,
    public detail?: unknown,
  ) { super(`[ClientConfigError:${kind}] slug=${slug}`); }
}
```

오케스트레이터가 catch해서 friendly 메시지로 변환.

### 멱등성
순수 읽기 함수. 캐시는 mtime 기반.

### 의존성
- `node:fs/promises`, `node:path`
- `./types`, `./constants`

---

## 📄 `lib/seo/helpers.ts`

### 책임
여러 에이전트가 공유하는 공용 함수.

### 내보낼 함수

```ts
// ───── URL ─────
export function siteUrl(host: string): string;
//   host="ddpage.kr" → "https://ddpage.kr"
//   host="localhost:3000" → "http://localhost:3000"

export function canonicalUrl(host: string, pathname: string): string;
//   trailing slash 제거 (단 "/"는 유지)

export function ogImageUrl(host: string, params: {
  title:    string;
  subtitle?: string;
  theme?:   string;
}): string;
//   siteUrl(host) + "/og?title=" + encoded params

// ───── 본문 이미지 자동 최적화 ─────
export function optimizeContentImages(html: string, fallbackAlt: string): string;
//   1) alt 누락 → fallbackAlt (HTML escape)
//   2) loading="lazy" + decoding="async" 자동 주입
//   3) width/height 없으면 CONTENT_IMG_FALLBACK
//   4) style="max-width:100%;height:auto" 자동 주입
//   멱등성: 이미 적용된 속성은 건드리지 않음

// ───── 한글 글자수 (Article.wordCount용) ─────
export function calcWordCount(content: string): number;
//   HTML 태그 제거 후 CJK 문자 수 + 라틴 단어 수

// ───── HowTo 단계 감지 ─────
export type HowToStep = { name: string; text: string };
export function detectHowToSteps(html: string): HowToStep[] | null;
//   H2/H3 추출 → HOWTO_STEP_PATTERNS 매칭
//   매칭 < HOWTO_MIN_STEPS 이면 null
//   각 단계 다음 <p> 텍스트를 step.text로

// ───── AI 크롤러 감지 ─────
export function isAiCrawler(userAgent: string): boolean;
//   AI_CRAWLERS 중 하나라도 UA에 포함되면 true

// ───── sameAs URL 배열 ─────
export function buildSameAs(social: ClientConfig["social"]): string[];
//   null 제외하고 URL 배열로

// ───── breadcrumb 빌더 ─────
export function buildBreadcrumb(
  host: string,
  trail: { name: string; pathname: string }[],
): unknown;
//   BreadcrumbList JSON-LD 객체 반환

// ───── 페이지 메타데이터 통합 빌더 (Phase 3-1에서 추가) ─────
export async function buildPageMetadata(opts: {
  slug:      string;
  pathname:  string;
  fallback?: { title?: string; description?: string };
  extra?:    Partial<Metadata>;
}): Promise<Metadata>;
//   1) loadClient(slug)
//   2) title:       config.pages?[key]?.title  → fallback.title  → site default
//   3) description: 같은 우선순위
//   4) canonical = canonicalUrl(host, pathname)
//   5) openGraph.images = [ogImageUrl(host, { title, theme: config.ogImage.theme })]
//   6) twitter mirror
//   7) extra 병합
```

### 멱등성
모든 함수가 순수 (입력 같으면 출력 같음). `optimizeContentImages`는 재실행 안전.

### 의존성
- `./constants`, `./types`, `./loader`
- 외부: Node 표준 + Next의 `Metadata` 타입

---

## Phase 2 통과 사항 (체크리스트)

- [x] constants.ts 명세 합의
- [x] types.ts 명세 합의 (Zod 기반)
- [x] loader.ts 명세 합의 (cross-check 포함)
- [x] helpers.ts 명세 합의
- [x] businessType cross-check 정책 결정 (D-10)
- [x] HOWTO_MIN_STEPS = 3 결정 (D-11)
- [x] ISR 3600 결정 (D-12)
- [x] NEXT_PUBLIC_DEFAULT_SLUG 정책 결정 (D-13)
- [x] SITEMAP_POLICY 결정

→ **Phase 3 진행 가능**.
