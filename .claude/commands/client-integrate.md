---
description: 새 클라이언트의 Claude Design 결과물을 받아 app/(client)/<slug>/ 로 통합 + ClientConfig 자동 생성 + SEO/AEO 하네스 자동 적용까지 한 번에. 자동 commit/push 는 하지 않으며 사용자가 직접 결정.
argument-hint: <slug>
---

# /client-integrate — 클라이언트 사이트 통합 자동화

새 클라이언트 사이트를 받아서 멀티테넌트 ddpage 코드베이스로 완전 통합하는 v2 오케스트레이터.

설계 문서:
- `docs/seo-harness/99-decisions.md` D-19, D-20, D-21
- `app/(client)/README.md`

## 사용법

```
/client-integrate <slug>
```

예:
```
/client-integrate gildongsalon
/client-integrate sungminkim
```

소스 폴더 경로는 명령 진입 후 운영자에게 직접 묻는다 (인자 1개 정책 — Claude Code 슬러시커맨드 positional 치환에 의존하지 않음).

## 인자 파싱 (오케스트레이터의 첫 작업)

사용자가 명령을 호출하면 오케스트레이터는 다음을 수행:

1. **사용자가 입력한 args 문자열을 그대로 받는다** (Claude Code 가 어떤 형식으로 넘기든).
2. **공백 제거 + 첫 토큰을 slug 로 사용**.
3. **slug 가 비어있거나 누락되면** 다음 메시지로 운영자에게 묻는다:
   ```
   클라이언트 슬러그를 알려주세요 (영문 소문자/숫자/하이픈, 예: gildongsalon, studio-21):
   ```
4. **slug 형식 검증** (Stage 0-(1), 0-(2) 와 동일):
   - `^[a-z0-9][a-z0-9-]*$` 매치 안 되면 → 다시 묻기
   - 예약 슬러그(ddpage/www/api/og/llms/llms-full/portfolio/order/robots/sitemap/favicon/public/app/_next/static) → 다시 묻기
5. **소스 폴더 묻기** — 다음 메시지:
   ```
   Claude Design 결과물이 들어있는 소스 폴더 경로를 알려주세요.
   (page.tsx 또는 preview.html, 이미지, form.md/brief.md 포함된 폴더)

   예: ./client1, ./uploads/sungmin_v2, /tmp/gildongsalon
   ```
6. **소스 폴더 경로 정규화**: `~` 확장, 상대→절대 경로 변환 (Bash `realpath` 사용 가능).
7. 이후 모든 본문에서:
   - **`<slug>`** 자리: 위에서 받은 slug 값을 그대로 사용
   - **`<source-folder>`** 자리: 위에서 받은 절대 경로를 그대로 사용
   - **`<NamePascal>`** 자리: slug 의 PascalCase 변환 (예: `gildongsalon` → `Gildongsalon`, `studio-21` → `Studio21`)

> ⚠️ 본문 안의 `<slug>`, `<source-folder>`, `<NamePascal>` 표기는 **자동 치환되는 토큰이 아니라 LLM 이 직접 값으로 채워야 하는 placeholder** 입니다. Claude Code 의 `$1`, `$2`, `$ARGUMENTS` 같은 슬러시커맨드 positional 치환 메커니즘에는 일절 의존하지 않으며, 본 오케스트레이터(LLM 본인)가 args 파싱 후 위 placeholder 자리에 실제 값을 대입합니다.

## 사전 조건 검사 (Stage 0)

**모든 조건은 BAIL-EARLY**. 하나라도 실패하면 즉시 중단 + 사용자 안내.

### (1) 슬러그 형식
```bash
echo "<slug>" | grep -qE '^[a-z0-9][a-z0-9-]*$' || exit 1
```
실패 → "❌ 슬러그는 영문 소문자/숫자/하이픈만 가능. 첫 글자는 영문 또는 숫자. (예: `gildongsalon`, `studio-21`)"

### (2) 예약 슬러그 검사
다음 슬러그는 메인 사이트와 충돌하므로 사용 불가:
```
ddpage, www, api, og, llms, llms-full, portfolio, order,
robots, sitemap, favicon, public, app, _next, static
```
실패 → "❌ `<slug>` 은 예약된 슬러그입니다."

### (3) 소스 폴더 존재
```bash
test -d "<source-folder>" || exit 1
test -f "<source-folder>/page.tsx" || test -f "<source-folder>/preview.html" || exit 1
```
실패 → "❌ 소스 폴더에 `page.tsx` 또는 `preview.html` 이 없습니다."

