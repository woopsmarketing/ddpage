# 실행 계획 (Execution Plan)

> 본 문서: 처음(설계 시작)부터 끝(`/seo-apply ddpage` 실행 가능 상태)까지 모든 단계를 구체적으로 기록.
> **갱신 시점**: 단계 완료 직후, 다음 단계 시작 전 (체크박스/상태 업데이트).
> **최종 갱신**: 2026-05-19

---

## 전체 흐름

```
[설계 — DESIGN]
  Phase 0~3-2 (완료)
       ↓
  Phase 3-3 ~ 3-6 (4개 에이전트 명세 — 병렬 dispatch)
       ↓
  Phase 4 (오케스트레이터 명세 — main thread, 직렬)
       ↓
[구현 — IMPLEMENTATION]
  Phase 5 (lib/seo/*.ts 4개 파일 + Zod 의존성)
       ↓
[실행 — EXECUTION]
  Phase 6 (사용자가 /seo-apply ddpage 실행)
```

---

## 진행 상태

| Phase | 상태 | 산출물 | 책임 |
|---|---|---|---|
| 0. 환경 파악 | ✅ | 프로젝트 구조 보고 | main thread |
| 1. 결정 합의 | ✅ | D-01 ~ D-17 (`99-decisions.md`) | 사용자 + main thread |
| 2. lib/seo 명세 | ✅ | `10-phase2-lib-seo.md` | main thread |
| 3-1. meta-agent | ✅ | `.claude/agents/seo-meta-agent.md` | main thread |
| 3-2. infra-agent | ✅ | `.claude/agents/seo-infra-agent.md` | main thread |
| 3-3. aeo-agent | ✅ | `.claude/agents/aeo-agent.md` | 서브에이전트 (병렬) |
| 3-4. cwv-agent | ✅ | `.claude/agents/seo-cwv-agent.md` | 서브에이전트 (병렬) |
| 3-5. schema-agent | ✅ | `.claude/agents/seo-schema-agent.md` | 서브에이전트 (병렬) |
| 3-6. validator-agent | ✅ | `.claude/agents/seo-validator-agent.md` | 서브에이전트 (병렬) |
| 4. orchestrator | ✅ | `.claude/commands/seo-apply.md` | main thread |
| 5. lib/seo 구현 | ✅ | `lib/seo/*.ts` 4개 + `package.json`(zod) | main thread |
| **6. 1차 실행** | ⏳ **사용자 차례** | `npm install` → `/seo-apply ddpage` | 사용자 |

---

## Phase 3-3 ~ 3-6 — 병렬 dispatch 명세

### 호출 패턴
- **단일 메시지 안에 4개 Agent 도구 호출** (parallel)
- 각 에이전트: `subagent_type=general-purpose`, fresh context
- 각 에이전트가 받는 입력:
  1. 4개 reference 파일 경로 (먼저 읽기)
  2. 자기 에이전트의 책임/범위/금지 영역
  3. 출력 파일 경로
  4. 보고 형식

### 4개 에이전트의 역할 + 파일 소유권

| Agent | 책임 | 소유 파일 (생성/수정) |
|---|---|---|
| **aeo-agent** | AI 답변엔진 노출 최적화 | `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `docs/seo-harness/aeo-content-guide.md` |
| **seo-cwv-agent** | Core Web Vitals (Noto 폰트, 이미지 최적화 가이드) | `app/layout.tsx` (font 부분만), `docs/seo-harness/cwv-image-guide.md` |
| **seo-schema-agent** | JSON-LD 9종 + 사업 분류 6분기 | `lib/seo/schemas/*.ts`, `components/JsonLd.tsx`, `app/layout.tsx` (JsonLd 주입), `app/**/page.tsx` (페이지별 JsonLd) |
| **seo-validator-agent** | 최종 검증 (read-only) | (없음 — 검사만) |

### 충돌 회피 — 같은 파일을 여러 에이전트가 건드리는 경우

`app/layout.tsx`를 건드리는 에이전트가 3개:
- **meta-agent**: `<html lang>`, `generateMetadata`, 메타 객체 본체
- **cwv-agent**: font import + `<html className>`
- **schema-agent**: `<JsonLd data={...} />` 삽입

→ Phase 4 (orchestrator)에서 **순차 실행**으로 해결:
```
1) meta-agent (layout.tsx baseline 확보)
   ↓
