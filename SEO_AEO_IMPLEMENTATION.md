# SEO월드 — SEO / AEO 구현 명세서

> 사이트 전체에 적용된 검색엔진 최적화(SEO) 및 답변엔진 최적화(AEO) 요소를 빠짐없이 정리한 문서.
> 작성일: 2026-05-15 / 도메인: https://seoworld.co.kr / 스택: Next.js App Router + Supabase + Vercel

---

## 0. 한눈에 보는 SEO/AEO 체크리스트

| 카테고리 | 항목 | 상태 |
|---|---|---|
| **메타데이터** | title 템플릿, description, keywords, viewport, robots, canonical | ✅ |
| **OpenGraph / Twitter** | type, locale(ko_KR), site_name, OG 이미지(1200×630), Twitter `summary_large_image` | ✅ |
| **JSON-LD** | WebSite, Organization, Article, BlogPosting, BreadcrumbList, FAQPage, HowTo, ItemList, Person, SearchAction | ✅ |
| **사이트 인프라** | robots.ts, sitemap.ts(DB 기반 동적), feed.xml(Atom), posts.json | ✅ |
| **AEO** | llms.txt, llms-full.txt, AI 크롤러 명시 허용, FAQPage + Speakable, HowTo, "답변 우선" 콘텐츠 구조 | ✅ |
| **이미지 SEO** | next/image, AVIF/WebP 자동 변환, lazy + async decoding, alt 자동 fallback, width/height(CLS) | ✅ |
| **콘텐츠 구조** | H1 1개 / H2 위계 / TOC 자동 추출 / 메타바(날짜·수정일·읽기시간·카테고리·태그) | ✅ |
| **내부링크** | 관련글(카테고리 기반), 최신글, 이전/다음글, breadcrumb, 카테고리 색상 토큰 | ✅ |
| **CTA** | `cta_strength` 4단계 분기(weak / medium / medium-strong / strong) | ✅ |
| **인덱싱** | Google Indexing API, Google/Naver verification, sitemap host 지정 | ✅ |
| **성능 / CWV** | next/font Noto Sans KR + `display:swap`, AVIF/WebP, ISR(3600s), priority hero image | ✅ |
| **공유 / 인게이지먼트** | 공유 버튼(X / LinkedIn / Facebook / Native), URL 복사, 읽기진행률, sticky TOC active highlight | ✅ |

---

## 1. HEAD / Metadata 전략

### 1.1 루트 레이아웃 — `apps/web/src/app/layout.tsx`

```ts
export const metadata: Metadata = {
  title: {
    default: `구글 SEO 분석 도구 — 구글 상위노출 무료 진단 | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  keywords: ["구글 SEO", "구글 상위노출", "SEO 분석", "검색엔진최적화",
             "백링크 조회", "키워드 분석", "메타태그 분석", "사이트맵 생성",
             "온페이지 SEO", "무료 SEO 도구", "구글 검색 순위", "SEO 최적화"],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: { type: "website", siteName, locale: "ko_KR", url, title, description },
  twitter:   { card: "summary_large_image", title, description },
  robots: {
    index: true, follow: true,
    googleBot: {
      index: true, follow: true,
      "max-video-preview": -1,        // 비디오 미리보기 무제한
      "max-image-preview": "large",   // 큰 이미지 미리보기 허용
      "max-snippet": -1,              // 스니펫 글자수 무제한
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
      "application/json":    `${SITE_URL}/posts.json`,
    },
  },
  verification: {
    google: NEXT_PUBLIC_GOOGLE_VERIFICATION,
    other:  { "naver-site-verification": NEXT_PUBLIC_NAVER_VERIFICATION },
  },
};
```

**핵심 포인트**
- `title.template = "%s | SEO월드"` — 모든 하위 페이지가 자동으로 사이트명 suffix 부착
- `metadataBase` 지정 → 상대 경로 OG 이미지·canonical이 절대 URL로 자동 확장
- `max-image-preview: large` + `max-snippet: -1` → 구글 SERP에서 풍부한 스니펫·이미지 노출 허용
- Google + Naver 동시 verification (네이버 웹마스터 도구까지 커버)
- `<html lang="ko">` 명시 → 검색엔진/스크린리더 언어 시그널

### 1.2 페이지별 generateMetadata

블로그 글: `apps/web/src/app/(public)/blog/[slug]/page.tsx`

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(slug);
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.excerpt,
    keywords: post.tags,                                  // 태그 → 메타 keywords
    alternates: { canonical: `${SITE_URL}/blog/${slug}` },
    openGraph: {
      type: "article",                                     // article 타입 명시
      publishedTime: post.published_at,                    // article:published_time
      modifiedTime:  post.updated_at,                      // article:modified_time
      tags: post.tags,                                     // article:tag (복수)
      locale: "ko_KR",
      images: [{ url: post.cover_image_url, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", images: [post.cover_image_url] },
  };
}
```

