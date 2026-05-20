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

---

## 변경 이력

- 2026-05-19: 본 문서 생성. D-01 ~ D-16 기록. P-01 ~ P-06 보류 사항 기록.
