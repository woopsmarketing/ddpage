// ───── 사이트 / 로케일 ─────
export const DEFAULT_LOCALE = "ko" as const;
export const DEFAULT_LANG_HTML = "ko" as const;
export const DEFAULT_LOCALE_OG = "ko_KR" as const;

// ───── OG 이미지 ─────
export const OG_DIMENSIONS = { width: 1200, height: 630 } as const;
export const OG_GENERATOR_PATH = "/og" as const;

// ───── 본문 이미지 (CLS 방지) ─────
export const CONTENT_IMG_FALLBACK = { width: 800, height: 450 } as const;

// ───── 캐싱 / ISR (D-12) ─────
export const ISR_REVALIDATE_SECONDS = 3600;
export const ROUTE_CACHE_HEADER = "public, s-maxage=3600, stale-while-revalidate=86400";

// ───── robots / crawler ─────
export const DISALLOW_PATHS = ["/admin", "/api", "/dashboard", "/auth"] as const;

export const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "CCBot",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "YouBot",
  "DuckAssistBot",
  "MistralAI-User",
] as const;

// ───── HowTo 감지 (D-11) ─────
export const HOWTO_STEP_PATTERNS: readonly RegExp[] = [
  /^(\d+)단계/,
  /^Step\s*(\d+)/i,
  /^(\d+)\.\s/,
  /^(첫|두|세|네|다섯|여섯|일곱|여덟|아홉|열)\s*번째/,
];

export const HOWTO_MIN_STEPS = 3;

// ───── 사이트맵 정책 ─────
export const SITEMAP_POLICY = {
  home:            { priority: 1.0, changeFrequency: "weekly"  as const },
  portfolio:       { priority: 0.9, changeFrequency: "weekly"  as const },
  portfolioDetail: { priority: 0.8, changeFrequency: "monthly" as const },
  order:           { priority: 0.9, changeFrequency: "monthly" as const },
  generic:         { priority: 0.5, changeFrequency: "monthly" as const },
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
