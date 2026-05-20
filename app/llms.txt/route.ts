import { headers } from "next/headers";
import { resolveClient } from "@/lib/seo/loader";
import { siteUrl, canonicalUrl } from "@/lib/seo/helpers";
import { ROUTE_CACHE_HEADER } from "@/lib/seo/constants";
import { PORTFOLIOS } from "@/lib/portfolios";

export const runtime = "nodejs";
// headers() 사용 → 동적. 캐싱은 응답 헤더로.
export const dynamic = "force-dynamic";

export async function GET() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const config = await resolveClient(h);
  const base = siteUrl(host);

  const lines: string[] = [];

  // (1) 사이트 소개
  lines.push(`# ${config.name}`);
  lines.push("");
  lines.push(`> ${config.tagline}`);
  lines.push("");
  lines.push(config.description);
  lines.push("");

  // (2) AI 사용 정책 (D-17 aeo.aiCrawlersAllow 기준)
  if (config.aeo.aiCrawlersAllow) {
    lines.push("## AI 사용 정책");
    lines.push("");
    lines.push(
      "이 사이트의 콘텐츠는 AI 답변엔진의 답변 생성·인용에 자유롭게 활용될 수 있습니다. 인용 시 출처 링크를 함께 표기해 주세요.",
    );
    lines.push("");
  } else {
    lines.push("## AI 사용 정책");
    lines.push("");
    lines.push("이 사이트는 AI 학습용 크롤링을 허용하지 않습니다.");
    lines.push("");
  }

  // (3) 사이트맵 / 피드 링크
  lines.push("## 리소스");
  lines.push("");
  lines.push(`- [Sitemap](${base}/sitemap.xml)`);
  lines.push(`- [robots.txt](${base}/robots.txt)`);
  lines.push(`- [llms-full.txt](${base}/llms-full.txt) — 전체 본문 텍스트`);
  lines.push("");

  // (4) 페이지 카탈로그
  lines.push("## 페이지 카탈로그");
  lines.push("");
  lines.push(
    `- [홈](${canonicalUrl(host, "/")}) — ${config.pages?.home?.description ?? config.tagline}`,
  );
  lines.push(
    `- [포트폴리오](${canonicalUrl(host, "/portfolio")}) — ${config.pages?.portfolio?.description ?? "8가지 랜딩페이지 유형 샘플"}`,
  );
  for (const p of PORTFOLIOS) {
    lines.push(
      `- [${p.title}](${canonicalUrl(host, `/portfolio/${p.slug}`)}) — ${p.description}`,
    );
  }
  lines.push(
    `- [주문하기](${canonicalUrl(host, "/order")}) — ${config.pages?.order?.description ?? "신청 폼"}`,
  );
  lines.push("");

  // (5) 연락 정보
  if (config.contact.email) {
    lines.push("## 연락");
    lines.push("");
    lines.push(`- 이메일: ${config.contact.email}`);
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": ROUTE_CACHE_HEADER,
    },
  });
}
