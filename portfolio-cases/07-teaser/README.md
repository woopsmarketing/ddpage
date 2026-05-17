# 07-teaser 케이스 (사전예약/티저형)

## 사용법
고객이 "사전예약/티저형" 유형을 선택하면:

1. `SPEC.md`의 **6. 고객에게 받을 정보 체크리스트**를 그대로 양식으로 전달
   (D-day 타겟 일시·인포 4셀·티켓 3종·연사·타임테이블이 핵심)
2. 고객 답변 수령 후, `PROMPT.md`의 [샘플 콘텐츠] / [대괄호] 부분을 고객 정보로 교체
3. Claude.ai에서:
   - Apple-ish 미니멀 (또는 동등한 화이트 + 액센트 컬러) 톤 선택
   - 레퍼런스 이미지 첨부 (행사 분위기 / 톤 레퍼런스)
   - 수정한 프롬프트로 시안 요청 — `preview.html` + `page.tsx` 두 파일 요구
4. 받은 두 파일을 임의 폴더(예: `portfolio6/`)에 넣고
   `/portfolio-integrate <폴더명> teaser 사전예약/티저형` 슬래시 커맨드로 통합

## 라이브 URL
https://ddpage.kr/portfolio/teaser

## 디자인 시스템
- 컬러: 옵시디언 `#1d1d1f` / 슬레이트 `#474747` / 그래파이트 `#707070` / 포그 `#f5f5f7` / 스노우 `#ffffff` / 미스트 `#e8e8ed` / 애저 `#0071e3` · `#0066cc` / 코션 `#b64400`
- 타이포: SF Pro Display + SF Pro Text + Inter fallback, display 56~96px clamp, tabular-nums 활용
- 라디우스: 14px (필드) · 18px (다크 셀) · 22px (info-row) · 28px (카드/스테이지) · 999px (pill)
- 인터랙션: useCountdown 훅(setInterval 1s), 티켓 라디오 useState, FAQ 단일 열림 useState, 폼 submit + 성공 페이드인, sticky 2단 nav + backdrop blur
- CSS keyframes: `ddpage-makecon-pulse` (모두 `.ddpage-makecon` 스코핑)

## 시안 특이점
루트 PROMPT.md의 "Coming Soon 풀스크린 단순형"보다 한 단계 확장된 **이벤트/컨퍼런스 사전예약 풀세트**로 시안이 나옴. 단순 티저가 필요하면 PROMPT.md 그대로 사용하고, 행사·강의·한정수량 사전예약이면 RESULT.tsx 구조를 참고.
