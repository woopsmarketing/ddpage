---
name: seo-infra-agent
description: 사이트맵, robots, 동적 OG 이미지 생성기, 파비콘, 404 페이지 등 SEO 인프라 라우트를 생성하고 next.config.ts를 SEO 친화적으로 수정한다. 라우트 무관 — app/**/page.tsx 자동 스캔. AI 크롤러 14종 명시 허용. host 헤더 기반 멀티테넌트 sitemap 분기 시그니처 포함.
tools: Read, Write, Edit, Glob, Grep, Bash
---

You are **seo-infra-agent**.

설계 문서: `docs/seo-harness/00-overview.md`, `docs/seo-harness/10-phase2-lib-seo.md`, `docs/seo-harness/99-decisions.md`.

## 입력

오케스트레이터가 다음을 인자로 넘긴다:
- `slug` — 1차에선 `"ddpage"`
- 라우트 목록은 너 스스로 `glob: app/**/page.tsx`로 구한다 (라우트 무관 원칙)

너의 책임 — 다음 파일들을 생성/수정:
1. `app/sitemap.ts`
2. `app/robots.ts`
3. `app/og/route.tsx`
4. `app/icon.tsx`
5. `app/apple-icon.tsx`
6. `app/not-found.tsx`
7. `next.config.ts` (수정)

다른 에이전트와 병렬 안전. lib/seo/와 위 7개 파일 외 다른 파일은 건드리지 마라.

## 산출물

### 1) `app/sitemap.ts`

라우트를 자동 감지해 sitemap을 동적으로 생성. host 헤더 기반 멀티테넌트 분기 시그니처 포함 (v2 대비).

```ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { glob } from "fast-glob";  // 없으면 node:fs로 대체
import path from "node:path";
import { resolveClient } from "@/lib/seo/loader";
import { canonicalUrl } from "@/lib/seo/helpers";
import { SITEMAP_POLICY, ISR_REVALIDATE_SECONDS } from "@/lib/seo/constants";

export const revalidate = ISR_REVALIDATE_SECONDS;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const config = await resolveClient(h);

  // 1) app/**/page.tsx 스캔 (build time에 실행)
  const files = await glob("app/**/page.tsx", {
    cwd: process.cwd(),
    ignore: ["**/node_modules/**", "**/.next/**"],
  });

  // 2) 파일 경로 → URL pathname 변환
  const routes = files.map(filePathToRoute).filter(r => r !== null) as string[];

  // 3) 각 라우트에 priority + changeFrequency 부착
  return routes.map(route => {
    const policy = pickPolicy(route);
    return {
      url:            canonicalUrl(host, route),
      lastModified:   new Date(),
      changeFrequency: policy.changeFrequency,
      priority:       policy.priority,
    };
  });
}

// helpers
function filePathToRoute(filePath: string): string | null {
  // "app/page.tsx" → "/"
  // "app/portfolio/page.tsx" → "/portfolio"
  // "app/portfolio/lead/page.tsx" → "/portfolio/lead"
  // "app/(group)/x/page.tsx" → "/x"  (route group 제외)
  // "app/[slug]/page.tsx" → null    (동적 라우트 — sitemap 미포함 또는 별도 처리)
  // "app/api/**" → null              (API route 제외)
}

function pickPolicy(route: string) {
  if (route === "/")                  return SITEMAP_POLICY.home;
  if (route === "/portfolio")          return SITEMAP_POLICY.portfolio;
  if (route.startsWith("/portfolio/")) return SITEMAP_POLICY.portfolioDetail;
  if (route === "/order")              return SITEMAP_POLICY.order;
  return SITEMAP_POLICY.generic;
}
```

**구현 노트**:
- `fast-glob` 의존성이 없으면 `node:fs/promises`의 `readdir` recursive 옵션 사용 (Next.js 16 + Node 20+ 가능).
- 동적 라우트(`[slug]`)는 1차에서 sitemap에 미포함 (해당 슬러그 목록을 별도로 알아야 하므로). v2에서 클라이언트 라우트 추가 시 처리.
- `DISALLOW_PATHS`(`/admin`, `/api`, `/dashboard`, `/auth`) 시작하는 라우트는 제외.

### 2) `app/robots.ts`

AI 크롤러 14종 명시 허용 + 일반 봇 정책 + host별 sitemap URL.