2) 병렬: infra-agent, aeo-agent (layout.tsx 미접촉)
   ↓
3) cwv-agent (layout.tsx font 추가)
   ↓
4) schema-agent (layout.tsx + page.tsx JsonLd 주입)
   ↓
5) validator-agent (최종 검증)
```

이 순서는 Phase 4 orchestrator 명세에 박힘. **Phase 3 (스펙 작성)은 이 순서와 무관하게 4개 동시 가능**.

---

## Phase 4 — 오케스트레이터 (`.claude/commands/seo-apply.md`)

### 처리 흐름 (slash command 본문)
```
인자: <slug> (예: "ddpage")
사전 조건 검사:
  1. config/clients/<slug>.json 존재
  2. git diff --quiet && git diff --cached --quiet (D-08 Loose)
  3. lib/seo/* 4개 파일 존재 (없으면 안내)

병렬/직렬 실행:
  Stage 1: seo-meta-agent (직렬)
  Stage 2: 병렬 [seo-infra-agent, aeo-agent]
  Stage 3: seo-cwv-agent (직렬)
  Stage 4: seo-schema-agent (직렬)
  Stage 5: seo-validator-agent (직렬)

각 에이전트는 fresh context (Task tool 호출)
실패 시 즉시 중단 + 보고 (자동 롤백 없음)

최종 보고 + git add/commit/push 안내 (자동 commit 여부 — 결정 필요)
```

### 결정 필요 사항 (Phase 4 작성 시)
- 자동 commit 여부 (자동 vs 안내만)
- 실패 시 부분 적용된 파일 처리 (git checkout 안내 또는 그대로 두기)

---

## Phase 5 — lib/seo 구현

### 4개 파일 (병렬 작성 가능)
- `lib/seo/constants.ts` — 명세 그대로 (외부 의존 0)
- `lib/seo/types.ts` — Zod 스키마 + `z.infer` 타입
- `lib/seo/loader.ts` — `loadClient`, `resolveClient`, 캐시
- `lib/seo/helpers.ts` — 8개 함수 (siteUrl, canonicalUrl, ogImageUrl, optimizeContentImages, calcWordCount, detectHowToSteps, isAiCrawler, buildSameAs, buildBreadcrumb, buildPageMetadata)

### 의존성 추가
- `package.json`에 `zod` 추가
- 사용자가 `npm install` 실행 필요 → Phase 5 종료 후 안내

### 작성 방식
- main thread 또는 4개 서브에이전트 병렬
- 결정: **main thread** (specs가 구체적이라 의문의 여지 적음, 일관성 우선)

---

## Phase 6 — 사용자가 실행

```bash
# 1. (Phase 5에서 zod 추가됐다면) 의존성 설치
npm install

# 2. SEO 하네스 실행
/seo-apply ddpage

# 3. 결과 확인
git diff
git status
# OK면 자동 commit/push (오케스트레이터가 안내)

# 4. 로컬에서 빌드 확인
npm run build

# 5. Vercel에 푸시되면 https://ddpage.kr 에서 라이브 검증
```

### 라이브 검증 (별도 작업, 이번 작업 범위 밖)
- Google Rich Results Test
- Schema.org Validator
- Google Search Console verification
- Naver Webmaster verification
- `/seo-verify` 슬래시커맨드 (v2)

---

## 할루시네이션 방지 정책

본 하네스 설계 + 실행 전반에 적용:

1. **fresh context per agent**: 각 서브에이전트는 자기 호출 시점에 필요한 reference 파일만 읽음. 다른 에이전트의 출력에 의존하지 않음 (orchestrator가 데이터 전달).
2. **결정 사항 명시 참조**: 모든 에이전트가 `99-decisions.md`를 먼저 읽음. 결정은 `D-XX` 식별자로 인용.
3. **파일 소유권 명확**: 각 에이전트가 *자신의 영역*만 수정. 다른 영역 접근 시 즉시 중단.
4. **멱등성 검사 우선**: 적용 전 기존 상태 확인. 이미 적용된 영역은 skip.
5. **자동 롤백 없음 (D-08)**: 실패 시 사용자에게 git diff로 위임 → 자동으로 잘못된 결정 후속 처리 안 함.

---

## 변경 이력

- 2026-05-19: 본 문서 생성. Phase 3-1, 3-2 완료. Phase 3-3 ~ 6 계획 확정.
