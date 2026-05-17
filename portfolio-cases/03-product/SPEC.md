# 03 product — 상품/서비스 소개형 랜딩페이지 SPEC

> 결과물: `app/portfolio/product/page.tsx`
> 케이스 폴더: `portfolio-cases/03-product/`
> 작성일: 2026-05-17

---

## 1. 기본 정보

- **유형**: 상품/서비스 소개형
- **목적**: SaaS·앱·서비스 가치 전달 + 데모/가입 전환 (CTA: "데모 신청", "둘러보기", "무료로 시작하기")
- **사용 디자인 시스템**: Contractbook (Energy Gold + Royal Blue + Pearl/Beige 중성 톤)
- **참고 레퍼런스**: Nudge.tech 류 SaaS 1-page
- **샘플 브랜드**: Flowra — 사용자 여정 자동화 플랫폼

---

## 2. 적합한 사업 (고객 매칭용)

이 템플릿이 잘 맞는 케이스:
- SaaS / 디지털 도구
- 모바일 앱 / 웹 앱
- B2B 서비스 소개
- 신제품·신기능 출시
- 개발자 도구 (API/SDK 위주)

---

## 3. 구현된 섹션 구조

코드(`app/portfolio/product/page.tsx`)에서 확인된 9개 섹션:

### 섹션 1: Nav (`<Nav />`)
- **구성**: 좌측 로고(F 마크 + Flowra 워드마크), 중앙 메뉴 4개 (Home / Product / How it works / Blog), 우측 듀얼 CTA (둘러보기 outlined + 데모 신청 gold)
- **인터랙션**: sticky top-0, 백드롭 블러. 모바일에서 메뉴 hidden (md: 이상에서만 노출)
- **콘텐츠 슬롯**:
  - 로고 텍스트 1개 + 마크 1글자
  - 메뉴 항목 4개
  - CTA 버튼 텍스트 2개

### 섹션 2: Hero (`<Hero />` + `<ProductPreview />`)
- **구성**: 중앙정렬 디스플레이 헤드라인(2줄, "자동으로" 부분 Royal Blue 강조) + 서브카피 + 듀얼 CTA + 제품 프리뷰 카드
- **제품 프리뷰**: Royal Blue 배경 카드 안에 3개 그리드 (좌: Push 알림 카드, 중: 폰 목업, 우: 리텐션 차트 카드). 데코 dot 3개.
- **콘텐츠 슬롯**:
  - 메인 헤드라인 (2줄, 강조 단어 1개)
  - 서브카피 (2줄)
  - CTA 버튼 2개 (primary, secondary)
  - 프리뷰 카드 좌측: 푸시 메시지 1개, 발송 메타데이터
  - 폰 목업: 미션 카드 1개 + 리워드 카드 1개 + 최근 본 상품 카드 1개
  - 프리뷰 카드 우측: 지표 수치 1개 + 막대 차트(7개)

### 섹션 3: Tabs (`<TabsSection />` + `<TabVisual />`)
- **구성**: 섹션 헤더(Platform kicker + h2) + 탭 버튼 3개 + 카드(좌: 카피·체크리스트, 우: 일러스트)
- **인터랙션**: `'use client'` useState로 탭 전환. 일러스트는 탭별 3종(core/gamify/analytics)
- **콘텐츠 슬롯**:
  - 섹션 kicker + h2 (2줄)
  - 탭 데이터 3개 (각각: label, kicker, title, desc, points 3개, visual 종류)
  - 탭별 일러스트 (core: 알림 4줄 + 자동발송 강조 / gamify: 7일 출석 + 배지 3개 / analytics: 12막대 차트 + 지표 3개)

### 섹션 4: FeaturesGrid (`<FeaturesGrid />`)
- **구성**: 좌측정렬 헤더(Integration kicker + h2 + 서브카피) + 3카드 그리드 (아이콘 + 타이틀 + 설명)
- **콘텐츠 슬롯**:
  - kicker + h2 + 서브카피
  - 카드 3개 (아이콘 / 타이틀 / 1줄 설명)

### 섹션 5: Connections (`<Connections />`)
- **구성**: 중앙정렬 헤더 + 원형 로고 8개 (컬러 div + 2글자 약자)
- **콘텐츠 슬롯**:
  - kicker + h2 + 서브카피
  - 로고 8개 (색상 + 텍스트)

### 섹션 6: UseCases (`<UseCases />`)
- **구성**: 중앙정렬 헤더 + 3카드 그리드 (상단 컬러 영역 + 아이콘 / 하단 태그·타이틀·설명·링크)
- **콘텐츠 슬롯**:
  - kicker + h2 + 서브카피
  - 케이스 3개 (태그 / 타이틀 / 설명 / 아이콘 / tint 색상)

