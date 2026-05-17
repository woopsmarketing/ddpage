# 03-product 케이스

## 사용법
고객이 "상품/서비스 소개형" 유형을 선택하면:

1. `SPEC.md`의 **6. 고객에게 받을 정보 체크리스트**를 그대로 양식으로 전달
2. 고객 답변 수령 후, `PROMPT.md`의 [대괄호] 변수 부분을 고객 정보로 교체
3. Claude.ai에서:
   - Contractbook 디자인 시스템 선택 (또는 동등한 톤)
   - 레퍼런스 이미지 첨부 (있다면)
   - 수정한 프롬프트로 시안 요청
4. 시안 받으면 `/portfolio-integrate <소스폴더> <슬러그> <유형명>` 슬래시 커맨드로 통합

## 라이브 URL
https://ddpage.kr/portfolio/product

## 디자인 시스템
Contractbook — Energy Gold (#ffba09) / Royal Blue (#1009f6) / Pearl·Beige 중성 톤
폰트: ABC Whyte → Inter 대체 (한글은 시스템 기본)
라디우스: 24px (카드) / 40px (이미지·배너) / 999px (버튼·핀)