### (4) 슬러그 중복 검사
```bash
test ! -d "app/(client)/<slug>" || exit 1
test ! -f "config/clients/<slug>.json" || exit 1
```
실패 → "❌ `app/(client)/<slug>/` 또는 `config/clients/<slug>.json` 이 이미 존재합니다. 다른 슬러그를 쓰거나 기존 파일을 정리하세요."

### (5) lib/seo/* 4개 파일 존재 (하네스가 적용되어 있어야 동작)
```bash
test -f lib/seo/types.ts && \
test -f lib/seo/loader.ts && \
test -f lib/seo/helpers.ts && \
test -f lib/seo/constants.ts
```
실패 → "❌ `lib/seo/*` 모듈이 없습니다. 먼저 `/seo-apply ddpage` 로 하네스를 적용하세요."

### (6) proxy.ts 존재
```bash
test -f proxy.ts
```
실패 → "❌ `proxy.ts` 가 없습니다. 멀티테넌트 라우팅 인프라가 누락되었습니다."

### (7) git 클린 (Loose — D-08)
```bash
git diff --quiet && git diff --cached --quiet
```
실패 → "❌ 추적 파일에 변경이 있습니다. `git stash` 또는 `git commit` 후 다시 시도."

## 실행 단계

### Stage 1 — 페이지 변환 (page-converter Mode D)

PascalCase 이름 도출:
- `gildongsalon` → `Gildongsalon`
- `studio-21` → `Studio21`
- `kim-photo` → `KimPhoto`

```
Task(
  subagent_type="page-converter",
  prompt="mode=client-conversion source=<source-folder> slug=<slug> name_pascal=<PascalCase>"
)
```

산출:
- `app/(client)/<slug>/page.tsx` (서버, 메타/JsonLd 자리)
- `app/(client)/<slug>/<NamePascal>Client.tsx` (클라이언트 본문)
- `app/(client)/<slug>/styles.css` (필요한 경우만)

실패 시: 즉시 중단 + 보고. 다음 단계 진행 안 함.

### Stage 2 — 에셋 복사 + 자동 압축 + 경로 치환 (인라인, D-26)

이미지·폰트·기타 정적 자산을 `public/clients/<slug>/` 로 이주하고, **이미지는 자동 압축** (sharp).

```bash
mkdir -p "public/clients/<slug>"

# 1. 이미지 + 폰트 복사 (다양한 폴더 구조에 대응)
find "<source-folder>" -type f \( \
  -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \
  -o -iname "*.webp" -o -iname "*.avif" -o -iname "*.svg" \
  -o -iname "*.gif" -o -iname "*.woff" -o -iname "*.woff2" \
\) ! -path "*/node_modules/*" -exec cp {} "public/clients/<slug>/" \;
```

**2. 자동 이미지 압축** (D-26 — 클라이언트가 PNG 그대로 줘도 자동 처리):

```bash
node << 'EOF'
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SLUG = '<slug>';
const dir = `public/clients/${SLUG}`;
const TARGET_WIDTH = 1000;       // retina 2x 카드 미리보기에 충분 (실제 표시 ~400-500px)
const PNG_OPTS = { compressionLevel: 9, palette: true, quality: 90 };
const JPEG_OPTS = { quality: 82, mozjpeg: true };
const SIZE_THRESHOLD = 200 * 1024; // 200KB 초과 이미지만 압축

(async () => {
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  let totalBefore = 0, totalAfter = 0;

  for (const f of files) {
    const src = path.join(dir, f);
    const before = fs.statSync(src).size;
    totalBefore += before;

    if (before < SIZE_THRESHOLD) {
      totalAfter += before;
      console.log(`SKIP ${f.padEnd(30)} ${(before/1024).toFixed(0)}KB (under threshold)`);
      continue;
    }

    const ext = path.extname(f).toLowerCase();
    const isPng = ext === '.png';
    const tmpDst = src + '.tmp';

    let pipeline = sharp(src).resize({ width: TARGET_WIDTH, withoutEnlargement: true });
    pipeline = isPng ? pipeline.png(PNG_OPTS) : pipeline.jpeg(JPEG_OPTS);
    await pipeline.toFile(tmpDst);

    const after = fs.statSync(tmpDst).size;
    fs.renameSync(tmpDst, src);
    totalAfter += after;

    const reduction = ((1 - after/before) * 100).toFixed(0);
    console.log(`OK   ${f.padEnd(30)} ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (-${reduction}%)`);
  }

  const totalReduction = totalBefore > 0
    ? ((1 - totalAfter/totalBefore) * 100).toFixed(0)
    : 0;
  console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(2)}MB → ${(totalAfter/1024/1024).toFixed(2)}MB (-${totalReduction}%)`);
})();
EOF
```

압축 정책:
- **폭 1000px 로 resize** (높이 비율 유지, `withoutEnlargement` 로 작은 이미지는 건드리지 않음)
- **PNG**: `compressionLevel: 9` + `palette: true` (256색 indexed) — 약 70% 절감
- **JPEG**: `quality: 82` + `mozjpeg: true` — 약 50% 절감
- **200KB 미만은 skip** — 이미 충분히 작으면 건드리지 않음
- **SVG / GIF / WebP / AVIF 는 건드리지 않음** — 이미 최적화된 포맷

이 단계가 끝나면 클라이언트가 PNG 1~5MB 짜리를 줘도 자동으로 100~500KB 로 압축됨.

**경로 치환**: page.tsx / Client.tsx 안의 이미지 경로를 일괄 변환.

```bash
# 흔한 패턴들을 /clients/<slug>/ prefix 로 통일
# (각 클라이언트 시안이 사용하는 경로 패턴은 다양하므로 실제 발견되는 패턴만 처리)
# 예시:
#   "/portfolios/..." → "/clients/<slug>/..."
#   "/uploads/..."    → "/clients/<slug>/..."
#   "./images/..."    → "/clients/<slug>/..."
#   "images/..."      → "/clients/<slug>/..."

