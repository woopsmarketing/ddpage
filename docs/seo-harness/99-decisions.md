# 결정 기록 (Architectural Decisions)

> 본 하네스 설계 과정에서 합의된 결정 사항과 그 이유.
> 새 결정은 표에 추가하고 충돌하는 과거 결정은 "Superseded"로 표시.

---

## 결정 일람표

| # | 일자 | 주제 | 결정 | 대안 | 이유 |
|---|---|---|---|---|---|
| D-01 | 2026-05-19 | 동적 `[slug]` 라우트 처리 | **A안**: `app/portfolio/[slug]/page.tsx` 삭제 + 8개 하드코딩 유지 + `lib/portfolios.ts`를 단일 진실 소스(SoT)로 | B: 동적 라우트로 통합 / C: 그대로 두기 | 8개 포트폴리오는 각각 독립적 디자인. 동적 통합 실익 없음. `[slug]` 스텁은 잘못된 슬러그 접근 시 404 막아서 색인 사고 위험 |
| D-02 | 2026-05-19 | `'use client'` 페이지 메타데이터 처리 | **B안**: 서버 `page.tsx` + 클라이언트 `<Name>Client.tsx` 분리 | A: 라우트별 `layout.tsx`에 메타 선언 | 유지보수 관점 정석. 메타/UI 책임 분리. JS 번들 감소. 향후 ClientConfig 자동 메타 생성 패턴 확장 용이 |
| D-03 | 2026-05-19 | 페이지별 OG 이미지 | **동적 OG 라우트**: `app/og/route.tsx` 단일 + 각 페이지 메타에서 query로 호출 | 라우트마다 `opengraph-image.tsx` 별도 생성 | 디자인 변경 시 한 곳만 수정. 클라이언트 사이트도 동일 패턴 재사용 |
| D-04 | 2026-05-19 | 다국어 | **ko 단일** | en 추가 | ddpage 타겟이 한국 1인 사업자. 1차 미적용. `ClientConfig.locale` 자리만 예비 |
| D-05 | 2026-05-19 | 멀티테넌트 라우팅 | **미들웨어 + host 헤더** (1차엔 ddpage만, v2에서 클라이언트 라우트 추가) | 별도 Vercel 프로젝트 | 같은 코드베이스/하네스 재사용. Vercel + Edge Middleware 정석 패턴. SEO에 유리 (호스트별 별개 사이트 인식) |
| D-06 | 2026-05-19 | 클라이언트 사이트 라우트 구조 | **v2로 분리** — 1차는 ddpage 자체만 적용 | 지금 같이 설계 | 첫 고객 요구사항 보면서 결정하는 게 정확. 하네스 시그니처는 multi-host 준비됨 |
| D-07 | 2026-05-19 | JSON 런타임 검증 | **Zod 의존성 추가** | TS 타입만 사용 | 손으로 작성하는 JSON의 오타/누락을 빌드 시점에 명확한 에러로 잡음. 50명 후 Supabase 이전 시에도 재사용 |
| D-08 | 2026-05-19 | git 사전조건 정책 | **Loose**: 추적 파일만 클린 체크 (`git diff --quiet && git diff --cached --quiet`). untracked 허용 | Strict (untracked도 금지) / Skip (검사 없음) | 평소 작업 흐름 방해 안 함. untracked 명세/스펙 파일이 많은 실제 상태와 맞음 |
| D-09 | 2026-05-19 | 한국어 폰트 | **`Noto Sans KR`** (`display: "swap"`, weight 400/500/700) | `Geist` 유지 | ddpage 콘텐츠 거의 한국어. 가독성/CWV/SEO 직결 |
| D-10 | 2026-05-19 | `businessTypeMeta` 정합성 | **외부 `businessType` 필드와 cross-check** (loader에서 superRefine) | 내부 discriminator(`kind` 필드) | 사용자가 같은 정보 두 번 입력 안 해도 됨. JSON 작성 부담 ↓ |
| D-11 | 2026-05-19 | `HOWTO_MIN_STEPS` | **`3`** | 2 / 4 / 5 | schema.org/Google 권장 최소치. 1-2단계는 리치 스니펫 부적격 |
| D-12 | 2026-05-19 | ISR revalidate | **`3600`초** (1시간) | 더 짧게 / 더 길게 | 콘텐츠 변경 빈도 낮음. SEO월드 사례 참조. llms.txt 등 cache 헤더와 동일 |
| D-13 | 2026-05-19 | localhost 개발 시 슬러그 결정 | **`NEXT_PUBLIC_DEFAULT_SLUG` 환경변수** | 하드코딩 / 자동 추론 | 클라이언트 화면 미리보기 시 환경변수 한 줄 변경 |
| D-14 | 2026-05-19 | 페이지 메타 API 형식 | **`generateMetadata` async 함수** 통일 | 정적 `metadata` 객체 | 1차 ddpage엔 약간 오버킬이나 v2 멀티테넌트에서 `resolveClient(headers)` 호출 가능. 일관성 |
| D-15 | 2026-05-19 | 클라이언트 컴포넌트 파일명 | **PascalCase + "Client"** (`LeadLandingClient.tsx`) | `<name>.client.tsx` | import 이름과 파일명 일치. IDE 친화적. Next.js 커뮤니티 흔한 패턴 |
| D-16 | 2026-05-19 | 명세 산출물 형식 | **`docs/seo-harness/` 디렉토리에 분리 `.md` 파일** | 단일 파일 / 미작성 | 세션 간 영속성. 6개월 뒤 추적 가능. 다른 협업자 자산 |
| D-17 | 2026-05-19 | 에이전트 명세 위치 | **`.claude/agents/` 및 `.claude/commands/`에 직접 작성** (명세 = 런타임 실행 파일) | 명세는 `docs/`에, 런타임은 `.claude/`에 분리 / 단일화 안 함 | 단일 출처 (한 곳만 관리). 결정 근거는 99-decisions.md에 분리 보관. 사용자 멘탈 모델 단순 |
| D-18 | 2026-05-20 | FAQPage schema 주입 방식 | **page-owns-data 패턴** — schema-agent 자동 주입 제거. 페이지가 자기 FAQ 데이터를 `faqSchema(faq)`로 직접 박음. faqSchema 시그니처도 `(faq: FAQ[])`로 단순화. Speakable cssSelector 도 함께 제거. | 자동 주입 유지 + `config.faq=[]`로 비우기 / Speakable cssSelector 변경 | 라이브에서 발견된 위반: ddpage.json 의 8개 FAQ 가 모든 페이지에 박혔는데 페이지 본문엔 그 FAQ 없음 → Google 가이드라인 위반(Spammy structured data). 데이터 소스를 페이지로 옮기면 화면 + schema 동기화 자동 보장. Speakable cssSelector 도 페이지 DOM 매치 안 되는 경고 발생 → 함께 제거. |
| D-19 | 2026-05-20 | 클라이언트 사이트 라우트 구조 | **`app/(client)/<slug>/page.tsx`** — Route Group `(client)` 사용해 URL에 영향 없이 그룹화. `/client-integrate <slug>` 가 매 클라이언트마다 정적 폴더 생성. 동적 `[slug]` 미사용 (D-01과 동일 철학: 동일 디자인 강요 안 함). | `app/(client)/[slug]/page.tsx` 단일 동적 라우트 / `app/<slug>/page.tsx` 그룹 없음 | 각 클라이언트가 독립 디자인 (포트폴리오 8개와 같은 철학). Route Group `(client)`로 메인 사이트 라우트(`/portfolio`, `/order` 등)와 시각적 분리. 메인 도메인에서 `ddpage.kr/<slug>`로 직접 접근도 동시에 가능 (개발/미리보기 편리). |
| D-20 | 2026-05-20 | 호스트 → 라우트 라우팅 | **신규 `proxy.ts`** (Next.js 16에서 middleware → proxy 명칭 변경) — host 헤더 → `hostnameToSlug()` → rewrite to `/<slug>/*`. 메인 도메인(`ddpage.kr` / `www.ddpage.kr`)은 rewrite 없이 통과. | 기존 lib/seo/loader.ts의 `resolveClient(headers)` 패턴만으로 처리 / Next.config rewrites 사용 | `resolveClient`는 ClientConfig만 로드 — 라우트 자체를 다른 폴더(`app/(client)/<slug>/`)로 보내려면 rewrite 필요. proxy.ts가 정석. `next.config.ts` rewrites는 동적 host 매칭이 약함 (정적 host만 매핑 가능). |
| D-21 | 2026-05-20 | 클라이언트 통합 워크플로우 | **`/client-integrate <slug> <source-folder>` 슬래시커맨드** — 신규. 6단계 (사전검증/페이지변환/에셋이동/ClientConfig생성/seo-apply자동호출/검증보고). 신규 에이전트는 `client-intake` 1개만 작성, 기존 7개 SEO 에이전트 + `page-converter`(Mode D 추가) + `validator` 적극 활용. | 매 클라이언트마다 수동 통합 / `/portfolio-integrate` 재사용 | `/portfolio-integrate`는 포트폴리오용(`app/portfolio/<slug>/`)이라 출력 경로/메타/JSON-LD 자리 모두 다름. 분리가 정석. 신규 작성은 client-intake 1개로 최소화 — 기존 라우트 무관 원칙(D-01) 덕분에 SEO 에이전트는 코드 한 줄도 안 건드림. |
| D-22 | 2026-05-21 | sitemap.ts 호스트 필터링 | **`discoverRoutes(slug)`** — 메인 호스트(ddpage)는 `app/(client)/*` 제외, 클라이언트 호스트는 본인 `app/(client)/<slug>/*` 만 포함하고 URL 에서 슬러그 prefix 제거 (proxy.ts rewrite 와 일치). | 모든 호스트가 동일 평탄 라우트 출력 / robots.txt 로 클라이언트 라우트 차단 | testclient dry-run 에서 발견: 메인 sitemap 에 `/testclient` 가 누출되고 testclient sitemap 에 ddpage 메인 라우트가 박힘 → 중복 색인 위험. SEO 측면에서 호스트별 sitemap 격리가 정석. |
| D-23 | 2026-05-21 | layout.tsx 호스트 분기 | **`resolveClient(await headers())`** 사용 (sitemap.ts 와 동일 패턴). `ROOT_SLUG="ddpage"` 하드코딩 제거. `export const dynamic = "force-dynamic"` 추가. | `ROOT_SLUG` 유지하고 클라이언트 도메인은 layout 별도 분기 / static rendering 우선 | testclient dry-run 에서 발견: 클라이언트 호스트 접속 시 `<html>` 루트 metadata + WebSite/Organization JSON-LD 가 ddpage 브랜드로 박힘 → 페이지 단 메타와 split. 멀티테넌트 핵심 결함. |
| D-24 | 2026-05-21 | proxy.ts 글로벌 라우트 보호 | **`RESERVED_GLOBAL_ROUTES`** 명시 목록 (sitemap.xml, robots.txt, llms.txt, llms-full.txt, og, icon, apple-icon, favicon.ico) → proxy 가 첫 번째로 체크하고 통과시킴. | matcher 정규식에 모두 추가 / og 같은 query 파라미터 라우트는 정규식 매칭 까다로움 | testclient.ddpage.kr 라이브 검증에서 발견: `<slug>.ddpage.kr/sitemap.xml` 이 `/<slug>/sitemap.xml` 로 rewrite 되어 404. 이 라우트들은 모두 host header 로 자체 분기하므로 proxy 가 건드리면 안 됨. matcher 보다 본문 명시 체크가 디버깅 쉽고 query 파라미터 라우트(`/og?title=...`) 도 안전. |
| D-25 | 2026-05-21 | Pretendard 폰트 self-host | **`next/font/local` + `public/fonts/PretendardVariable.woff2` (2MB Variable)** — `app/layout.tsx` 에서 `--font-pretendard` 로 노출. `app/main.css` 와 `app/(client)/*/styles.css` 의 jsDelivr CDN `@import` 제거. Montserrat / Plus Jakarta CDN 도 함께 제거 (시스템 폰트 fallback). | Pretendard Regular+Bold 2개 static 폰트 (~300KB) / CDN 유지 / Pretendard 제거 + Noto Sans KR 만 | testclient 라이브 PageSpeed 측정에서 LCP 26초 발견 → 원인: Pretendard 9개 weight 5MB 다운로드 (메인 ddpage.kr 도 동일). Variable 1개 = 2MB, 디자인 100% 유지, Vercel CDN 캐싱, 라이트하우스 점수 55 → 90+ 회복 기대. Self-host = 외부 CDN 의존 제거 + 브라우저 캐시 최적화. |

