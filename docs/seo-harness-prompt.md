# SEO/AEO 하네스 구현 프롬프트 — Claude Code 새 세션용

> 이 프롬프트는 대화형 점진적 설계를 위한 것입니다.
> 한 번에 다 구현하지 말고, 각 단계마다 사용자 검토를 거친 후 다음으로 진행합니다.

---

## 프로젝트 컨텍스트

- **프로젝트**: 뚝딱페이지(ddpage.kr) — 월 14,900원 랜딩페이지 호스팅 SaaS
- **스택**: Next.js 16 App Router + TypeScript + Tailwind v4 + Vercel
- **도메인**: ddpage.kr (와일드카드 *.ddpage.kr 멀티테넌트 구조)
- **라이브 URL**: https://ddpage.kr
- **클라이언트 저장**: JSON 파일 (`config/clients/[slug].json`), 추후 Supabase 마이그레이션 예정

## 현재 상태

- ✅ 8개 포트폴리오 (/portfolio/*) 완성 + 모바일 UX 보완 완료
- ❌ 메인 페이지 (/), /portfolio 인덱스, /order 아직 없음
- ❌ SEO/AEO 적용 안 됨

## 작업 목표

**범용 SEO/AEO 적용 하네스를 서브에이전트 팀 구조로 구현**하는 것이 목표입니다. 이 하네스는:

1. **뚝딱페이지 자체에 적용** (1차 테스트)
2. **모든 클라이언트 사이트에 재사용** (사업 운영의 핵심 자산)
3. **JSON 기반 선언적 설정** → 50명 넘으면 Supabase 마이그레이션 쉽도록

---

## 하네스 설계 (확정된 사항)

### 오케스트레이터 1개
**`.claude/commands/seo-apply.md`** — 슬래시커맨드 (조율자, 100줄 이내 단순화)

역할:
- 사전 조건 확인 (JSON 존재, git 클린)
- `lib/seo/` 공통 모듈 생성 (constants, types, loader)
- 6개 서브에이전트 병렬 호출
- 결과 통합 + 보고
- git commit + push

### 서브에이전트 6개

1. **seo-meta-agent** — 페이지별 metadata export 전문
   - `lib/seo/metadata.ts` 헬퍼 생성
   - 모든 페이지에 `export const metadata` 적용
   - title 템플릿, description, keywords, OG, Twitter, robots, canonical, verification

2. **seo-schema-agent** — JSON-LD 9가지 구조화 데이터 전문
   - `lib/seo/schema.ts` 생성기 모음
   - **사업 분류 6가지 분기 로직은 이 에이전트 내부에서 처리** (오케스트레이터는 단순 유지)
   - 각 페이지 head에 `<script type="application/ld+json">` 주입

3. **aeo-agent** — AI 답변엔진 노출 최적화 전문
   - `app/llms.txt/route.ts` (사이트 카탈로그)
   - `app/llms-full.txt/route.ts` (전문 본문)
   - Speakable schema + `data-speakable` 속성 안내
   - HowTo schema 자동 감지 (`lib/seo/howto-detector.ts`)

4. **seo-infra-agent** — sitemap/robots/OG 이미지 전문
   - `app/sitemap.ts` (라우트 자동 감지)
   - `app/robots.ts` (AI 크롤러 14종 명시 허용)
   - `app/opengraph-image.tsx` (다크+보라 그라데이션 동적 OG)

5. **seo-cwv-agent** — Core Web Vitals 성능 최적화 전문
   - next/font 최적화 점검
   - next.config.mjs 이미지 설정 (AVIF/WebP)
   - 본문 이미지 lazy/alt fallback 처리
   - 우선순위 이미지 priority 속성

6. **seo-validator-agent** — 코드 검증 전문
   - TypeScript 빌드 에러 체크
   - JSON-LD 문법 검증 (Schema.org 기준)
   - 메타데이터 누락 체크
   - sitemap 라우트 정확성 확인
   - **라이브 검증은 별도 (이 에이전트는 코드 레벨만)**

### 작업 흐름

```
오케스트레이터 (/seo-apply <slug>)
  ↓
[사전 조건 확인]
  ↓
[lib/seo/ 공통 모듈 생성]
  ↓
[병렬 실행]
  ├─ seo-meta-agent
  ├─ seo-schema-agent
  ├─ aeo-agent
  ├─ seo-infra-agent
  └─ seo-cwv-agent
  ↓
[seo-validator-agent] (다른 에이전트 끝난 후 직렬)
  ↓
[통합 보고]
  ↓
[git commit + push]
```

### 정책

- **멱등성**: 각 에이전트가 자기 영역의 기존 적용 확인 후 skip (재실행 안전)
- **실패 처리**: 에이전트 하나라도 실패하면 **즉시 중단 + 명확한 보고**. 자동 롤백 없음 (수동 처리)
- **사업 분류 분기**: schema-agent 내부 처리. 다른 에이전트는 분류 무관하게 동일 작동
- **검증 깊이**: 코드 레벨만 (빌드/타입/문법). 라이브 검증은 별도 `/seo-verify` 슬래시커맨드로 분리 (이번 작업 범위 밖)

---

## 진행 방식 — 대화형 점진적 설계

**한 번에 모든 코드를 작성하지 마세요.** 다음 흐름으로 진행합니다:

### Phase 1: 프로젝트 구조 파악
1. 다음 파일들 먼저 읽기:
   - `app/layout.tsx`
   - `app/portfolio/page.tsx` (있다면)
   - `app/portfolio/[하나의 슬러그]/page.tsx` (구조 파악용)
   - `package.json`
   - `portfolio-cases/` 폴더 구조
2. 현재 8개 포트폴리오 슬러그 목록 확인
3. 사용자에게 "프로젝트 파악 완료. 다음 단계 진행할까요?" 보고

### Phase 2: lib/seo/ 공통 모듈 명세 작성 (구현 X)
1. `lib/seo/constants.ts` — 어떤 상수가 들어갈지 명세
2. `lib/seo/types.ts` — ClientConfig TypeScript 타입 정의 명세
3. `lib/seo/loader.ts` — JSON 로드 함수 명세
4. 사용자에게 명세 보여주고 검토 요청
5. **사용자 승인 후** 다음 단계로

### Phase 3: 서브에이전트 명세 작성 (구현 X)
**각 에이전트마다 다음 형식으로 명세 작성 후 사용자 검토**:

```markdown
## [에이전트 이름]

### 책임
[한 줄 책임 정의]

### 입력
- ClientConfig (loader에서 로드)
- 프로젝트 라우트 정보

### 출력 (생성/수정할 파일)
- 파일 A: [목적]
- 파일 B: [목적]

### 핵심 로직
[중요 알고리즘이나 분기 로직]

### 멱등성 보장 방식
[재실행 시 어떻게 기존 적용 확인하는지]

### 의존성
- lib/seo/loader.ts
- lib/seo/types.ts
- [기타]

### 실패 케이스
- [어떤 상황에서 실패하는지]
- 실패 시 메시지 형식

### 검증 방식
[작업 완료 후 자체 검증 방법]
```

**순서**: 사용자가 검토하기 좋게 단순한 것부터:
1. seo-meta-agent (가장 단순)
2. seo-infra-agent (sitemap/robots — 명확)
3. aeo-agent (llms.txt/llms-full.txt — 명확)
4. seo-cwv-agent (성능 — 점검 중심)
5. seo-schema-agent (가장 복잡 — 6가지 사업 분류 분기)
6. seo-validator-agent (다른 에이전트 끝난 후 실행되므로 마지막)

각 에이전트 명세 보여주고 **"검토 부탁드립니다. OK면 다음 에이전트로 진행할게요"** 형식으로 진행.

### Phase 4: 오케스트레이터 명세 작성 (구현 X)
6개 에이전트 다 검토 끝나면 오케스트레이터 명세:
- 사전 조건 확인 로직
- 에이전트 병렬 호출 패턴
- 결과 통합 형식
- git commit 메시지 패턴

### Phase 5: 일괄 구현
모든 명세 검토 완료 후 **사용자 명시적 승인 받고 구현 시작**.

구현 순서:
1. `lib/seo/` 공통 모듈
2. `.claude/agents/seo-meta-agent.md`
3. `.claude/agents/seo-infra-agent.md`
4. `.claude/agents/aeo-agent.md`
5. `.claude/agents/seo-cwv-agent.md`
6. `.claude/agents/seo-schema-agent.md`
7. `.claude/agents/seo-validator-agent.md`
8. `.claude/commands/seo-apply.md`

### Phase 6: 1차 테스트
구현 끝나면 사용자가 직접 실행:
```
/seo-apply ddpage
```

뚝딱페이지 자체에 적용 (테스트 환경 = 8개 포트폴리오에 SEO/AEO 적용됨).

---

## 사용자 입장 사전 자료

다음 파일이 이미 프로젝트에 저장되어 있어야 합니다 (Phase 1에서 확인):

### `config/clients/ddpage.json`
뚝딱페이지 자체 설정 파일. 사업 분류 `digital-product`. (Phase 1에서 이 파일 존재 확인 후, 없으면 사용자에게 안내.)

### 사업 분류 6가지
- `local-business`: 오프라인 사업자 (LocalBusiness + GeoCoordinates + OpeningHours)
- `professional`: 1인 전문가 (ProfessionalService + Person, E-E-A-T)
- `digital-product`: 디지털 상품 (Product + Offer + Course)
- `event`: 이벤트 (Event + Location + Ticket Offers)
- `brand`: 브랜드/포트폴리오 (CreativeWork + Person)
- `profile`: 1인 프로필 (Person + sameAs + ProfilePage)

### JSON 스키마 (참고)
```json
{
  "slug": "ddpage",
  "businessType": "digital-product",
  "name": "뚝딱페이지",
  "domain": "ddpage.kr",
  "tagline": "검색에서 찾아오게 만드는 사이트, 월 14,900원에",
  "description": "...",
  "keywords": ["랜딩페이지 제작", ...],
  "contact": { "email": "...", "phone": null, ... },
  "registration": { "ecommerceRegNumber": "2025-대구남구-0558", ... },
  "social": { "instagram": null, ... },
  "verification": { "google": null, "naver": null },
  "ogImage": { "theme": "dark-violet" },
  "faq": [ { "q": "...", "a": "..." }, ... ],
  "aeo": { "llmsFullText": true, "speakable": true, "howToAutoDetect": true },
  "businessTypeMeta": { /* 사업 분류별 추가 데이터 */ }
}
```

---

## 출력 형식

### Phase 1 보고
```
✅ 프로젝트 파악 완료

