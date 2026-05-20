# SEO/AEO 하네스 — 전체 개요

> **상태**: 설계(명세) 단계 진행 중. Phase 3-1까지 합의 완료.
> **최종 갱신**: 2026-05-19
> **목표**: 뚝딱페이지(ddpage.kr) 및 모든 클라이언트 사이트에 SEO/AEO를 단일 명령어(`/seo-apply <slug>`)로 적용하는 재사용 가능한 자동화 하네스.

---

## 1. 비즈니스 컨텍스트

뚝딱페이지는 월 14,900원 랜딩페이지 호스팅 SaaS. 운영 흐름:

```
[마케팅]
  ddpage.kr (메인) — 8개 포트폴리오 샘플 노출 → 잠재 고객 유입
       ↓ 검색/추천
[고객 컨택]
  고객: "lead 유형으로, 색상 코럴, 우리 사업은 OO입니다"
       ↓
[정보 수령]
  고객 → 이미지 + 콘텐츠 텍스트 → 운영자에게 전달
       ↓
[디자인 제작]
  운영자가 Claude Design(claude.ai)에 콘텐츠 + 톤 던지기 → React/HTML 출력
       ↓
[로컬 통합]
  운영자 → /portfolio-integrate <폴더> <슬러그> <유형> → 프로젝트 통합
       ↓
[서브도메인 셋업]
  Vercel에 client1.ddpage.kr 연결 + 미들웨어가 host 헤더 라우팅
       ↓
[SEO/AEO 적용]  ← ★ 본 하네스가 담당
  운영자 → /seo-apply client1 → 메타/스키마/sitemap/robots/llms.txt 자동 주입
       ↓
[라이브 + 수익]
  client1.ddpage.kr 검색 노출 시작 → 월 14,900원 구독
```

하네스의 핵심 원칙:
1. **라우트 무관 (route-agnostic)** — 포트폴리오든 고객 사이트든 어떤 라우트에든 적용 가능
2. **사업 분류 무관** — 6가지 분류(local-business, professional, digital-product, event, brand, profile)에 따라 자동 분기
3. **재사용성** — 클라이언트 1명당 JSON 1개 작성 → 같은 하네스 재실행

---

## 2. 스택

- Next.js **16.2.6** (App Router, 기존 학습 데이터와 차이 있음 — `node_modules/next/dist/docs/` 참조 필수)
- React 19.2.4
- TypeScript 5
- Tailwind v4
- Vercel 배포 (와일드카드 `*.ddpage.kr` 도메인)
- 클라이언트 저장: JSON 파일 (`config/clients/<slug>.json`) — 50명 초과 시 Supabase 이전 예정

---

## 3. 파이프라인 6단계

| Phase | 상태 | 산출물 | 사용자 액션 |
|---|---|---|---|
| **0. 환경 파악** | ✅ 완료 | 프로젝트 구조 보고 | OK |
| **1. 결정 사항 합의** | ✅ 완료 | 16개 결정 (`99-decisions.md`) | OK |
| **2. lib/seo/ 명세** | ✅ 완료 | `10-phase2-lib-seo.md` | OK |
| **3-1. seo-meta-agent** | ✅ 완료 | `.claude/agents/seo-meta-agent.md` | OK |
| **3-2. seo-infra-agent** | ✅ 완료 | `.claude/agents/seo-infra-agent.md` | OK |
| **3-3. aeo-agent** | ✅ 완료 | `.claude/agents/aeo-agent.md` | OK |
| **3-4. seo-cwv-agent** | ✅ 완료 | `.claude/agents/seo-cwv-agent.md` | OK |
| **3-5. seo-schema-agent** | ✅ 완료 | `.claude/agents/seo-schema-agent.md` | OK |
| **3-6. seo-validator-agent** | ✅ 완료 | `.claude/agents/seo-validator-agent.md` | OK |
| **4. 오케스트레이터** | ✅ 완료 | `.claude/commands/seo-apply.md` | OK |
| **5. lib/seo 구현** | ✅ 완료 | `lib/seo/{constants,types,loader,helpers}.ts` + `package.json` (zod) | OK |
| **6. 1차 적용** | ⏳ **사용자 차례** | `npm install` → `/seo-apply ddpage` | 사용자가 직접 실행 |

> **명세 작성 위치 (D-17)**: 에이전트와 오케스트레이터는 *처음부터 `.claude/agents/` 및 `.claude/commands/`에 직접 작성*. 명세와 런타임 실행 파일을 통합. 결정 근거는 `99-decisions.md`에 분리 보관.

---

## 4. 적용 범위 (1차 vs v2)

