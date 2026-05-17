# 시안 생성 프롬프트 — 03 product (상품/서비스 소개형)

> 루트 `PROMPTS.md` 미존재로 원본 프롬프트 미보관. 통합 시 사용된 시안은 `portfolio1/flowra/`의 단일 파일 결과물(index.html + page.tsx)이며, Contractbook 디자인 시스템(`portfolio1/colors_and_type.css`) 기반.
> 향후 운영 시 이 파일을 다음 양식으로 채워서 사용한다.

---

## 사용 디자인 시스템
Contractbook (Energy Gold / Royal Blue / Pearl·Beige 중성, 24·40·999 라디우스)

## 레퍼런스
- Nudge.tech 류 SaaS 소개형 (히어로 + 탭 + 통합 로고 + 사례 + FAQ)

## 프롬프트 본문 (변수 부분은 [대괄호]로 표기)

```
[브랜드명]은 [한 줄 정의 / 카테고리]입니다.
타깃: [예: 디지털 제품을 만드는 PM·그로스 팀]
핵심 가치: [예: 행동 데이터 기반 자동 메시지로 리텐션 +38%]

다음 섹션 순서로 1-page 랜딩을 만들어 주세요:
1. Nav (로고 + 메뉴 4 + 듀얼 CTA)
2. Hero (헤드라인 / 서브카피 / 듀얼 CTA / 제품 프리뷰 시각)
3. Tabs (3개 탭: [탭1] / [탭2] / [탭3], 각 탭은 카피·체크리스트·일러스트)
4. Features 3-card (API/SDK 류)
5. Connections (연동 로고 6~8개)
6. Use Cases 3-card
7. CTA 배너 (Gold 배경, 듀얼 CTA)
8. FAQ 5~7개 (왼쪽 sticky 헤더 + 오른쪽 아코디언)
9. Footer (3컬럼 + 카피라이트 + 약관)

기술: TypeScript + Tailwind CSS 4, single-file, 'use client'.
이미지/로고: placeholder div + 컬러 토큰.
폼 액션: console.log.
```

## 채워서 보낼 정보
SPEC.md의 "6. 고객에게 받을 정보 체크리스트" 그대로 양식으로 전달.
