---
description: ClientConfig(config/clients/<slug>.json)을 읽고 사이트 전체에 SEO/AEO 하네스를 적용한다. 6개 서브에이전트를 단계별로 호출해 메타데이터, JSON-LD, sitemap, robots, llms.txt, OG, 이미지 최적화, 최종 검증까지 자동 완료. 자동 commit/push는 하지 않으며 사용자가 git diff 확인 후 결정.
argument-hint: <slug>
---

# /seo-apply — SEO/AEO 하네스 적용

ClientConfig (`config/clients/$1.json`)을 읽고 사이트 전체에 SEO/AEO 요소를 자동 주입한다. 라우트 무관 — 어떤 사이트 구조든 작동.

설계 문서:
- `docs/seo-harness/00-overview.md` (전체 그림)
- `docs/seo-harness/PLAN.md` (실행 계획, 단계별 의존성)
- `docs/seo-harness/99-decisions.md` (결정 사항 D-01 ~ D-17)

## 인자

- `$1`: 클라이언트 슬러그 (예: `ddpage`, `client1`)

## 사전 조건 검사

다음 3가지를 먼저 확인. 하나라도 실패하면 즉시 중단 + 사용자 안내:

### (1) ClientConfig 존재
```bash
test -f config/clients/$1.json
```
없으면 → "❌ `config/clients/$1.json`이 없습니다. 먼저 작성하세요. 사업 분류는 `local-business`, `professional`, `digital-product`, `event`, `brand`, `profile` 중 하나."

### (2) lib/seo/* 4개 파일 존재 (Phase 5 구현 후)
```bash
test -f lib/seo/constants.ts && \
test -f lib/seo/types.ts && \
test -f lib/seo/loader.ts && \
test -f lib/seo/helpers.ts
```
없으면 → "❌ `lib/seo/*` 모듈이 누락되었습니다. Phase 5 구현이 안 됐습니다. `npm install` 후 다시 시도."

### (3) git 클린 (Loose — D-08)
```bash
git diff --quiet && git diff --cached --quiet
```
실패 시 → "❌ git 작업 트리에 추적되는 변경사항이 있습니다. `git stash` 또는 `git commit`으로 정리 후 다시 시도. (추적 안 된 파일은 OK)"

## 실행 단계

각 단계는 Task tool을 사용해 명시된 서브에이전트를 호출. 의존성에 따라 직렬/병렬 분기.

### Stage 1 — `seo-meta-agent` (직렬, 필수 선행)

```
Task(subagent_type="seo-meta-agent", prompt="slug=$1로 작업해라. 자세한 책임은 본인 시스템 프롬프트 참조.")
```

이 단계가 layout.tsx와 page.tsx 구조 baseline을 만든다. 후속 stage들이 이 출력에 의존하므로 반드시 먼저 완료되어야 한다.

산출 (예상):
- `app/layout.tsx` (metadata + `<html lang="ko">`)
- `app/**/page.tsx` (Case A: 메타 추가 / Case B: 서버·클라이언트 분리)
- `lib/portfolios.ts` (생성)
- `lib/seo/helpers.ts`에 `buildPageMetadata` 추가
- `app/portfolio/[slug]/page.tsx` 삭제 (D-01)

실패 시: 즉시 중단 + Stage 1 보고 출력 + "git diff로 부분 적용 확인 후 처리하세요. 자동 롤백 없음 (D-08)."

### Stage 2 — 병렬: `seo-infra-agent` + `aeo-agent`

서로 다른 파일을 건드리므로 병렬 안전. **단일 메시지 안에 Task 도구 2개를 동시 호출**한다.

```
Task(subagent_type="seo-infra-agent", prompt="slug=$1")
Task(subagent_type="aeo-agent", prompt="slug=$1")
```