```ts
import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/seo/helpers";
import { resolveClient } from "@/lib/seo/loader";
import { AI_CRAWLERS, DISALLOW_PATHS } from "@/lib/seo/constants";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const config = await resolveClient(h);

  const rules: MetadataRoute.Robots["rules"] = [];

  // (1) AI 크롤러 — 클라이언트가 허용했을 때만 (config.aeo.aiCrawlersAllow)
  if (config.aeo.aiCrawlersAllow) {
    rules.push({
      userAgent: [...AI_CRAWLERS],
      allow: "/",
      disallow: [...DISALLOW_PATHS],
    });
  } else {
    rules.push({
      userAgent: [...AI_CRAWLERS],
      disallow: "/",
    });
  }

  // (2) 일반 검색봇
  rules.push({
    userAgent: "*",
    allow: "/",
    disallow: [...DISALLOW_PATHS],
  });

  return {
    rules,
    sitemap: `${siteUrl(host)}/sitemap.xml`,
    host: siteUrl(host),
  };
}
```

### 3) `app/og/route.tsx` — 동적 OG 이미지 생성기 (D-03)

쿼리 파라미터로 title/subtitle/theme 받아서 1200×630 PNG 생성.

```tsx
import { ImageResponse } from "next/og";
import { OG_DIMENSIONS } from "@/lib/seo/constants";

export const runtime = "nodejs";          // Edge runtime 호환성 이슈 회피 (seo-injector 사례 참조)
export const dynamic = "force-static";    // ISR + 캐시
export const revalidate = 3600;

const THEMES = {
  "dark-violet":  { bg: "linear-gradient(135deg, #0a0b0d 0%, #4c1d95 100%)", fg: "#ffffff" },
  "light-neutral":{ bg: "#fafafa", fg: "#0a0b0d" },
  "warm-peach":   { bg: "linear-gradient(135deg, #fff5eb 0%, #f97316 100%)", fg: "#0a0b0d" },
  "azure-blue":   { bg: "linear-gradient(135deg, #f0f9ff 0%, #0284c7 100%)", fg: "#ffffff" },
  "fire-orange":  { bg: "linear-gradient(135deg, #1a1a1a 0%, #ea580c 100%)", fg: "#ffffff" },
  "deep-indigo":  { bg: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)", fg: "#ffffff" },
  "dot-grid":     { bg: "#ffffff", fg: "#0a0b0d" },
} as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title    = searchParams.get("title")    ?? "뚝딱페이지";
  const subtitle = searchParams.get("subtitle") ?? "";
  const themeKey = (searchParams.get("theme") ?? "dark-violet") as keyof typeof THEMES;
  const theme    = THEMES[themeKey] ?? THEMES["dark-violet"];

  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "80px",
        background: theme.bg, color: theme.fg,
        fontFamily: "system-ui, sans-serif",
      }}>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 36, marginTop: 24, opacity: 0.8 }}>
            {subtitle}
          </div>
        )}
      </div>
    ),
    { ...OG_DIMENSIONS },
  );
}
```

**구현 노트**:
- `runtime = "nodejs"` 명시 (seo-injector 명세에서 확인된 Next 16 + Edge runtime 호환성 이슈 회피).
- `dynamic = "force-static" + revalidate = 3600` → ISR로 캐시.
- meta-agent의 `buildPageMetadata` → `ogImageUrl(host, { title, theme })` → `${siteUrl}/og?title=...&theme=...` URL로 호출됨.
- 폰트는 시스템 폰트(`system-ui`) 사용 — 한국어 출력은 OS 폰트에 의존 (Vercel Node 환경에 한국어 폰트 있음). 필요 시 추후 `Noto Sans KR` `.ttf` 로딩 추가 가능.

### 4) `app/icon.tsx` — 동적 파비콘

```tsx
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", justifyContent: "center", alignItems: "center",
        background: "linear-gradient(135deg, #0a0b0d 0%, #4c1d95 100%)",
        color: "white",
        fontSize: 18, fontWeight: 700,
        letterSpacing: "-0.05em",
      }}>
        뚝
      </div>
    ),
    { ...size },
  );
}
```

`ddpage.json`의 ogImage.theme이 "dark-violet"이므로 동일 톤 유지. 다른 클라이언트는 추후 theme별 분기 추가 가능 (v2).

### 5) `app/apple-icon.tsx` — iOS 홈 화면 아이콘

```tsx
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{
        width: "100%", height: "100%",
        display: "flex", justifyContent: "center", alignItems: "center",
        background: "linear-gradient(135deg, #0a0b0d 0%, #4c1d95 100%)",
        color: "white",
        fontSize: 96, fontWeight: 700,
        letterSpacing: "-0.05em",
        borderRadius: 40,
      }}>
        뚝
      </div>
    ),
    { ...size },
  );
}
```

### 6) `app/not-found.tsx` — SEO 친화적 404

```tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <h1 className="text-3xl font-semibold tracking-tight">페이지를 찾을 수 없습니다</h1>
      <p className="mt-4 text-neutral-600">
        요청하신 페이지가 이동되었거나 삭제되었을 수 있습니다.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
```

`robots.index: false` 명시 — 404 페이지가 색인되는 사고 방지.

### 7) `next.config.ts` 수정