[프로젝트 구조]
- 8개 포트폴리오 확인: lead-collection, inquiry, product, brand, event, sales, teaser, profile
- 메인 페이지 (app/page.tsx): [존재 여부]
- /portfolio 인덱스 (app/portfolio/page.tsx): [존재 여부]
- /order: [존재 여부]
- config/clients/ddpage.json: [존재 여부]

[발견 사항]
- [현재 어떤 SEO가 적용되어 있는지]
- [layout.tsx의 메타데이터 상태]

[제안 사항]
- Phase 2(lib/seo/ 공통 모듈 명세) 진행할까요?
- 또는 추가 확인 필요한 부분?
```

### Phase 2~4 보고
각 단계마다 명세를 코드 블록으로 보여주고 검토 요청.

### Phase 5 구현
구현 끝날 때마다 어떤 파일 생성/수정했는지 보고.

### Phase 6
사용자가 직접 `/seo-apply ddpage` 실행하도록 안내.

---

## 시작

**Phase 1부터 시작하세요.** 프로젝트 구조 파악 후 보고하고 사용자 승인 받은 뒤 다음 단계로 진행합니다.

**중요**:
- 한 번에 모든 명세/구현 작성 금지
- 각 Phase마다 사용자 검토 + 명시적 승인 후 다음으로
- 사용자가 "OK", "다음", "진행해" 등 명시적으로 말하기 전까지 다음 Phase 진입 금지
- 의심스러운 부분은 사용자에게 질문
- 코드 작성 전에 항상 명세 먼저