import type { Metadata } from "next";
import {
  DEFAULT_LOCALE_OG,
  OG_DIMENSIONS,
  OG_GENERATOR_PATH,
  CONTENT_IMG_FALLBACK,
  AI_CRAWLERS,
  HOWTO_STEP_PATTERNS,
  HOWTO_MIN_STEPS,
} from "./constants";
import type { ClientConfig } from "./types";
import { loadClient } from "./loader";
import { getPortfolio } from "@/lib/portfolios";

// ───── URL ─────
export function siteUrl(host: string): string {
  const hostname = host.split(":")[0];
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local");
  const protocol = isLocal ? "http" : "https";
  return `${protocol}://${host}`.replace(/\/$/, "");
}

export function canonicalUrl(host: string, pathname: string): string {
  const cleaned = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  return `${siteUrl(host)}${cleaned}`;
}

export function ogImageUrl(
  host: string,
  params: {
    title: string;
    subtitle?: string;
    theme?: string;
  },
): string {
  const sp = new URLSearchParams();
  sp.set("title", params.title);
  if (params.subtitle) sp.set("subtitle", params.subtitle);
  if (params.theme) sp.set("theme", params.theme);
  return `${siteUrl(host)}${OG_GENERATOR_PATH}?${sp.toString()}`;
}

// ───── 본문 이미지 자동 최적화 ─────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function optimizeContentImages(
  html: string,
  fallbackAlt: string,
): string {
  return html.replace(/<img\b([^>]*)>/gi, (_match, rawAttrs: string) => {
    let optimized = rawAttrs;
    if (!/\salt\s*=/i.test(optimized)) {
      optimized += ` alt="${escapeHtml(fallbackAlt)}"`;
    }
    if (!/\sloading\s*=/i.test(optimized)) {
      optimized += ` loading="lazy"`;
    }
    if (!/\sdecoding\s*=/i.test(optimized)) {
      optimized += ` decoding="async"`;
    }
    if (!/\swidth\s*=/i.test(optimized)) {
      optimized += ` width="${CONTENT_IMG_FALLBACK.width}"`;
    }
    if (!/\sheight\s*=/i.test(optimized)) {
      optimized += ` height="${CONTENT_IMG_FALLBACK.height}"`;
    }
    if (!/\sstyle\s*=/i.test(optimized)) {
      optimized += ` style="max-width:100%;height:auto"`;
    }
    return `<img${optimized}>`;
  });
}

// ───── 한글 글자수 ─────
export function calcWordCount(content: string): number {
  const stripped = content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // CJK characters
  const cjkCount = (stripped.match(/[一-鿿가-힯]/g) ?? []).length;
  // non-CJK words
  const latinWords = stripped
    .replace(/[一-鿿가-힯]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return cjkCount + latinWords;
}

// ───── HowTo 감지 ─────
export type HowToStep = { name: string; text: string };

export function detectHowToSteps(html: string): HowToStep[] | null {
  const headingRe = /<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  const matches: Array<{ name: string; index: number }> = [];

  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    if (HOWTO_STEP_PATTERNS.some((re) => re.test(text))) {
      matches.push({ name: text, index: m.index + m[0].length });
    }
  }

  if (matches.length < HOWTO_MIN_STEPS) return null;

  return matches.map(({ name, index }) => {
    const after = html.slice(index);
    const pMatch = after.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
    const text = pMatch ? pMatch[1].replace(/<[^>]+>/g, "").trim() : "";
    return { name, text };
  });
}

// ───── AI 크롤러 감지 ─────
export function isAiCrawler(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return AI_CRAWLERS.some((crawler) => ua.includes(crawler.toLowerCase()));
}

// ───── sameAs URL 배열 ─────
export function buildSameAs(social: ClientConfig["social"]): string[] {
  const urls = [
    social.instagram,
    social.twitter,
    social.youtube,
    social.blog,
    social.linkedin,
    social.github,
  ];
  return urls.filter((u): u is string => Boolean(u));
}

// ───── BreadcrumbList ─────
export function buildBreadcrumb(
  host: string,
  trail: { name: string; pathname: string }[],
): unknown {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: canonicalUrl(host, item.pathname),
    })),
  };
}

// ───── 페이지 메타데이터 통합 빌더 ─────
type BuildPageMetadataOpts = {
  slug: string;
  pathname: string;
  fallback?: { title?: string; description?: string };
  extra?: Partial<Metadata>;
};

function routeKey(pathname: string): "home" | "portfolio" | "order" | "other" {
  if (pathname === "/") return "home";
  if (pathname === "/portfolio") return "portfolio";
  if (pathname === "/order") return "order";
  return "other";
}

export function clientHost(config: ClientConfig): string {
  return config.subdomain
    ? `${config.subdomain}.${config.domain}`
    : config.domain;
}

/**
 * `/portfolio/<slug>` 형태일 때 매칭 portfolio 엔트리 반환.
 * 그 외 경로(`/portfolio`, `/`, 등)는 undefined.
 */
function portfolioEntryFromPathname(pathname: string) {
  const m = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
  if (!m) return undefined;
  return getPortfolio(m[1]);
}

export async function buildPageMetadata(
  opts: BuildPageMetadataOpts,
): Promise<Metadata> {
  const config = await loadClient(opts.slug);
  const host = clientHost(config);

  const key = routeKey(opts.pathname);
  const pageOverride = key !== "other" ? config.pages?.[key] : undefined;
  const portfolioEntry = portfolioEntryFromPathname(opts.pathname);

  const title =
    pageOverride?.title ??
    portfolioEntry?.title ??
    opts.fallback?.title ??
    config.tagline;

  const description =
    pageOverride?.description ??
    portfolioEntry?.description ??
    opts.fallback?.description ??
    config.description;

  const canonical = canonicalUrl(host, opts.pathname);
  const ogImage = ogImageUrl(host, { title, theme: config.ogImage.theme });

  const base: Metadata = {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: config.name,
      locale: DEFAULT_LOCALE_OG,
      url: canonical,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: OG_DIMENSIONS.width,
          height: OG_DIMENSIONS.height,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };

  return { ...base, ...opts.extra };
}