# Read + Edit 으로 처리. 단순 sed 는 따옴표/JSX 안전성 약함.
```

→ **Read 후 Edit 도구**로 page.tsx 와 Client.tsx 의 모든 이미지 src 를 절대 경로 `/clients/<slug>/<basename>` 으로 치환. 파일명만 유지, 폴더 깊이는 평탄화.

→ 치환 후 한 번 더 검증: `grep -E '(src|backgroundImage)=' app/(client)/<slug>/*.tsx` 결과에 `/clients/<slug>/` 외 경로가 없는지 확인.

실패 시: 어떤 경로가 어떤 파일에 있는지 보고 + 사용자에게 수동 조정 옵션 제시.

### Stage 3 — ClientConfig 자동 생성 (client-intake)

```
Task(
  subagent_type="client-intake",
  prompt="slug=<slug> source_folder=<source-folder> converted_page_path=app/(client)/<slug>/page.tsx converted_client_path=app/(client)/<slug>/<NamePascal>Client.tsx"
)
```

산출: `config/clients/<slug>.json`

이 에이전트는 부족한 필드가 있으면 **사용자에게 한 번에 질문**한다. 사용자가 답할 때까지 대기.

검증: `loadClient(slug)` Zod 통과 확인.

실패 시: 어떤 필드 누락인지 명시 + 사용자가 직접 JSON 편집하도록 안내.

### Stage 4 — SEO/AEO 하네스 자동 적용

```
SlashCommand("/seo-apply <slug>")
```

내부적으로 6개 기존 에이전트가 직렬/병렬 실행됨 (`seo-meta-agent` → `seo-infra-agent` + `aeo-agent` → `seo-cwv-agent` → `seo-schema-agent` → `seo-validator-agent`).

**라우트 무관 원칙(D-01)** 덕분에 새 라우트 `app/(client)/<slug>/page.tsx` 가 자동 스캔에 포함되어:
- `seo-meta-agent` 가 `generateMetadata` 채워줌 (ClientConfig 기반)
- `seo-infra-agent` 가 sitemap 에 라우트 추가 + host 헤더 분기 적용
- `aeo-agent` 가 llms-full.txt 본문에 페이지 추가
- `seo-schema-agent` 가 businessType 분기로 JsonLd 주입

기존 메인 사이트 라우트도 다시 처리되지만 **에이전트들이 멱등성을 보장**하므로 (이미 메타 있으면 skip 등) 큰 부담 없음.

실패 시: `/seo-apply` 의 표준 실패 처리(부분 적용 보고 + 사용자 결정 대기)에 위임.

### Stage 5 — TypeScript 빌드 검증

```
Task(subagent_type="validator", prompt="check after /client-integrate <slug>")
```

`npx tsc --noEmit` + 누락 import 자동 fix(1회). 실패 시 보고.

선택적으로 운영자가 풀빌드 검증 원하면:
```bash
npm run build
```
(시간 오래 걸리므로 기본은 skip, 보고에서 안내만)

### Stage 6 — 최종 보고

모든 단계 성공 시:

```
═══════════════════════════════════════════════════
✅ 클라이언트 통합 완료: <slug>
═══════════════════════════════════════════════════

[생성된 파일]
- app/(client)/<slug>/page.tsx              (서버 컴포넌트)
- app/(client)/<slug>/<NamePascal>Client.tsx (클라이언트 컴포넌트)
- app/(client)/<slug>/styles.css            (있으면)
- config/clients/<slug>.json                (ClientConfig — businessType=<type>)
- public/clients/<slug>/*                   (이미지 N개)

[ClientConfig 요약]
- name:         <name>
- businessType: <type>
- domain:       <domain>
- subdomain:    <subdomain or null>
- keywords:     <count>개
- faq:          <count>개 (page-owns-data — D-18)

[SEO/AEO 하네스]
<seo-apply 의 최종 보고를 여기에 그대로 삽입>

[검증 — validator]
<validator 의 PASS/FAIL 보고>

[Live URLs (push 후)]
- 메인 도메인 직접 접근: https://ddpage.kr/<slug>
- 서브도메인:           https://<slug>.ddpage.kr/
- Sitemap:              https://<slug>.ddpage.kr/sitemap.xml
- llms-full.txt:        https://<slug>.ddpage.kr/llms-full.txt

[다음 단계 — 사용자가 직접]
1. git diff 로 변경 확인
2. 로컬 확인: NEXT_PUBLIC_DEFAULT_SLUG=<slug> npm run dev
   → http://localhost:3000 에서 클라이언트 사이트 미리보기
3. 풀빌드 검증 (선택): npm run build
4. OK 면 커밋·푸시:
   git add .
   git commit -m "feat: integrate client <slug>"
   git push
5. Vercel 자동 배포 후 https://<slug>.ddpage.kr 동작 확인
6. (선택) Google Search Console / 네이버 웹마스터 에 <slug>.ddpage.kr 속성 등록
   → verification 토큰 받아서 config/clients/<slug>.json 의 verification.google / .naver 에 추가
   → /seo-apply <slug> 재실행
═══════════════════════════════════════════════════
```

## 실패 처리

어떤 stage 라도 실패하면:

1. 즉시 중단 — 후속 stage 실행 안 함
2. 부분 적용된 파일 그대로 둔다 (D-08 — 자동 롤백 금지)
3. 실패 보고:
   ```
   ═══════════════════════════════════════════════════
   ❌ 클라이언트 통합 실패: <slug>
   ═══════════════════════════════════════════════════

   실패 단계: Stage <N> — <agent or task>
   에러: <원인>

   [부분 적용된 파일]
   git status --short

   [복구 옵션]
   A) 변경 그대로 두고 수동 조사 (권장):
      git diff

   B) 부분 적용 롤백:
      git checkout -- .
      git clean -fd app/(client)/<slug>/ config/clients/<slug>.json public/clients/<slug>/

   자동 롤백 없음 (D-08).
   ═══════════════════════════════════════════════════
   ```
4. 사용자 결정 대기.

## 절대 하지 말 것

- **자동 git commit / push** — D-08, 사용자만 결정
- **실패 시 자동 롤백** (`git reset --hard`, `git checkout -- .` 등)
- 메인 사이트(`app/page.tsx`, `app/HomeClient.tsx`, `app/portfolio/`, `app/order/`) 수정
- `config/clients/ddpage.json` 수정
- `proxy.ts` 수정 (라우팅 인프라는 v2.1 작업)
- `lib/seo/*` 수정 (이미 적용된 하네스)
- 사용자에게 동일 질문 여러 번 (`client-intake` 가 한 번에 모음)
- 검증 FAIL 인데 "성공" 보고

## 다음 클라이언트 추가 시

같은 명령어로 반복:
```
/client-integrate <next-slug> <next-source>
```

`app/(client)/` 안에 또 다른 폴더가 추가되고, `config/clients/` 에 또 다른 JSON 이 추가된다. 메인 사이트 라우트는 영향 받지 않는다.

## 운영자가 양식을 제대로 준비하려면

`<source-folder>/form.md` 또는 `brief.md` 에 다음을 포함하면 `client-intake` 가 자동으로 채움:

```markdown
# 클라이언트 기본 정보

- 사업명: 길동 살롱
- 한 줄 소개: 동네 1등 헤어 살롱
- 사업 소개: ...(2~3문장)
- 도메인: gildongsalon.ddpage.kr  (또는 gildongsalon.com)
- 이메일: contact@gildongsalon.com
- 전화번호: 02-1234-5678
- 주소: 서울 강남구 ...
- 사업자등록번호: 123-45-67890
- 통신판매업 신고번호: 2025-서울강남-0001
- 대표자명: 김길동
- 카카오 채널: @길동살롱
- 인스타: https://instagram.com/gildongsalon
- 사업 분류: local-business
- 키워드: 강남 미용실, 헤어컷, 펌, 염색, 디자이너 김길동
- 영업시간: 화~일 10:00~21:00 (월 휴무)
- 가격대: ₩₩
```

양식이 없거나 일부만 있어도 `client-intake` 가 부족한 부분만 질문한다.