### 1차 (지금 작업) — `ddpage.kr` 자체
- 대상 라우트: `/`, `/portfolio`, `/portfolio/{8개 슬러그}`, `/order`
- `app/portfolio/[slug]/page.tsx`(스텁) **삭제**
- 모든 클라이언트 컴포넌트 페이지는 **B안**으로 서버/클라이언트 분리
- `<html lang>` → `"ko"`로 교정
- 멀티테넌트 시그니처는 *준비만* (실제 구현은 v2)

### v2 (첫 클라이언트 받기 직전 — 별도 작업)
- 클라이언트 사이트 라우트 구조 결정 (예: `app/(client)/[slug]/page.tsx` + 미들웨어)
- 미들웨어가 host 헤더 보고 `client1.ddpage.kr → /(client)/client1` 라우팅
- `loadClient(slug)` → `resolveClient(headers)` 한 줄 변경으로 멀티테넌트 활성화
- Vercel 와일드카드 도메인 등록
- 클라이언트별 GSC/Naver Webmaster 속성 등록

### 본 하네스가 처리하지 *않는* 항목 (v2+ 별도 작업)
- 라이브 URL 크롤 검증 → `/seo-verify` 슬래시커맨드 (별도)
- Atom Feed / posts.json → 블로그 없으므로 미적용
- 공유 버튼/읽기 진행률/TOC → 블로그 페이지 전용
- CTA 4단계 분기(`cta_strength`) → v2
- Google Indexing API 자동 핑 → v2
- hreflang(다국어) → ko 단일이므로 미적용

---

## 5. 산출물 트리 (Phase 5 완료 후)

```
ddpage/
├── config/
│   └── clients/
│       └── ddpage.json                   (이미 작성됨)
├── lib/
│   ├── seo/
│   │   ├── constants.ts                  (Phase 5 생성)
│   │   ├── types.ts                      (Phase 5 생성)
│   │   ├── loader.ts                     (Phase 5 생성)
│   │   └── helpers.ts                    (Phase 5 생성)
│   └── portfolios.ts                     (seo-meta-agent 1회 생성)
├── app/
│   ├── layout.tsx                        (수정: 메타/lang)
│   ├── page.tsx                          (수정: metadata)
│   ├── og/route.tsx                      (생성: 동적 OG)
│   ├── sitemap.ts                        (생성)
│   ├── robots.ts                         (생성)
│   ├── llms.txt/route.ts                 (생성)
│   ├── llms-full.txt/route.ts            (생성)
│   ├── icon.tsx                          (생성)
│   ├── apple-icon.tsx                    (생성)
│   ├── not-found.tsx                     (생성)
│   ├── order/page.tsx                    (수정: metadata)
│   └── portfolio/
│       ├── page.tsx                      (수정: metadata)
│       └── {8 슬러그}/
│           ├── page.tsx                  (재작성: server + metadata)
│           └── <Name>Client.tsx          (생성: 기존 본문 이전)
├── next.config.ts                        (수정: AVIF/WebP, poweredByHeader)
├── .claude/
│   ├── commands/
│   │   └── seo-apply.md                  (생성: 오케스트레이터)
│   └── agents/
│       ├── seo-meta-agent.md             (생성)
│       ├── seo-infra-agent.md            (생성)
│       ├── aeo-agent.md                  (생성)
│       ├── seo-cwv-agent.md              (생성)
│       ├── seo-schema-agent.md           (생성)
│       └── seo-validator-agent.md        (생성)
└── docs/
    └── seo-harness/                      (이 문서들)
```

---

## 6. 관련 문서 인덱스

### 설계 문서 (`docs/seo-harness/`)
| 파일 | 내용 |
|---|---|
| `00-overview.md` | 본 문서 — 전체 개요 |
| `10-phase2-lib-seo.md` | Phase 2 — `lib/seo/` 4개 파일 명세 |
| `99-decisions.md` | 결정 기록 — 무엇을, 왜 선택했는지 |

### 에이전트 / 명령어 (`.claude/`) — 명세 겸 런타임 실행 파일
| 파일 | 내용 |
|---|---|
| `.claude/agents/seo-meta-agent.md` | Phase 3-1 |
| `.claude/agents/seo-infra-agent.md` | Phase 3-2 (예정) |
| `.claude/agents/aeo-agent.md` | Phase 3-3 (예정) |
| `.claude/agents/seo-cwv-agent.md` | Phase 3-4 (예정) |
| `.claude/agents/seo-schema-agent.md` | Phase 3-5 (예정) |
| `.claude/agents/seo-validator-agent.md` | Phase 3-6 (예정) |
| `.claude/commands/seo-apply.md` | Phase 4 (예정) — 오케스트레이터 |

### 참고 문서
| 파일 | 내용 |
|---|---|
| `../seo-harness-prompt.md` | 원본 프롬프트 (작업 지시서) |
| `../../SEO_AEO_IMPLEMENTATION.md` | 프로젝트 루트의 기존 가이드 (참고용) |
