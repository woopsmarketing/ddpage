# 02-inquiry 케이스 (상담 문의형)

## 사용법
고객이 "상담 문의형" 유형을 선택하면:

1. `SPEC.md`의 **6. 고객에게 받을 정보 체크리스트**를 그대로 양식으로 전달
2. 고객 답변 수령 후, `PROMPT.md`의 [샘플 콘텐츠] / [대괄호] 부분을 고객 정보로 교체
3. Claude.ai에서:
   - Airbnb-ish 미니멀 톤 (또는 동등) 선택
   - 레퍼런스 이미지 첨부 (있다면)
   - 수정한 프롬프트로 시안 요청 — `preview.html` + `page.tsx` 두 파일 요구
4. 받은 두 파일을 임의 폴더(예: `portfolio3/`)에 넣고
   `/portfolio-integrate <폴더명> inquiry "상담 문의형"` 슬래시 커맨드로 통합

## 라이브 URL
https://ddpage.kr/portfolio/inquiry

## 디자인 시스템
- 컬러: 코럴 포인트 `#ff385c`, 텍스트 `#222222`, 보조 `#3f3f3f`/`#6a6a6a`, 배경 `#f7f7f7`, 보더 `#ebebeb`
- 타이포: Inter + Noto Sans KR, 한글은 `break-keep` 적용, 헤드라인 -1.2px tracking
- 라디우스: 14px (카드/이미지) · 999px (필/배지)
- 인터랙션: 폼 / 네이티브 `<details>` 아코디언 / sticky 네비 / 호버 그림자
