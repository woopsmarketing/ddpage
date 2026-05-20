import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { resolveClient } from "@/lib/seo/loader";
import { siteUrl, clientHost } from "@/lib/seo/helpers";
import { AI_CRAWLERS, DISALLOW_PATHS } from "@/lib/seo/constants";

/**
 * 동적 robots.txt
 *
 * - host 헤더로 ClientConfig 해석 (멀티테넌트 시그니처)
 * - `config.aeo.aiCrawlersAllow` 에 따라 AI 크롤러 14종 허용/차단
 * - 일반 봇은 기본 허용 + DISALLOW_PATHS (admin/api/dashboard/auth) 차단
 * - sitemap / host 절대 URL 자동 부착
 */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const config = await resolveClient(h);
  const host = clientHost(config);
  const base = siteUrl(host);

  const aiBlock = config.aeo.aiCrawlersAllow
    ? {
        userAgent: [...AI_CRAWLERS],
        allow: "/",
        disallow: [...DISALLOW_PATHS],
      }
    : {
        userAgent: [...AI_CRAWLERS],
        disallow: "/",
      };

  const generalBlock = {
    userAgent: "*",
    allow: "/",
    disallow: [...DISALLOW_PATHS],
  };

  return {
    rules: [aiBlock, generalBlock],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