산출 (예상):
- infra: `app/sitemap.ts`, `app/robots.ts`, `app/og/route.tsx`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/not-found.tsx`, `next.config.ts` (수정)
- aeo: `app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`, `docs/seo-harness/aeo-content-guide.md`

둘 중 하나라도 실패: 즉시 중단. 다른 하나가 성공했어도 부분 적용된 상태로 사용자에게 보고.

### Stage 3 — `seo-cwv-agent` (직렬)

```
Task(subagent_type="seo-cwv-agent", prompt="slug=$1")
```

산출:
- `app/layout.tsx` 폰트 부분 (Geist → Noto Sans KR, D-09)
- `docs/seo-harness/cwv-image-guide.md`

Stage 1의 `<html lang>`/metadata는 보존되어야 한다. 보존 실패 시 cwv-agent가 자체 검증으로 중단할 것.

### Stage 4 — `seo-schema-agent` (직렬)

```
Task(subagent_type="seo-schema-agent", prompt="slug=$1")
```

산출:
- `lib/seo/schemas/*` (15개 — 공통 7 + 사업분류 6 + index + dispatcher)
- `components/JsonLd.tsx`
- `app/layout.tsx`에 `<JsonLd data={[website, organization]} />` 주입
- `app/**/page.tsx`에 페이지별 JsonLd 주입

`ClientConfig.businessType`에 따라 6가지 분기. ddpage는 `digital-product`.

### Stage 5 — `seo-validator-agent` (직렬, read-only)

```
Task(subagent_type="seo-validator-agent", prompt="slug=$1")
```

산출: 검증 보고만 (파일 수정 없음). 10개 검사 항목.

- TypeScript 빌드 (npx tsc --noEmit)
- 메타데이터 존재
- JSON-LD 문법
- sitemap 라우트 일치
- robots AI 크롤러 목록
- lib/seo/* 파일 존재
- ClientConfig 검증 (loadClient 호출)
- `<html lang="ko">`
- next.config.ts 옵션
- JsonLd 컴포넌트 server-only

## 최종 보고

모든 단계 완료 후 사용자에게 다음 형식으로 출력:

```
═══════════════════════════════════════════════════
✅ SEO/AEO 하네스 적용 완료: $1
═══════════════════════════════════════════════════

[Stage별 산출물]
Stage 1 (meta):     app/layout.tsx + N개 page.tsx + lib/portfolios.ts
Stage 2 (infra):    sitemap.ts, robots.ts, og/route.tsx, icon, apple-icon, not-found, next.config.ts
Stage 2 (aeo):      llms.txt/route.ts, llms-full.txt/route.ts, aeo-content-guide.md
Stage 3 (cwv):      layout.tsx 폰트(Noto Sans KR), cwv-image-guide.md
Stage 4 (schema):   lib/seo/schemas/× 15, components/JsonLd.tsx, layout.tsx + N개 page.tsx에 JsonLd 주입

[검증 결과 — validator-agent 보고]
<validator 보고 그대로 삽입>

[git status]
<git status --short 출력>

[다음 단계 — 사용자가 직접]
1. git diff로 변경 확인
2. 빌드 검증: npm run build
3. OK면 커밋·푸시:
   git add .
   git commit -m "feat: apply SEO/AEO harness to $1"
   git push

[참고]
- 라이브 검증 (Google Rich Results Test, Schema.org Validator)은 별도로 실행.
- Google Search Console / Naver Webmaster 속성 등록 필요 (수동).
═══════════════════════════════════════════════════
```

**자동 git commit/push는 하지 않는다** (D-08). 사용자가 `git diff` 확인 후 직접 결정.

## 실패 처리

어떤 stage라도 실패하면:

1. 즉시 중단 — 후속 stage 실행 안 함
2. 실패 보고:
   ```
   ═══════════════════════════════════════════════════
   ❌ SEO/AEO 하네스 적용 실패: $1
   ═══════════════════════════════════════════════════

   실패 단계: Stage <N> — <agent-name>
   에러: <에이전트가 보고한 에러 그대로>

   [부분 적용된 파일]
   git status --short 출력

   [복구 옵션]
   A) 변경 그대로 두고 수동 조사 (권장):
      git diff
      git status

   B) 부분 적용 롤백 (커밋 안 된 변경만):
      git checkout -- .
      git clean -fd lib/seo/schemas/ components/ app/og/ app/llms.txt/ app/llms-full.txt/

   자동 롤백 없음 (D-08).
   ═══════════════════════════════════════════════════
   ```
3. 사용자 결정 대기.

## 절대 하지 말 것

- **자동 git commit / push** (사용자만 결정)
- **실패 시 자동 롤백** (`git reset --hard`, `git checkout -- .` 등) — D-08
- 6개 에이전트 외 다른 에이전트 호출
- ClientConfig (`config/clients/$1.json`) 자동 수정
- `lib/seo/{constants,types,loader,helpers}.ts` 수정 (Phase 5에서 만들어진 상태 그대로 사용)
- validator FAIL 인데 "성공" 보고
- `package.json` 수정 (zod 등 의존성은 Phase 5 또는 사용자가 처리)

## 멀티테넌트 (v2 — 이번 작업 범위 밖)

`/seo-apply client1`처럼 다른 슬러그로 호출하면 같은 흐름이 작동하나, 클라이언트 사이트의 라우트 구조(`app/(client)/client1/...` 등)는 별도 작업(v2)으로 만들어야 한다. 1차에선 `/seo-apply ddpage`만 검증.