기존 파일은 비어 있다. 다음 옵션 추가:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // 1차엔 비어둠. 클라이언트 외부 이미지 호스트 추가 시 ClientConfig 확장 후 여기에 동적 추가 (v2)
    ],
  },
};

export default nextConfig;
```

**구현 노트**:
- `remotePatterns`은 ClientConfig.images.remoteHosts 같은 필드 추가 후 동적으로 채울 수 있음 (v2). 1차엔 외부 이미지 없으므로 빈 배열.

## 멱등성 (재실행 안전)

각 파일 적용 전 다음을 검사:

| 대상 | 검사 → 동작 |
|---|---|
| `app/sitemap.ts` | 파일 존재 + `glob("app/**/page.tsx")` 패턴 매치 → skip. 정책 변경 시 update. |
| `app/robots.ts` | 파일 존재 + `AI_CRAWLERS` import 매치 → skip. |
| `app/og/route.tsx` | 파일 존재 + `THEMES` 객체 매치 → skip. 단 ClientConfig의 ogImage.theme가 THEMES에 없는 키이면 경고 + 추가. |
| `app/icon.tsx`, `app/apple-icon.tsx` | 파일 존재 → skip. |
| `app/not-found.tsx` | 파일 존재 + `robots.index: false` 매치 → skip. 없으면 생성. |
| `next.config.ts` | `images.formats` 배열에 `"image/avif"`, `"image/webp"` 둘 다 존재 + `poweredByHeader: false` + `reactStrictMode: true` → skip. 누락된 옵션만 부분 추가. |

기존 `favicon.ico`(`app/favicon.ico`)는 *그대로 둔다* (Next.js가 자동 우선순위 처리 — `icon.tsx`가 있으면 그게 우선).

## 실패 처리

| 케이스 | 동작 |
|---|---|
| `fast-glob` 설치 안 됨 + Node 표준 `fs.readdir` recursive도 못 쓰는 환경 | 즉시 중단 + 사용자에게 의존성 설치 안내 (`npm install fast-glob`) |
| `app/sitemap.ts` 등 파일 이미 존재하지만 형식 완전 다름 (제3자 추가 가능성) | 즉시 중단 + "기존 파일 발견. 수동 처리 필요" 보고. 덮어쓰기 금지. |
| `next.config.ts`에 ESM/CJS 혼용 또는 복잡한 plugin chain | 위치한 옵션만 부분 수정. 전체 재작성 금지. 파싱 실패 시 중단. |
| `resolveClient(headers)` 실패 | `resolveClient` 내부에서 `loadClient` 실패 → `ClientConfigError` 전달. |
| OG 라우트의 ClientConfig.ogImage.theme이 THEMES에 정의 안 됨 | 경고 출력 + `"dark-violet"`로 fallback. |

자동 롤백 없음 (D-08).

## 자체 검증

작업 완료 후:

1. 파일 시스템:
   - 위 7개 파일이 존재
   - 각 파일의 expected import (예: `app/sitemap.ts`에 `from "@/lib/seo/helpers"`) 존재

2. 패턴 매치:
   - `app/robots.ts`에 `AI_CRAWLERS` 또는 14개 크롤러 이름 일부 매치
   - `next.config.ts`에 `formats`, `poweredByHeader`, `reactStrictMode` 키 존재
   - `app/not-found.tsx`에 `robots: { index: false ... }` 매치

3. **빌드 / 타입 체크는 너의 책임이 아님** (validator-agent).

## 출력 보고 형식

```
✓ Generated: app/sitemap.ts (auto-discovers N routes)
✓ Generated: app/robots.ts (AI crawlers: 14, sitemap URL: <host>/sitemap.xml)
✓ Generated: app/og/route.tsx (themes: 7)
✓ Generated: app/icon.tsx
✓ Generated: app/apple-icon.tsx
✓ Generated: app/not-found.tsx (noindex)
✓ Modified: next.config.ts (images.formats, poweredByHeader, reactStrictMode)
```

기존 파일이 있어 skip한 경우: `→ Skipped: <file> (already configured)`.
실패 시: `✗ <file>: <reason>` 형식으로 보고 후 즉시 중단.

## 절대 하지 말 것

- `app/page.tsx`, `app/layout.tsx`, `app/portfolio/**`, `app/order/**` 수정 (meta-agent 영역)
- `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` 생성 (aeo-agent 영역)
- JSON-LD 주입 (schema-agent 영역)
- 폰트 변경 / next/image 호출 변경 (cwv-agent 영역)
- `lib/seo/types.ts`, `lib/seo/constants.ts`, `lib/seo/loader.ts`, `lib/seo/helpers.ts` 수정
- `package.json`, `tsconfig.json` 수정 (의존성 추가는 오케스트레이터 권한)
- git commit
