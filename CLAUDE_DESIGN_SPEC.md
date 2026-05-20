# 뚝딱페이지 Claude Design 표준 출력 규약

모든 포트폴리오 작업 시 Claude Design 프롬프트 하단에 이 블록을 그대로 부착.
일관된 결과물 = 일관된 통합 작업 = 빠른 운영.

---

## [기술 스택 — 출력 형식]

뚝딱페이지는 Next.js 16 App Router 프로젝트입니다.
다음 두 가지 결과물을 모두 만들어주세요:

### 출력 1: preview.html (미리보기용)
- 단일 HTML 파일
- 모든 CSS는 `<style>` 태그 안에
- Tailwind CDN 사용 가능 (https://cdn.tailwindcss.com)
- 인터랙션은 vanilla JS (간단한 토글, 폼 등)
- Artifact 미리보기로 시각 확인 가능하게

### 출력 2: page.tsx (통합용)
아래 규약을 정확히 따라주세요.

---

## [page.tsx 작성 규약]

### 기본 구조
- Next.js 16 App Router 호환
- TypeScript
- Tailwind CSS v4 (★ v3 아님 — `@theme` CSS 기반 설정 사용)
- single-file 컴포넌트
- `export default function Page()` 패턴
- 인터랙션 있을 때만 파일 최상단에 `'use client'`
- 인터랙션 없으면 서버 컴포넌트로 (성능 + SEO)

### 스타일링 우선순위
1. **Tailwind 유틸리티 클래스를 1순위**로 사용
   - 색상: `bg-[#0052ff]`, `text-[#1a1a1a]` (arbitrary value OK)
   - 간격: `gap-6`, `py-20`, `mt-12` 등 표준 토큰 우선
   - 반응형: `sm:`, `md:`, `lg:` 브레이크포인트
2. **다음 경우에만 inline `<style>` 사용**:
   - `@keyframes` 애니메이션
   - `::before`, `::after` 의사 요소
   - `backdrop-filter`, 복잡한 `radial-gradient`
   - `:focus-within`, `:has()` 같은 복잡한 셀렉터
   - 복잡한 `grid-template-columns` (예: `1.4fr 1fr 1fr`)
3. **inline `<style>` 사용 시 스코핑 필수**:
   - 모든 셀렉터에 `.ddpage-[슬러그]` 접두 (예: `.ddpage-lead`)
   - `@keyframes` 이름도 접두 (예: `ddpage-lead-pulse`)
   - 컴포넌트 루트 `<main>` 또는 `<div>`에 해당 클래스 부여
   - `<style dangerouslySetInnerHTML={{__html: SCOPED_CSS}} />` 패턴

### 컴포넌트 처리
- 인터랙티브 요소 (탭, 아코디언, 폼 상태):
  - `'use client'` 명시
  - `useState`, `useEffect` 정상 사용
- 카운트다운, 타이머:
  - `useEffect` + `setInterval`
  - cleanup 함수로 메모리 누수 방지
- 폼:
  - `onSubmit`에서 `e.preventDefault()` + `console.log(values)`
  - 가짜 성공 메시지 (state로 보여주기)

### 링크 처리
- 내부 라우팅: `next/link`의 `<Link>` 사용
  ```tsx
  import Link from 'next/link'
  <Link href="/portfolio">← 다른 포트폴리오 보기</Link>
  ```
- 외부 링크 또는 페이지 내 앵커: 일반 `<a>`
- 외부 링크는 `target="_blank" rel="noopener noreferrer"`

### 이미지 처리
- `next/image` 사용하지 마세요
- placeholder URL: `https://placehold.co/600x400/색상/색상?text=설명`
- 또는 colored div + 텍스트 또는 아이콘
- 실제 이미지 경로는 통합 단계에서 교체

### 아이콘
- `lucide-react` 사용 (이미 설치되어 있음)
  ```tsx
  import { Check, ArrowRight, Star } from 'lucide-react'
  ```
- 없는 아이콘은 인라인 SVG

### 한글 처리
- 모든 한글 텍스트 컨테이너에 `word-break: keep-all` 적용
  - Tailwind: `break-keep` 또는 `[word-break:keep-all]`
- 줄바꿈이 단어 중간에서 안 일어나도록

---

## [필수 푸터 요소]

페이지 최하단에 반드시 포함:

```tsx
<footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
  <Link href="/portfolio" className="hover:underline">
    ← 다른 포트폴리오 보기
  </Link>
  <p className="mt-2 text-xs text-gray-400">
    포트폴리오용 샘플 작업입니다
  </p>
</footer>
```

(디자인 톤에 맞게 색상/간격 조정 OK, 두 요소 자체는 필수)

---

## [출력 시 주의]

- ❌ `class=` (HTML) → ✅ `className=` (JSX)
- ❌ `onclick=` (HTML) → ✅ `onClick={}` (JSX)
- ❌ inline style 객체에 CSS 문자열 → ✅ React 객체 형식 `style={{color: 'red'}}`
- ❌ 자기닫힘 안 한 태그 `<img>` → ✅ `<img />`
- ❌ 주석 `<!-- -->` → ✅ `{/* */}`
- 파일 상단 `'use client'`는 인터랙션 있을 때만

---

## [출력 형식 요청 (프롬프트 마지막에 명시)]

다음 두 파일을 만들어주세요:

1. **`preview.html`**
   - Artifact로 시각 확인용
   - Tailwind CDN + vanilla JS

2. **`page.tsx`**
   - 위 모든 규약 정확히 적용
   - Next.js 16 + TypeScript + Tailwind v4 호환
   - 그대로 `app/portfolio/[슬러그]/page.tsx`로 사용 가능해야 함

각 파일을 별도 코드 블록으로 출력해주세요.