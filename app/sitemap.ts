import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { promises as fs } from "node:fs";
import path from "node:path";
import { resolveClient } from "@/lib/seo/loader";
import { canonicalUrl, clientHost } from "@/lib/seo/helpers";
import { SITEMAP_POLICY, DISALLOW_PATHS } from "@/lib/seo/constants";

// headers() 사용 → 동적 라우트. CDN 캐싱은 호출자 측 응답 헤더로 관리.
export const dynamic = "force-dynamic";

/**
 * 정적 라우트 자동 감지 sitemap (멀티테넌트 호스트 분기).
 *
 * - 'app/**' 아래 page.tsx 를 재귀 스캔 → URL pathname 으로 변환
 * - 동적 라우트('[slug]')와 API/admin/auth 등 DISALLOW_PATHS 는 제외
 * - 라우트 그룹 '(group)' 세그먼트는 URL 에서 제거
 * - SITEMAP_POLICY 로 priority / changeFrequency 부착
 * - 호스트(슬러그) 기반 라우트 필터링:
 *   - 메인 호스트(ddpage): `app/(client)/` 하위 라우트 제외
 *   - 클라이언트 호스트(<slug>): `app/(client)/<slug>/` 하위 라우트만 포함,
 *     URL 에서 슬러그 prefix 제거 (예: app/(client)/foo/page.tsx → "/")
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const config = await resolveClient(h);
  const host = clientHost(config);

  const routes = await discoverRoutes(config.slug);
  const filtered = routes
    .filter((r) => !isDisallowed(r))
    .sort((a, b) => a.localeCompare(b));

  const now = new Date();

  return filtered.map((route) => {
    const policy = pickPolicy(route);
    return {
      url: canonicalUrl(host, route),
      lastModified: now,
      changeFrequency: policy.changeFrequency,
      priority: policy.priority,
    };
  });
}

// ───── route discovery ─────

/**
 * 호스트의 slug 를 받아 해당 호스트에서 색인 가능한 라우트만 반환.
 * - slug === "ddpage" (메인 호스트): app/(client)/* 제외
 * - slug !== "ddpage" (클라이언트 호스트): app/(client)/<slug>/* 만 포함
 */
async function discoverRoutes(slug: string): Promise<string[]> {
  const appDir = path.join(process.cwd(), "app");
  const found: string[] = [];

  let entries: { path: string; isFile: boolean }[];
  try {
    const dirEnts = await fs.readdir(appDir, {
      recursive: true,
      withFileTypes: true,
    });
    entries = dirEnts.map((d) => {
      // Node >= 20.12 provides 'parentPath' on Dirent in recursive mode.
      const parent =
        (d as unknown as { parentPath?: string; path?: string }).parentPath ??
        (d as unknown as { parentPath?: string; path?: string }).path ??
        appDir;
      return {
        path: path.join(parent, d.name),
        isFile: d.isFile(),
      };
    });
  } catch (err) {
    // app/ 디렉토리 자체를 못 읽으면 sitemap 은 빈 배열로 fallback
    console.warn("[sitemap] failed to read app/:", err);
    return [];
  }

  const isMainHost = slug === "ddpage";

  for (const ent of entries) {
    if (!ent.isFile) continue;
    if (!ent.path.endsWith("page.tsx") && !ent.path.endsWith("page.ts")) {
      continue;
    }
    const route = filePathToRoute(ent.path, appDir, slug, isMainHost);
    if (route !== null) found.push(route);
  }

  // dedupe (정상적으로는 발생하지 않지만 안전장치)
  return Array.from(new Set(found));
}

/**
 * app 절대경로의 page.tsx 파일을 URL pathname 으로 변환.
 * - "app/page.tsx" -> "/"
 * - "app/portfolio/page.tsx" -> "/portfolio"
 * - "app/(group)/x/page.tsx" -> "/x"
 * - "app/[slug]/page.tsx" -> null (동적 라우트 제외)
 * - "app/api/..." -> null
 *
 * 호스트 기반 필터:
 * - isMainHost=true: app/(client)/<any>/page.tsx -> null (제외)
 * - isMainHost=false: app/(client)/<slug>/page.tsx 만 통과,
 *   결과 URL 에서 <slug> prefix 제거 (proxy.ts 의 rewrite 와 일치)
 */
function filePathToRoute(
  absFilePath: string,
  appDir: string,
  slug: string,
  isMainHost: boolean,
): string | null {
  const rel = path.relative(appDir, absFilePath).split(path.sep);
  // 마지막 요소는 "page.tsx" 또는 "page.ts"
  const segments = rel.slice(0, -1);

  // 클라이언트 route group "(client)" 검출
  const clientGroupIdx = segments.indexOf("(client)");
  const isClientRoute = clientGroupIdx !== -1;

  if (isMainHost) {
    // 메인 호스트는 클라이언트 라우트 제외
    if (isClientRoute) return null;
  } else {
    // 클라이언트 호스트는 본인 라우트만 포함
    if (!isClientRoute) return null;
    const routeSlug = segments[clientGroupIdx + 1];
    if (routeSlug !== slug) return null;
  }

  const cleaned: string[] = [];
  for (const seg of segments) {
    // route group: "(marketing)" — URL 에서 제거
    if (seg.startsWith("(") && seg.endsWith(")")) continue;
    // private folder: "_lib" — URL 에서 제외 + 라우트 자체 무효
    if (seg.startsWith("_")) return null;
    // parallel route: "@modal" — URL 에서 제거
    if (seg.startsWith("@")) continue;
    // 동적 / catch-all 세그먼트: 1차 sitemap 에서 제외
    if (seg.startsWith("[")) return null;
    cleaned.push(seg);
  }

  // 클라이언트 호스트: URL 에서 슬러그 prefix 제거
  // 예: app/(client)/foo/page.tsx → cleaned=["foo"] → "/" (proxy rewrite 와 일치)
  // 예: app/(client)/foo/sub/page.tsx → cleaned=["foo","sub"] → "/sub"
  if (isClientRoute && !isMainHost && cleaned[0] === slug) {
    cleaned.shift();
  }

  return "/" + cleaned.join("/");
}

function isDisallowed(route: string): boolean {
  return DISALLOW_PATHS.some(
    (p) => route === p || route.startsWith(p + "/"),
  );
}

function pickPolicy(route: string) {
  if (route === "/") return SITEMAP_POLICY.home;
  if (route === "/portfolio") return SITEMAP_POLICY.portfolio;
  if (route.startsWith("/portfolio/")) return SITEMAP_POLICY.portfolioDetail;
  if (route === "/order") return SITEMAP_POLICY.order;
  return SITEMAP_POLICY.generic;
}