---

## 보류 또는 미결정 사항

| # | 주제 | 상태 |
|---|---|---|
| P-01 | `lucide-react` 버전 (`^1.16.0`) 정확성 | 빌드 단계에서 에러 나면 그때 처리 |
| P-02 | 클라이언트 사이트 라우트 구조 | v2로 분리 (D-06 참조) |
| P-03 | Atom Feed/posts.json | 블로그 추가 시 (현재 미적용) |
| P-04 | CTA `cta_strength` 4단계 분기 | v2 (블로그/콘텐츠 페이지 추가 시) |
| P-05 | Google Indexing API 자동 핑 | v2 (콘텐츠 빈발 갱신 발생 시) |
| P-06 | 페이지별 OG의 클라이언트별 테마 | 일단 `ClientConfig.ogImage.theme` 한 가지 사용 |
| ~~P-07~~ | ~~`/client-integrate` 슬래시커맨드~~ | **해제 (D-21)** |
| ~~P-08~~ | ~~클라이언트 사이트 라우트 구조 + 미들웨어 host 라우팅~~ | **해제 (D-19, D-20)** |
| P-09 | FAQPage Speakable 재활성화 (page-owns-data 패턴으로) | 음성 비서 인용이 비즈니스에 의미 있을 때. 페이지가 직접 SpeakableSpecification 박음. |
| P-10 | `/order` 폼 자동 전송 — Brevo (또는 Resend/Formspree) 연동 | 현재는 `mailto:vnfm0580@gmail.com` 방식 (사용자가 메일 앱 직접 send). 운영 시 불편하면 API route + 자동 전송으로 업그레이드. 파일 첨부도 그때 지원. |

---

## 변경 이력

- 2026-05-19: 본 문서 생성. D-01 ~ D-16 기록. P-01 ~ P-06 보류 사항 기록.
- 2026-05-20: D-18 (FAQPage page-owns-data), D-19 (`app/(client)/<slug>/`), D-20 (proxy.ts host 라우팅), D-21 (`/client-integrate` 워크플로우) 추가. P-07/P-08 해제.
- 2026-05-21: testclient dry-run 검증 후 v2 인프라 v1.1 패치 — D-22 (sitemap host 필터링), D-23 (layout host 분기) 추가. D-19/D-20 설계 의도와 실제 구현의 갭 보완.
- 2026-05-21: testclient.ddpage.kr 라이브 검증 후 v1.2 — D-24 (proxy.ts 글로벌 SEO 라우트 보호). `<slug>.ddpage.kr/sitemap.xml` 등 404 버그 fix.
- 2026-05-21: testclient.ddpage.kr PageSpeed 55점 진단 후 v1.3 — D-25 (Pretendard self-host via next/font/local). CDN @import 5MB 9 weight → public/fonts/PretendardVariable.woff2 2MB 1 file. LCP 26s → 목표 2.5s.