페이지별 메타가 존재하는 라우트:
- `/` (홈), `/blog`, `/blog/[slug]`, `/tools`, `/services`, `/domains`, `/guides`, `/pricing`, `/contact`, `/author/[slug]`, 각 `/tools/*`, 각 `/services/*`, 각 `/domains/*` 페이지

### 1.3 파비콘 / 앱 아이콘 / OG 이미지

| 파일 | 역할 |
|---|---|
| `app/icon.tsx` | 동적 파비콘 (Next.js ImageResponse) |
| `app/apple-icon.tsx` | iOS 홈 화면 아이콘 |
| `app/opengraph-image.tsx` | 기본 OG 이미지 1200×630 (동적 생성) |
| `app/(public)/blog/[slug]/opengraph-image.tsx` | 글별 OG 이미지 (제목·카테고리·태그 포함 동적 렌더) |

---

## 2. JSON-LD 구조화 데이터 (Schema.org)

### 2.1 전역 — 모든 페이지

루트 레이아웃에 주입:
```ts
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}#website`,
  "name": "SEO월드",
  "alternateName": "SEOWORLD",
  "inLanguage": "ko-KR",
  "publisher": {
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    "name": "SEO월드",
    "url": SITE_URL,
    "logo": { "@type": "ImageObject", "url": `${SITE_URL}/icon.svg` }
  }
}
```

### 2.2 홈 페이지 — SearchAction 추가

```ts
{
  "@type": "WebSite",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${SITE_URL}/domains?q={search_term_string}`,  // 사이트링크 검색박스
    "query-input": "required name=search_term_string"
  }
}
```

### 2.3 블로그 인덱스 — `ItemList`

블로그 글 목록을 `ItemList` 로 노출 → 구글이 글 카탈로그 구조 인식.

### 2.4 블로그 글 상세 — `apps/web/src/components/blog/blog-layout.tsx`

**(1) Article schema** (모든 글 필수)
```ts
{
  "@type": "Article",
  "headline": post.title,
  "description": post.excerpt,
  "inLanguage": "ko-KR",
  "isAccessibleForFree": true,
  "wordCount": calcWordCount(post.content),     // 한글 글자수 자동 계산
  "author": Person,                              // Person schema 임베드
  "publisher": Organization,
  "mainEntityOfPage": { "@type": "WebPage", "@id": canonicalUrl },
  "datePublished": post.published_at,
  "dateModified": post.updated_at,
  "image": { url, width: 1200, height: 630 },
  "articleSection": post.category,
  "keywords": post.tags.join(", "),
  "about":    [{ "@type": "Thing", "name": category }],   // 주제 엔티티 (Knowledge Graph 연결)
  "mentions": tags.map(name => ({ "@type": "Thing", name })), // AEO 부수 엔티티
}
```

**(2) FAQPage schema** — `post.faqs` 가 1개 이상이면 자동 생성
```ts
{
  "@type": "FAQPage",
  "inLanguage": "ko-KR",
  "speakable": {                                   // 음성 검색·AI 답변 인용용
    "@type": "SpeakableSpecification",
    "cssSelector": ["[data-speakable]", ".blog-faq-answer"]
  },
  "mainEntity": faqs.map(f => ({
    "@type": "Question", "name": f.q,
    "acceptedAnswer": { "@type": "Answer", "text": f.a }
  }))
}
```

**(3) HowTo schema** — 본문에서 "1단계", "Step 1", "1.", "첫 번째" 같은 H2/H3가 **3개 이상** 감지될 때만 자동 주입
- 추출 로직: `apps/web/src/lib/blog/extract-howto-steps.ts`
- 단계 패턴 5종 정규식으로 감지 → 각 단계 다음 `<p>` 텍스트를 `HowToStep.text` 로 사용

**(4) BreadcrumbList schema** — 모든 글
- 홈 → 블로그 → 글 제목 (3 단계)

**(5) Person schema** — `apps/web/src/lib/blog/author.ts`
- `name`, `jobTitle`, `image`, `description`, `knowsAbout`(SEO·백링크·키워드 등), `sameAs`(소셜 URL)
- E-E-A-T(Experience, Expertise, Authoritativeness, Trustworthiness) 시그널 강화

---

## 3. H 태그 위계 & 본문 구조

### 3.1 페이지 전반 규칙
- **H1은 페이지당 1개**: 홈(`구글 상위노출을 위한 SEO 분석과 백링크`), 각 도구 페이지 제목, 블로그 글 제목
- **H2**: 섹션 구분자 — 본문 TOC 추출 대상
- **H3**: 서브섹션 — HowTo 단계 감지에 활용

### 3.2 블로그 본문 처리 — `blog-layout.tsx:155-167`

```ts
const tocItems = post.content
  .match(/<h2[^>]*id="([^"]*)"[^>]*>([^<]*)<\/h2>/g)
  .map(/* id+text 추출 */);
if (faqs.length > 0) tocItems.push({ id: "faq", title: "자주 묻는 질문" });
```

- HTML의 H2에 자동으로 `id` 속성이 들어가야 TOC가 작동 → 글 발행 스크립트가 anchor id 생성 책임
- FAQ 섹션은 별도로 TOC 마지막에 추가

### 3.3 시각적 위계 강화
- 최근 커밋 `2cc3383`: H2/H3 시각적 위계 강화 — 섹션 구분 + 가독성 개선
- 카테고리별 색상 토큰: SEO 전략(blue), 백링크(emerald), 키워드(purple), 온페이지(amber), 테크니컬(rose)

---

## 4. 이미지 SEO

### 4.1 Next.js 이미지 최적화 — `apps/web/next.config.mjs`

```js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "xogsufreiixvppnvxqxx.supabase.co", pathname: "/storage/v1/object/public/**" },
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
  formats: ["image/avif", "image/webp"],  // AVIF 우선 → WebP fallback → 원본
}
```

- 모든 `<Image>` 컴포넌트는 자동으로 AVIF/WebP 변환
- Hero 이미지에 `priority` 속성 → LCP 최적화

### 4.2 블로그 본문 이미지 자동 최적화 — `blog-layout.tsx:13-44`

```ts
function optimizeContentImages(html, fallbackAlt) {
  return html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    let optimized = attrs;
    // 1) alt 누락 시 글 제목으로 자동 fallback (SEO 필수)
    if (!/\salt\s*=/i.test(optimized)) optimized += ` alt="${escapedAlt}"`;
    // 2) loading="lazy" + decoding="async" 자동 주입
    optimized += ' loading="lazy" decoding="async"';
    // 3) width/height 없으면 기본값 800x450 (CLS 방지)
    if (!/width\s*=/i.test(optimized))  optimized += ' width="800" height="450"';
    // 4) style="max-width:100%;height:auto" → 반응형 + 종횡비 유지
    if (!/style\s*=/i.test(optimized))  optimized += ' style="max-width:100%;height:auto"';
    return `<img${optimized}>`;
  });
}
```

**자동 적용되는 SEO 신호**
- `alt` 누락 0% — DB에 alt 없는 이미지가 들어와도 글 제목으로 채움
- `loading="lazy"` — 뷰포트 진입 시 로드 → LCP / 데이터 사용량 절감
- `decoding="async"` — 메인 스레드 블로킹 방지
- `width × height` 강제 → CLS(Cumulative Layout Shift) 0에 가까움
- `max-width:100%; height:auto` → 모바일 반응형

### 4.3 이미지 압축 / 생성 파이프라인

블로그용 이미지 자동화 스크립트 (`apps/web/scripts/`):
- `generate-blog-images.mjs` — OpenAI GPT Image 1.5로 커버 이미지 생성
- `generate-gsc-images.mjs` — Google Search Console 가이드용 이미지
- `add-image-text-overlay.mjs` / `image-overlay-helper.mjs` / `image_overlay.py` — 텍스트 오버레이
- `bulk-fix-blog-images.mjs`, `regen-blog-images.mjs` — 이미지 일괄 보정
- 모든 이미지는 Supabase Storage(`storage/v1/object/public/blog/`)에 업로드 → next/image의 `remotePatterns`로 허용

---

## 5. 사이트맵 & robots.txt

### 5.1 동적 sitemap — `apps/web/src/app/sitemap.ts`

`export const dynamic = "force-dynamic"` — 매 요청마다 DB 조회

| 경로 | priority | changeFreq |
|---|---|---|
| `/` | 1.0 | daily |
| `/tools` | 0.9 | weekly |
| `/tools/*` (10개) | 0.8 | monthly |
| `/blog` | 0.8 | weekly |
| `/blog/[slug]` (DB 자동) | 0.7 | monthly |
| `/domains`, `/domains/auction` | 0.7~0.8 | daily |
| `/services/*` | 0.6~0.7 | monthly |
| `/author/[slug]` | 0.5 | monthly |

**DB → sitemap 자동 동기화**:
```ts
const posts = await getPublishedPosts();
const blogEntries = posts.map(p => ({
  url: `${SITE_URL}/blog/${p.slug}`,
  lastModified: new Date(p.updated_at || p.published_at),
  changeFrequency: "monthly",
  priority: 0.7,
}));
```

### 5.2 robots.ts — AI 크롤러 명시 허용

```ts
{
  // (1) AI 크롤러 명시 허용 — AEO / GEO(Generative Engine Optimization)
  userAgent: [
    "GPTBot", "ChatGPT-User", "OAI-SearchBot",     // OpenAI
    "ClaudeBot", "Claude-Web", "anthropic-ai",     // Anthropic
    "PerplexityBot",                                // Perplexity
    "CCBot",                                        // Common Crawl
    "Google-Extended",                              // Gemini 학습용
    "Applebot-Extended",                            // Apple Intelligence
    "Bytespider",                                   // ByteDance
    "YouBot", "DuckAssistBot", "MistralAI-User",
  ],
  allow: "/",
  disallow: ["/admin", "/api", "/dashboard", "/auth"],
},
// (2) 일반 검색봇
{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/dashboard", "/auth"] }

sitemap: `${SITE_URL}/sitemap.xml`,
host: SITE_URL,
```

**핵심**: AI 답변엔진이 SEO월드 콘텐츠를 학습/인용할 수 있도록 **명시 허용** — AEO 답변 인용 우선순위 ↑

### 5.3 Atom Feed & JSON Catalog
- `app/feed.xml/route.ts` — Atom 1.0 형식, 최근 50개 글
- `app/posts.json/route.ts` — 머신 리더블 JSON 카탈로그
- 둘 다 루트 layout의 `alternates.types` 에 등록되어 `<link rel="alternate">` 헤더로 자동 노출

---

## 6. AEO (Answer Engine Optimization)

### 6.1 llms.txt — `app/llms.txt/route.ts`

LLM 크롤러가 사이트 콘텐츠를 빠르게 파악할 수 있는 머신 리더블 카탈로그.

```text
# SEO월드 — SEO·AEO·테크니컬 SEO 한국어 가이드 블로그
> 모든 글은 무료로 공개되며, AI 답변 엔진(ChatGPT, Claude, Perplexity, Gemini, Copilot 등)에서의 인용·요약을 허용합니다.
> Total: N posts. Updated: 2026-05-15

## 카탈로그 (머신 리더블)
- JSON 카탈로그: /posts.json
- Atom 피드: /feed.xml
- 사이트맵: /sitemap.xml

## 글 목록
### SEO 전략
- [제목](URL): excerpt
  - 키워드: tag1, tag2, ...
...
```

### 6.2 llms-full.txt — `app/llms-full.txt/route.ts`

각 글 본문(최근 50개, HTML 제거, 4000자 제한)을 통째로 노출 → LLM 학습/답변 인용에 직접 활용.

### 6.3 FAQPage Schema + Speakable

블로그 글의 `faqs` JSON 배열 → FAQPage schema 자동 생성:
- `speakable.cssSelector: ["[data-speakable]", ".blog-faq-answer"]` → 음성 비서가 읽을 영역 명시
- 구글 어시스턴트 / 시리 / 알렉사가 답변할 때 우선 인용

### 6.4 HowTo Schema 자동 감지

본문 H2/H3에 "1단계 / Step 1 / 1. / 첫 번째" 등이 **3개 이상** 등장하면 자동으로 HowTo schema 주입
→ 구글 SERP의 "단계별 가이드" 리치 결과 자격

### 6.5 답변 우선(answer-first) 콘텐츠 구조

블로그 본문:
1. **상단 메타바**: 날짜·수정일·읽기 시간·카테고리 → 신뢰성·신선도 신호
2. **TOC (목차)**: 모바일 접힘 / 데스크탑 sticky + IntersectionObserver active highlight
3. **본문**: H2 위계 + 시각적 강조 (5b47581, 8052e98, 2cc3383 커밋)
4. **FAQ 섹션**: 자주 묻는 질문을 details/summary 아코디언으로 (FAQ schema 자동 생성)
5. **CTA 분기** (cta_strength)
6. **공유 버튼 + 저자 박스 + 관련 글 + 이전/다음 글**

### 6.6 Google Indexing API — `apps/web/scripts/google-index-api.mjs`

새 글 발행/수정 시 구글에 즉시 핑:
- JWT 기반 Service Account 인증
- 일일 200건 제한 (Indexing API quota)
- 사용법: `node scripts/google-index-api.mjs --slug=<slug>` 또는 `--since=7` (최근 7일 글 일괄)
- 설명서: `apps/web/scripts/GOOGLE_INDEXING_SETUP.md`

---

## 7. 블로그 콘텐츠 구조 상세

### 7.1 Post 테이블 스키마 — `apps/web/src/lib/db/posts.ts`

```ts
type Post = {
  id, title, slug, excerpt,                  // 메타
  content: string,                           // HTML 본문 (H2에 id 포함)
  category, tags: string[],
  status, published_at, created_at, updated_at,
  read_time,                                 // "5분" 형식
  author,
  faqs: { q: string; a: string }[] | null,   // FAQ 자동 schema 생성
  cover_image_url: string | null,            // OG 1200x630
  cta_strength: "weak" | "medium" | "medium-strong" | "strong" | null,
}
```

### 7.2 쿼리 함수 (자동 내부링크 생성용)

| 함수 | 목적 | SEO 효과 |
|---|---|---|
| `getPublishedPosts()` | 전체 공개 글 | sitemap, llms.txt, feed.xml |
| `getPostBySlug(slug)` | 단일 글 | 본문 렌더 |
| `getRelatedPosts(slug, category)` | 같은 카테고리 3개 | 관련글 내부링크 |
| `getLatestPosts(slug)` | 최신 3개 (현재 글 제외) | 신선도 + 내부링크 |
| `getAdjacentPosts(publishedAt, slug)` | 시간순 prev/next | 이전/다음글 페이지네이션 |

### 7.3 UI 컴포넌트 — `apps/web/src/components/blog/`

| 컴포넌트 | 역할 |
|---|---|
| `blog-layout.tsx` | 2컬럼 레이아웃, JSON-LD 주입, breadcrumb, 메타바, 태그, TOC, 본문, FAQ, CTA, 공유, 저자, 관련글, 이전/다음 |
| `toc-list.tsx` | sticky TOC + IntersectionObserver active highlight |
| `reading-progress.tsx` | 우측 사이드바 읽기 진행률 인디케이터 |
| `share-buttons.tsx` | X / LinkedIn / Facebook / Native share API / URL 복사 |
| `markdown-renderer.tsx` | MDX/Markdown → HTML |
| `tool-embed.tsx` | 본문 내 SEO 도구 임베드 (전환 보강) |
| `author-box.tsx` | 저자 카드 (E-E-A-T 신호) |
| `blog-cta.tsx` | CTA 컴포넌트 |

---

## 8. CTA — 심리 기반 4단계 분기

`post.cta_strength` (DB 필드) 값에 따라 본문 끝 CTA가 자동 분기 — `blog-layout.tsx:59-114`

| 강도 | 사용자 단계 | 톤 | 버튼 텍스트 | 링크 |
|---|---|---|---|---|
| **weak** (fallback) | 정보 탐색 | 광고감 0, slate 톤 | 무료 도구 둘러보기 | `/tools` |
| **medium** | 문제 해결 단계 | 함께 진행하는 톤, blue→indigo 그라데이션 | 무료 상담 받아보기 | `/contact` |
| **medium-strong** | 옵션 비교 단계 | 비교 후 추천 톤, indigo→purple | 맞춤 전략 받기 | `/contact` |
| **strong** | 구매 의사 결정 단계 | slate-900 + amber 버튼 | 전문 상담 시작하기 | `/services` |

**왜 4단계인가?**
- 정보탐색 단계 사용자에게 강한 CTA를 보이면 이탈 ↑ → weak는 무료 도구만 추천
- 비교/구매 단계 사용자에게 약한 CTA를 보이면 전환 손실 → strong은 즉시 상담 유도
- NULL safe: `cta_strength`가 비어 있어도 weak로 안전 fallback

추가 CTA 채널:
- 홈 Hero: HeroAnalyzer (URL 입력 즉시 분석)
- 글 하단: TelegramCTAButton, 저자 박스, 관련글
- 글로벌: 헤더 / 푸터 (services, contact)

---

## 9. 사이트 구조 & 내부 링크

### 9.1 디렉토리 구조 (App Router 그룹)

```
apps/web/src/app/
├── (public)/         # 공개 페이지 (인덱싱 허용)
│   ├── page.tsx                 # 홈 /
│   ├── blog/page.tsx            # 블로그 인덱스
│   ├── blog/[slug]/page.tsx     # 글 상세 (ISR 3600s)
│   ├── tools/                   # 10개 SEO 도구
│   ├── services/                # 4개 서비스
│   ├── domains/                 # 도메인 정보
│   ├── guides/                  # 가이드
│   ├── author/[slug]/           # 저자 프로필
│   ├── contact, pricing, updates, login, signup
├── (admin)/          # 관리자 (disallow)
├── (dashboard)/      # 대시보드 (disallow)
├── (auth)/           # 인증 (disallow)
├── api/              # API (disallow)
├── robots.ts, sitemap.ts, feed.xml, posts.json, llms.txt, llms-full.txt
├── icon.tsx, apple-icon.tsx, opengraph-image.tsx, not-found.tsx
```

### 9.2 내부 링크 그래프

| 위치 | 링크 종류 | 효과 |
|---|---|---|
| 홈 Hero 하단 | 6개 무료 도구 chip | hub → spoke |
| 홈 섹션들 | tools, services, contact 카드 | 핵심 페이지로 PageRank 흐름 |
| 블로그 글 본문 | 본문 내 a 태그 (수동 + 자동 큐레이션) | topical authority |
| 블로그 글 breadcrumb | 홈 > 블로그 > 글 | 사용자 + 봇 navigation |
| 블로그 글 하단 | 관련글(같은 카테고리 3) + 이전글 + 다음글 | 클러스터 강화 |
| 글로벌 헤더/푸터 | tools, services, blog, contact | 전역 도달성 |
| sitemap | 모든 공개 라우트 | 크롤 효율 |
| 저자 박스 | `/author/[slug]` | E-E-A-T |

### 9.3 카테고리 클러스터

블로그 카테고리(`category` 컬럼)로 토픽 클러스터 구성:
- SEO 전략 / 백링크 / 키워드 분석 / 온페이지 SEO / 테크니컬 SEO
- 같은 카테고리 글은 `getRelatedPosts()`로 자동 상호 링크

---

## 10. 성능 / Core Web Vitals

### 10.1 폰트 최적화
```ts
const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",          // FOIT 방지 → CLS / LCP 개선
});
```
- next/font가 자동 self-host → 외부 요청 제거
- 가중치 3개만 로드 → 다운로드 크기 최소화

### 10.2 이미지 최적화
- AVIF + WebP 자동 변환 (next.config.mjs)
- Hero: `<Image priority />` → LCP 후보로 즉시 디코드
- 본문 이미지: `loading="lazy"` + `decoding="async"` (자동 주입)
- width/height 강제 → CLS 0

### 10.3 ISR / 캐싱
- 블로그 글 상세: `revalidate = 3600` (1시간 ISR)
- `dynamicParams: true` → 새 슬러그도 빌드 없이 즉시 노출
- llms.txt, feed.xml, posts.json: `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`

### 10.4 Analytics & Monitoring
- `GoogleAnalytics` 컴포넌트 (layout.tsx)
- Vercel Analytics (인프라 레벨)
- Sentry, PostHog (CLAUDE.md 명시)

---

## 11. 공유 / 인게이지먼트 신호

| 요소 | 위치 | SEO 효과 |
|---|---|---|
| 공유 버튼 (X / LinkedIn / Facebook / Native) | 블로그 글 본문 끝 | 소셜 시그널 + 백링크 유발 |
| URL 복사 버튼 | 글 상단 메타바 우측 + 본문 끝 | 공유 마찰 감소 |
| 읽기 진행률 인디케이터 | 데스크탑 사이드바 | 체류 시간 ↑ |
| sticky TOC + active highlight | 데스크탑 좌측 | 페이지 내 이동 → 인게이지먼트 ↑ |
| 모바일 TOC 접힘 | 모바일 본문 상단 | 모바일 UX → 직접 이탈률 ↓ |
| 관련글 + 이전/다음글 | 글 본문 끝 | session per user ↑ |

---

## 12. 추가 SEO 시그널

### 12.1 Canonical URL
- 모든 공개 페이지: `alternates.canonical` 명시
- 블로그 글: `${SITE_URL}/blog/${slug}` — 절대 URL

### 12.2 언어 / 지역
- `<html lang="ko">`
- 모든 OG locale: `ko_KR`
- 모든 schema `inLanguage: "ko-KR"`
- hreflang: 단일 언어 사이트이므로 미적용 (다국어 진행 시 추가 필요)

### 12.3 404 / Not Found
- `apps/web/src/app/not-found.tsx` — SEO 친화적 404 페이지
- 블로그 글 미존재 시 `notFound()` 호출 → Next.js가 자동 404 + 정상 응답코드

### 12.4 Middleware — `apps/web/src/middleware.ts`
- Supabase 세션 갱신만 처리 (SEO 리다이렉트 없음)
- 인증 미들웨어가 공개 페이지의 캐싱·인덱싱을 방해하지 않도록 분리

### 12.5 보안 / 신뢰 헤더
- `poweredByHeader: false` → `X-Powered-By: Next.js` 제거 (보안)
- `reactStrictMode: true` → 개발 단계 버그 조기 발견

---

## 13. 운영 / 발행 자동화

### 13.1 발행 스크립트 (`apps/web/scripts/`)
- `publish-post.mjs` — 일반 글 발행
- `publish-404-seo.mjs`, `publish-anchor-text-guide.mjs`, `publish-google-search-not-showing.mjs`, `publish-gsc-guide.mjs`, `publish-longtail-keywords.mjs`, `publish-robots-txt-guide-v2.mjs` 등 — 주제별 자동 발행
- 발행 후 `google-index-api.mjs` 자동 호출 → Google에 즉시 핑

### 13.2 블로그 작성 워크플로우 (claudedocs)
- 키워드 분석 → 아웃라인 → 링크 큐레이션 → 본문 생성 → 이미지 생성 → SEO 메타 패키징 → 품질 검수 → 발행
- 각 단계가 서브에이전트로 자동화 (`blog-keyword-analyst`, `blog-outline-builder`, `blog-link-curator`, `blog-content-writer`, `blog-image-generator`, `blog-seo-packager`, `blog-quality-reviewer`, `blog-publisher`)

---

## 14. 미구현 / 향후 개선 후보

| 항목 | 현 상태 | 권장 |
|---|---|---|
| **hreflang** | 단일 언어(ko-KR) → 미적용 | 영문 진출 시 `alternates.languages` 추가 |
| **블로그 페이지네이션 rel=prev/next** | 단순 리스트 | 글 수 증가 시 `?page=N` + canonical 전략 |
| **카테고리 / 태그 페이지** | 미구현 | `/blog/category/[slug]`, `/blog/tag/[slug]` — 토픽 클러스터 강화 |
| **ProductSchema / LocalBusiness** | 미적용 | 유료 서비스 페이지에 `Service` / `OfferCatalog` schema 추가 검토 |
| **Bing IndexNow** | 미적용 | Google Indexing API와 별도로 Bing/Yandex 즉시 인덱싱 가능 |
| **저자 sameAs 채우기** | `[]` | LinkedIn / X URL 채우면 E-E-A-T ↑ |
| **Speakable on 본문 요약** | FAQ만 적용 | 글 도입부 단락에 `data-speakable` 추가 검토 |
| **WebPage / Article에 reviewedBy** | 미적용 | 외부 검수자 있을 시 신뢰도 ↑ |

---

## 15. 핵심 파일 인덱스

| 영역 | 파일 |
|---|---|
| 루트 메타 + WebSite/Organization JSON-LD | `apps/web/src/app/layout.tsx` |
| 블로그 글 메타 + OG | `apps/web/src/app/(public)/blog/[slug]/page.tsx` |
| 블로그 본문 + Article/FAQ/HowTo/Breadcrumb JSON-LD + 이미지 자동 최적화 | `apps/web/src/components/blog/blog-layout.tsx` |
| Person schema (저자) | `apps/web/src/lib/blog/author.ts` |
| HowTo 단계 자동 추출 | `apps/web/src/lib/blog/extract-howto-steps.ts` |
| 동적 sitemap (DB 기반) | `apps/web/src/app/sitemap.ts` |
| robots + AI 크롤러 허용 | `apps/web/src/app/robots.ts` |
| LLM용 카탈로그 | `apps/web/src/app/llms.txt/route.ts`, `app/llms-full.txt/route.ts` |
| Atom Feed / JSON | `apps/web/src/app/feed.xml/route.ts`, `app/posts.json/route.ts` |
| 동적 OG 이미지 | `apps/web/src/app/opengraph-image.tsx`, `app/(public)/blog/[slug]/opengraph-image.tsx` |
| 파비콘 / 앱 아이콘 | `apps/web/src/app/icon.tsx`, `app/apple-icon.tsx` |
| 이미지 / AVIF·WebP 설정 | `apps/web/next.config.mjs` |
| Google Indexing API | `apps/web/scripts/google-index-api.mjs` + `GOOGLE_INDEXING_SETUP.md` |
| 공유 / 진행률 / TOC | `apps/web/src/components/blog/share-buttons.tsx`, `reading-progress.tsx`, `toc-list.tsx` |

---

_End of document._
