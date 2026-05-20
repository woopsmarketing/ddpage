import { headers } from "next/headers";
import { resolveClient } from "@/lib/seo/loader";
import { canonicalUrl } from "@/lib/seo/helpers";
import { ROUTE_CACHE_HEADER } from "@/lib/seo/constants";
import { PORTFOLIOS } from "@/lib/portfolios";

export const runtime = "nodejs";
// headers() 사용 → 동적. 캐싱은 응답 헤더로.
export const dynamic = "force-dynamic";

const MAX_CHARS_PER_PAGE = 4000;

type Section = { pathname: string; title: string; content: string };

export async function GET() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const config = await resolveClient(h);

  const sections: Section[] = [];

  // (1) 홈
  sections.push({
    pathname: "/",
    title: config.pages?.home?.title ?? config.name,
    content: config.pages?.home?.description ?? config.description,
  });

  // (2) 포트폴리오 인덱스
  sections.push({
    pathname: "/portfolio",
    title: config.pages?.portfolio?.title ?? "포트폴리오",
    content:
      config.pages?.portfolio?.description ?? "8가지 랜딩페이지 유형 샘플",
  });

  // (3) 포트폴리오 상세 (lib/portfolios.ts)
  for (const p of PORTFOLIOS) {
    sections.push({
      pathname: `/portfolio/${p.slug}`,
      title: p.title,
      content: `${p.description}\n\n디자인 톤: ${p.designTone}`,
    });
  }

  // (4) 주문
  sections.push({
    pathname: "/order",
    title: config.pages?.order?.title ?? "주문하기",
    content: config.pages?.order?.description ?? "신청 폼",
  });

  // (5) FAQ — 콘텐츠 부족분 보강 (best-effort)
  if (config.faq.length > 0) {
    const faqContent = config.faq
      .map((f) => `Q. ${f.q}\nA. ${f.a}`)
      .join("\n\n");
    sections.push({
      pathname: "/#faq",
      title: "자주 묻는 질문",
      content: faqContent,
    });
  }

  // 직렬화
  const out: string[] = [];
  out.push(`# ${config.name}`);
  out.push("");
  out.push(`> ${config.tagline}`);
  out.push("");
  out.push("---");
  out.push("");

  for (const s of sections) {
    const url = canonicalUrl(host, s.pathname);
    const clean = stripHtml(s.content).slice(0, MAX_CHARS_PER_PAGE);
    out.push(`## ${s.pathname}`);
    out.push("");
    out.push(`URL: ${url}`);
    out.push(`Title: ${s.title}`);
    out.push("");
    out.push(clean);
    out.push("");
    out.push("---");
    out.push("");
  }

  return new Response(out.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": ROUTE_CACHE_HEADER,
    },
  });
}

// HTML 태그 제거 (best-effort LLM용 정제, XSS 방어 아님)
function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
