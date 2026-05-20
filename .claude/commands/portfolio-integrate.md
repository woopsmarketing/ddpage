---
description: Claude Design 결과물(React/HTML)을 뚝딱페이지 포트폴리오로 통합
argument-hint: <소스폴더명> <슬러그> <유형명>
---

# 포트폴리오 통합 자동화 (v2)

Claude Design에서 받은 결과물(preview.html + page.tsx, 또는 HTML 단독)을 
Next.js 16 프로젝트의 포트폴리오로 통합한다.

## 사용법
```
/portfolio-integrate <소스폴더명> <슬러그> <유형명>
```

예:
```
/portfolio-integrate portfolio2 inquiry 상담 문의형
```

## 인자
- $1: 소스 폴더명 (예: portfolio2)
- $2: 포트폴리오 슬러그 (예: inquiry)
- $3: 유형명 한글 (예: 상담 문의형)

## 사전 조건 확인
1. 프로젝트 루트에 `$1/` 폴더 존재
2. `SPEC_TEMPLATE.md`, `PROMPTS.md` 루트 존재
3. git 워킹 트리 깨끗함

조건 안 맞으면 사용자에게 알리고 중단.

## 작업 흐름

### Step 1: 소스 분석 + 케이스 분기

`$1/` 폴더 탐색해서 입력 형식 판별:

**케이스 A: page.tsx + preview.html 둘 다 있음 (이상적)**
- page.tsx를 메인 소스로 사용
- 표준 출력 규약(CLAUDE_DESIGN_SPEC.md)에 맞는지 검증
- 미달 항목 자동 수정 (목록은 Step 2 참조)

**케이스 B: page.tsx만 있음**
- 그대로 사용, 검증/수정만

**케이스 C: HTML만 있음 (단일 파일)**
- React 컴포넌트로 변환 필요
- CSS 복잡도 판단:
  - 단순 (Tailwind 가능): 풀 변환
  - 복잡 (@keyframes, 의사요소 등): inline `<style>` + `.ddpage-$2` 스코핑

**케이스 D: 멀티파일 HTML 구조 (assets/, fonts/ 등)**
- 메인 HTML 파일 식별 (index.html 또는 메인 폴더의 .html)
- CSS 파일 별도 있으면 통합

### Step 2: page.tsx 표준 규약 검증/수정

CLAUDE_DESIGN_SPEC.md에 정의된 규약 적용:

**필수 수정 항목**:
- [ ] 인터랙션 있으면 파일 상단 `'use client'` 추가
- [ ] 내부 라우팅 `<a href="/...">` → `<Link href="/...">` (next/link)
- [ ] HTML 형식 `class=` → `className=`, `onclick=` → `onClick={}`
- [ ] 자기닫힘 태그 처리 (`<img />`, `<br />` 등)
- [ ] 한글 텍스트 컨테이너에 `break-keep` 또는 `[word-break:keep-all]`
- [ ] `next/image` 사용 시 일반 `<img />`로 교체
- [ ] inline `<style>` 사용 시 모든 셀렉터에 `.ddpage-$2` 접두 확인

**필수 추가 항목**:
- [ ] 푸터에 `<Link href="/portfolio">← 다른 포트폴리오 보기</Link>`
- [ ] 푸터에 작은 글씨 "포트폴리오용 샘플 작업입니다"

**검증**:
- [ ] TypeScript 타입 에러 없음
- [ ] import 누락 없음 (lucide-react, next/link 등)

### Step 3: 파일 저장
- `app/portfolio/$2/page.tsx`로 저장

### Step 4: 의존성 설치
필요한 패키지 자동 설치 (lucide-react 등). 이미 설치된 건 skip.

### Step 5: 포트폴리오 목록 등록
`app/portfolio/page.tsx`에 카드 추가:
- 슬러그: $2
- 제목: $3
- 한 줄 설명: SPEC.md의 "적합한 사업" 기반 자동 생성
- 링크: `/portfolio/$2`

기존 카드 배열 구조 그대로 따름.

### Step 6: 케이스 폴더 생성

슬러그 → 번호 매핑:
```
lead-collection → 01
inquiry → 02
product → 03
brand → 04
event → 05
sales → 06
teaser → 07
profile → 08
```

`portfolio-cases/[번호]-$2/` 폴더 생성 후:

**RESULT.tsx**: app/portfolio/$2/page.tsx 복사본

**PROMPT.md**: PROMPTS.md에서 해당 슬러그 섹션 추출 저장

**SPEC.md**: SPEC_TEMPLATE.md 형식대로, 실제 page.tsx 코드 분석해서 작성
- 추측 금지, 코드 기반 사실만
- [대괄호] 부분을 실제 구현 내용으로 채움

**preview.html** (있는 경우만): 그대로 복사

**README.md**:
```markdown
# [번호]-$2 케이스 ($3)

## 사용법
1. 고객이 이 유형 선택 시 SPEC.md의 체크리스트로 정보 수집
2. PROMPT.md의 [샘플 콘텐츠]를 고객 정보로 교체
3. CLAUDE_DESIGN_SPEC.md를 프롬프트 마지막에 부착
4. Claude.ai에 디자인 시스템 선택 + 레퍼런스 이미지 첨부 + 던지기
5. preview.html + page.tsx 받기
6. /portfolio-integrate 슬래시 커맨드로 통합

## 라이브 URL
https://ddpage.kr/portfolio/$2
```

### Step 7: 로컬 빌드 검증
```
npm run build
```
또는 dev 서버로 확인. 에러 발생 시 중단 + 사용자에게 보고.

### Step 8: 소스 폴더 정리
$1/ 폴더 삭제 (사용자 확인 후).

### Step 9: 커밋 + 푸시
```
git add .
git commit -m "feat: add $2 portfolio ($3)"
git push
```

### Step 10: 결과 보고

```
✅ 포트폴리오 #[번호] "$3" 통합 완료

📦 입력 형식: [A/B/C/D 케이스명]
📂 생성 파일:
- app/portfolio/$2/page.tsx (XXX줄)
- portfolio-cases/[번호]-$2/ (RESULT.tsx, SPEC.md, PROMPT.md, README.md, preview.html)

🔧 수정 항목:
- [실제 수정한 것 나열, 예: 'use client' 추가, Link 변환 등]

📋 구현 섹션:
1. [섹션명]
...

🎨 스타일 방식: [Tailwind 풀 / Tailwind + 스코핑된 inline CSS]

🌐 확인: https://ddpage.kr/portfolio/$2
(Vercel 배포 1~2분 후)
```

## 에러 처리
- 소스 폴더 없으면: 중단 + 안내
- 빌드 에러: 중단 + 에러 로그 + 사용자 결정 대기
- git 충돌: 중단 + 사용자 결정
- 절대 force push 금지