### 섹션 7: CTABanner (`<CTABanner />`)
- **구성**: Energy Gold(#ffba09) 풀와이드 카드 (라디우스 40) 안에 h2 + 듀얼 CTA (검정 primary + outlined)
- **콘텐츠 슬롯**:
  - 헤드라인 (2줄)
  - CTA 버튼 2개

### 섹션 8: FAQ (`<FAQ />`)
- **구성**: 좌측 sticky 헤더(Support kicker + h2 + 서브카피 + 문의 버튼) + 우측 아코디언 5개
- **인터랙션**: `'use client'` useState로 아코디언 토글. 기본 0번 열림. max-height transition.
- **콘텐츠 슬롯**:
  - kicker + h2 + 서브카피 + 문의 버튼
  - FAQ 5개 (질문 + 답변)

### 섹션 9: Footer (`<Footer />`)
- **구성**: 4컬럼 그리드 (브랜드 컬럼 1.4fr + 메뉴 3컬럼) / 하단 카피라이트 + 약관 3링크 / 최하단 포트폴리오 표시 + "다른 포트폴리오 보기" 링크
- **콘텐츠 슬롯**:
  - 로고 + 1줄 소개
  - 메뉴 컬럼 3개 (Company / Use Cases / Features, 각 4개 링크)
  - 카피라이트 + 약관 3링크 (이용약관 / 개인정보 / 쿠키)
  - 포트폴리오 안내 + `/portfolio` 복귀 링크

---

## 4. 인터랙티브 요소

- [x] **탭 전환** (`TabsSection`, useState<'core' | 'gamify' | 'analytics'>)
- [x] **FAQ 아코디언** (`FAQ`, useState<number | null>, max-height transition)
- [x] **버튼/링크 hover** 효과 (border 색 전환, 배경색 전환, scale 0.98)
- [x] **CTA 클릭 → console.log** (실 연동은 단계 미정)
- [x] **포트폴리오 복귀 링크** (next/link → /portfolio)
- [ ] 모바일 햄버거 메뉴 (현재 미구현 — md: 이하 메뉴 자체가 숨겨짐)
- [ ] 폼 입력 (현재 미사용)
- [ ] 카운트다운 (현재 미사용)

---

## 5. 기술 스택

- Framework: Next.js 16.2.6 App Router
- Language: TypeScript
- Styling: Tailwind CSS 4 (arbitrary 값 `text-[#1009f6]` 등 직접 사용)
- 아이콘: lucide-react (ArrowRight, Check, ChevronDown, Bell, Trophy, BarChart3, Code2, Layers, Boxes, Mail, MousePointerClick, MessageSquare)
- 클라이언트 컴포넌트: 파일 최상단 `'use client'` (useState 두 군데 사용으로 전체 클라이언트)
- 이미지: placeholder div + 컬러 토큰 (실제 이미지 0개)
- 폼: 없음 (CTA는 모두 `<a onClick={() => console.log()}>`)
- 라우팅: `next/link`로 `/portfolio` 복귀 링크만 사용
- 폰트: `font-sans` (전역 Geist 폰트 변수 상속). Pretendard·Inter는 layout.tsx에 미연결.

---

## 6. 고객에게 받을 정보 체크리스트

### 필수 정보
- [ ] **브랜드명 / 서비스명** (Nav 로고, Footer 로고, Footer 카피라이트, FAQ 본문)
- [ ] **로고 마크용 1글자** (예: Flowra → F)
- [ ] **메인 헤드라인** (2줄, 강조 단어 1개 — Royal Blue 표시)
- [ ] **서브카피** (2줄, 핵심 가치 + 수치 1개)
- [ ] **CTA 문구 2개** (primary "데모 신청"급 / secondary "둘러보기"급)

### 섹션별 콘텐츠
- [ ] **Nav 메뉴 4개** (예: Home / Product / How it works / Blog)
- [ ] **Hero 프리뷰 카드 콘텐츠**:
  - 푸시 메시지 1줄 + 발송 시각
  - 폰 목업 안: 미션 1개 (제목 + 진행률), 리워드 1개, 최근 본 상품 1개
  - 우측 카드: 지표명 + 수치 + 막대 7개 데이터
- [ ] **Tabs 3개** (각각: 라벨, kicker, 제목, 설명, 체크리스트 3개)
- [ ] **Tab 일러스트 3종** 콘텐츠:
  - core: 시각별 메시지 3~4개 + 강조 한 줄
  - gamify: 7일 출석 진행 + 배지 3개 (제목 + 색)
  - analytics: 막대 12개 + 지표 3개 (이름/값/델타)
- [ ] **Features 3카드** (각각: 아이콘, 타이틀, 1줄 설명)
- [ ] **Connections 로고 8개** (색상 토큰 + 약자 2글자)
- [ ] **Use Cases 3카드** (각각: 태그, 타이틀, 설명, 아이콘, tint 색)
- [ ] **CTA 배너 헤드라인** (2줄) + 듀얼 CTA 문구
- [ ] **FAQ 5~7개** (질문 + 답변, 각 1~3줄)
- [ ] **Footer 메뉴 3컬럼** (각 컬럼 타이틀 + 항목 4개)
- [ ] **Footer 소개 한 줄** (브랜드 한 줄 정의)

### 비주얼 자산 (현재는 placeholder, 실 연동 시 필요)
- [ ] 로고 SVG (또는 1글자 마크면 텍스트로 충분)
- [ ] 제품 스크린샷 (현재 폰 목업으로 대체) — 1~3장
- [ ] 통합 로고 8개 (현재 컬러 원 + 약자)

### 사업자 정보 (Footer용)
- [ ] 회사명 / 카피라이트 표기명
- [ ] 이용약관 URL
- [ ] 개인정보 처리방침 URL
- [ ] 쿠키 정책 URL
- [ ] 연락처 (FAQ "문의하기" 버튼 — 이메일 or 카톡 채널)

---

## 7. 권장 디자인 톤

- 1순위: **Contractbook (현재)** — 모노톤 위에 Gold·Royal Blue 포인트, 정보 위계가 깔끔히 살아남
- 2순위: **미니멀 모노톤** — 신뢰감 강조, B2B 색이 강할 때
- 비추: **파스텔 감성** — SaaS 신뢰 약화, 의사결정자 설득 어려움

---

## 8. 흔한 변형/맞춤 요청

운영 누적 시 업데이트.

---

## 9. 관련 자료

- 시안 생성 프롬프트: `PROMPT.md`
- 결과물 코드: `RESULT.tsx` (== `app/portfolio/product/page.tsx`)
- 라이브 URL: https://ddpage.kr/portfolio/product
- 원본 소스: `portfolio1/` (통합 후 삭제 예정)
