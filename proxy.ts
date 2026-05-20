import { NextResponse, type NextRequest } from "next/server";
import { hostnameToSlug } from "@/lib/seo/loader";

/**
 * Next.js 16 Proxy (formerly Middleware).
 *
 * Multi-tenant host routing:
 *   - ddpage.kr / www.ddpage.kr  → 메인 사이트 (rewrite 없음)
 *   - <slug>.ddpage.kr           → app/(client)/<slug>/* 로 rewrite
 *   - localhost                  → NEXT_PUBLIC_DEFAULT_SLUG (없으면 "ddpage")
 *
 * 메인 도메인에서 ddpage.kr/<slug> 로 직접 접근은 그대로 허용 (개발/미리보기).
 * Route Group `(client)` 는 URL에 영향 없음 — rewrite target 은 `/<slug>/*`.
 *
 * 결정 D-19, D-20 참조.
 */
export function proxy(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const slug = hostnameToSlug(host);

  // 메인 도메인 — rewrite 없이 통과
  if (slug === "ddpage") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();

  // 이미 /<slug>/* 로 들어온 경우 (rewrite 루프 방지)
  if (
    url.pathname === `/${slug}` ||
    url.pathname.startsWith(`/${slug}/`)
  ) {
    return NextResponse.next();
  }

  // <slug>.ddpage.kr/foo → /<slug>/foo
  // <slug>.ddpage.kr/    → /<slug>
  const suffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/${slug}${suffix}`;

  return NextResponse.rewrite(url);
}

export const config = {
  // 정적/내부 경로는 건너뜀 (sitemap, robots, llms.txt, og 등은 라우트 핸들러로 통과)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|css|js|map|woff2?)).*)",
  ],
};
