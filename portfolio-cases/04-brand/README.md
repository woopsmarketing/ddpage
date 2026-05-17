# 04-brand 케이스 (브랜드/포트폴리오형)

## 사용법
고객이 "브랜드/포트폴리오형" 유형을 선택하면:

1. `SPEC.md`의 **6. 고객에게 받을 정보 체크리스트**를 그대로 양식으로 전달
   (작품 이미지가 최우선 — 6~9개 + 다양한 비율 필수)
2. 고객 답변 수령 후, `PROMPT.md`의 [샘플 콘텐츠] / [대괄호] 부분을 고객 정보로 교체
3. Claude.ai에서:
   - Dark Cosmic 톤 (또는 백색 갤러리 / 종이 톤 등 동등) 선택
   - 레퍼런스 이미지 첨부 (작품 + 톤 레퍼런스)
   - 수정한 프롬프트로 시안 요청 — `preview.html` + `page.tsx` 두 파일 요구
4. 받은 두 파일을 임의 폴더(예: `portfolio5/`)에 넣고
   `/portfolio-integrate <폴더명> brand "브랜드/포트폴리오형"` 슬래시 커맨드로 통합

## 라이브 URL
https://ddpage.kr/portfolio/brand

## 디자인 시스템
- 컬러: 다크 베이스 `#050510`, 보라 강조 `#a855f7` / `#c084fc` / `#d8b4fe`, 텍스트 `#ffffff` / `#d4d4dc`, 보조 `#8a8a9c`
- 타이포: Pretendard + Bricolage Grotesque (디스플레이) + JetBrains Mono (메타·기간 숫자)
- 라디우스: 12px (필드/카드) · 999px (필/칩)
- 인터랙션: IntersectionObserver 스크롤 페이드, 갤러리 필터, 폼, fixed pill 네비, 보라 그라데이션 보더, 별/구체 모티프
- CSS keyframes: `ohg-rise`, `ohg-breathe`, `ohg-marquee` (모두 `.ddpage-ohgong` 스코핑)
