# 06 세일즈/구매 전환형 랜딩페이지 SPEC

> 결과물: `app/portfolio/sales/page.tsx`
> 케이스 폴더: `portfolio-cases/06-sales/`
> 작성일: 2026-05-19

---

## 1. 기본 정보

- **유형**: 세일즈/구매 전환형 (롱폼 · 인포-프로덕트)
- **목적**: 페인 자극 → 솔루션 → 증명 → 안심 → 결제로 이어지는 14섹션 풀세트 롱폼 세일즈
- **사용 디자인 시스템**: Peach Base (#fff5ee) + Deep Teal (#012620/#004038) + Accent Teal (#00f5dc) + Lime (#d5ff4d) + Serif italic 강조
- **참고 레퍼런스**: 인프런/클래스101/탈잉 등 한국 정보성 상품 롱폼 + 첨부 이미지의 Before/After·후기 카드 디자인
- **예상 작업 시간**: 시안 35~45분 + 통합 10분 ≈ 45~55분
- **샘플 스코프 메모**: PROMPT.md의 14개 섹션 모두 구현. 본문 길이 1218줄(인터랙션 컴포넌트 3개 + 메인 페이지)

---

## 2. 적합한 사업 (고객 매칭용)

이 템플릿이 잘 맞는 케이스:
- 온라인 강의 / 영상 코스 (인프런·클래스101 스타일 정보성 상품)
- 전자책 / PDF 자료집 / 노션 템플릿 등 디지털 상품
- 부트캠프·챌린지 모집 (얼리버드 가격 + 기수 한정)
- 멤버십 / 마스터마인드 / 코칭 프로그램 (한정 정원)
- 컨설팅 패키지 (가격 공개형)

---

## 3. 구현된 섹션 구조

실제 코드(page.tsx)에서 확인된 섹션 순서.

### 섹션 1: 알림 바 + 글로벌 헤더 (sticky)
- **구성**: 상단 다크 알림 바(얼리버드 50% 할인 + 카운트다운), 그 아래 backdrop-blur sticky 헤더 (로고/메뉴 5개/`지금 시작하기` CTA)
- **인터랙션**: `useEffect` + `setInterval` 1초 카운트다운(D/H/M/S), `pad()` 헬퍼로 두 자리 패딩
- **콘텐츠 슬롯**: 알림 메시지, 카운트다운 타겟 일시(`2026-11-28T23:59:59+09:00`), 로고, 인페이지 앵커 5개(`#why`, `#curriculum`, `#reviews`, `#pricing`, `#faq`)

### 섹션 2: 히어로 (`#hero`)
- **구성**: 풀폭 다크 배경(#012620) + 좌측 텍스트 / 우측 동영상 카드(16:10) 2단 그리드. 좌측: 타겟 pill 2개 → 거대 헤드라인(라임 마커 강조 + 청록 강조) → 서브카피 → 듀얼 CTA(청록 + 고스트) → 4개 신뢰 체크리스트 → 누적 수강생 아바타 스택 + 별점. 우측: aspectRatio 16:10 비디오 카드 + 가짜 검색 순위 SVG 차트 + 재생 버튼, 양 옆에 floating 통계 카드 2개. 하단: 수강생 소속 로고 스트립
- **인터랙션**: `.ddpage-fade-up` keyframes 페이드 업 애니메이션 (animationDelay로 우측 카드 120ms 지연)
- **콘텐츠 슬롯**: 타겟 라벨 2개, 기수/정원 정보, 메인 헤드라인 4줄, 서브카피, CTA 2개, 신뢰 체크 4개, 누적 수강생 수, 별점·후기 수, 가짜 통계(노출/유입/매출), 수강생 소속 7개

### 섹션 3: Pain Points (`#why`)
- **구성**: 좌측 정렬 헤더(peach pill + 2줄 헤딩) + 6개 카드 그리드(md 2열, lg 3열). 마지막 6번째 카드는 다크 톤 #012620 "다 겪어봤습니다" 강조 카드
- **인터랙션**: 없음 (정적 카드)
- **콘텐츠 슬롯**: 페인 5개(광고비/블로그/경쟁사/유튜브 강의/시간), 강사 공감 카피 1개

### 섹션 4: Solution Intro
- **구성**: 풀폭 peach 강조 배경(#fde8ce), 중앙정렬. 작은 pill → 거대 헤딩(청록 marker 강조) → Serif italic 솔루션 한 줄 정의 → 3카드(01/02/03 검증된 방법론/평생 소장/실시간 코칭)
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 솔루션 정의 1문장, 핵심 가치 3개(번호/제목/설명)

### 섹션 5: Before / After
- **구성**: 3컬럼 그리드(`1fr_auto_1fr`). 좌측 흰 BEFORE 카드(X 아이콘 + 7개 리스트), 가운데 그라데이션 화살표 원, 우측 다크 #012620 AFTER 카드(체크 아이콘 + 7개 결과 리스트, 라임 강조 숫자)
- **인터랙션**: 없음
- **콘텐츠 슬롯**: Before 7행, After 7행, 평균 수치 면책 캡션 1줄

### 섹션 6: Instructor
- **구성**: 풀폭 peach 변형 배경(#ffdcbf), 2열 그리드(좌 portrait / 우 텍스트). 좌측: aspect 4/5 비례 placeholder(SVG 그라데이션 + 인물 실루엣 path) + 위치 pill(강사) + "사진 자리" 캡션 + 우하단 floating 흰 카드(별점/만족도 4.9). 우측: 소개 pill → 헤딩 → 강사명+한 줄 정체성 → 3문단 스토리(marker 강조 포함) → 6개 자격/경력 배지 그리드(2열)
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 강사 사진 placeholder, 강사명·정체성, 3문단 스토리, 자격 6개

### 섹션 7: Core Benefits
- **구성**: 좌측 정렬 헤더(청록 pill + 헤딩 + 서브카피) + 6개 결과 카드 그리드(md 2열, lg 3열). 각 카드는 컬러 아이콘 박스(파스텔 6색 순환) + 헤딩 + 본문
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 결과 6개(키워드 지도/글 템플릿/매출 자산화/발행 루틴/대시보드/원칙)

### 섹션 8: Testimonials (`#reviews`)
- **구성**: 풀폭 라이트 블루 배경(#bee9f4). 헤더(좌 헤딩 / 우 4.9 평점). Featured 인용 카드(흰 배경 + Serif italic 인용 + 결과 박스 peach). 그 아래 8개 ReviewCard 그리드(md 2열, lg 3열, 추가 다크 "+304 후기 더보기" CTA 카드)
- **인터랙션**: 없음 (정적 카드)
- **콘텐츠 슬롯**: Featured 후기 1개(+결과 통계), 후기 카드 8개(이니셜/이름/직업/뱃지/본문), 전체 후기 CTA

### 섹션 9: Curriculum (`#curriculum`)
- **구성**: 좌측 정렬 헤더(peach pill + 헤딩) + 메타 정보 4셀(모듈/강의 수/총 시간/워크북) + 7개 `CurriculumModule` 아코디언. 모듈 카드: `<details>` + summary(번호/제목/메타/태그/chev) + lesson 리스트 또는 body 텍스트
- **인터랙션**: native `<details>/<summary>` 토글, `summary::-webkit-details-marker` 제거, `details[open] .ddpage-chev` 180° 회전 transition
- **콘텐츠 슬롯**: 모듈 7개 × (번호/제목/메타/태그/강의 6~8개 리스트 또는 body 한 줄). 1강은 `free: true` 무료 미리보기

### 섹션 10: Bonus
- **구성**: 풀폭 다크 #012620 + ddpage-blob, 중앙 헤더(라임 pill + 헤딩) + 4개 BONUS 카드 2열 그리드(glass-edge ddpage style + 각 카드: 컬러 아이콘 + BONUS 번호 pill + 가치 표시 + 헤딩 + 본문) + 하단 청록 강조 박스(총 ₩586,000 + 가격 확인 CTA)
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 보너스 4개(키워드 데이터팩/글 템플릿 22종/라이브 Q&A/대시보드) × (가치/제목/설명), 총 보너스 가치

### 섹션 11: Pricing (`#pricing`)
- **구성**: 다크 카드 2열 그리드(`1.05fr_1fr`). 좌측 다크: 5기 얼리버드 pill + ~11/28 pill + 코스 타이틀 + 설명 + 정가(취소선)·할인 pill + 할인가 거대 타이포 + 월 분납 → 큰 청록 CTA → 결제 수단 4개. 우측 흰: 7개 포함 항목 체크리스트(`Check` 아이콘 + 제목 + 보조) + hairline + 총 가치 합계 ₩1,385,000(취소선)
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 정가/할인가/월 분납, 포함 항목 7개, 총 가치 합계, 마감 안내 1줄

### 섹션 12: Guarantee
- **구성**: 풀폭 흰 배경, 큰 라이트 블루(#bee9f4) 보장 박스 grid 2열(아이콘 큐브 / 텍스트). 흰 정사각 큐브 + ShieldCheck 아이콘 / 우측 헤딩 + 본문 + 환불 조건 캡션
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 환불 보장 카피, 환불 조건 1줄

### 섹션 13: FAQ (`#faq`)
- **구성**: 풀폭 peach 배경(#fde8ce), 중앙 헤더 + 8개 `Faq` 컴포넌트(`<details>` 기반, Q1 기본 open). Faq는 summary에 번호/질문/chev, 본문은 `pl-[68px] sm:pl-[76px]` 인덴트
- **인터랙션**: native `<details>` 토글, chev 180° 회전
- **콘텐츠 슬롯**: FAQ 8개(비전공자/시간/기간/환불/즉시시청/추가비용/단체/안 맞는 분)

### 섹션 14: Final CTA — Closer
- **구성**: 풀폭 다크 #012620 + ddpage-blob 2개, 중앙정렬. 라임 마감 안내 pill → 거대 헤딩 → 서브카피 → 2개 한정 박스(D-day 카운트다운 / 잔여 자리 37/200 + ddpage-gradient-bar 81.5%) → 큰 청록 CTA → 3개 보장 신호(환불/평생 소장/즉시 시청)
- **인터랙션**: 히어로와 공유하는 카운트다운 state 재사용
- **콘텐츠 슬롯**: 잔여 자리, 마감 일자, CTA, 보장 신호 3개

### 섹션 15: Footer
- **구성**: peach 배경, 4컬럼 그리드(브랜드 1.2fr + 코스 1fr + 문의 1fr + 정책 1fr) → hairline → 좌(사업자 정보 3행) + 우(`<Link href="/portfolio">← 다른 포트폴리오 보기</Link>` + "포트폴리오용 샘플 작업입니다" 캡션)
- **콘텐츠 슬롯**: 사업자 정보, 코스 메뉴 4링크, 문의 이메일 2개·운영시간, 정책 링크 3개

### 섹션 16: Sticky Mobile CTA
- **구성**: `fixed bottom-0` + `md:hidden`, peach 반투명 + backdrop-blur, 큰 다크 CTA 버튼 풀와이드
- **인터랙션**: 없음 (정적 위치)
- **콘텐츠 슬롯**: CTA 텍스트 1줄

---

## 4. 인터랙티브 요소

- [x] Sticky 헤더 (backdrop blur)
- [x] 카운트다운 타이머 (useState + useEffect + setInterval, 히어로·Final CTA 공유)
- [x] FAQ 아코디언 (native `<details>/<summary>`, scoped CSS로 마커 제거 + chev 회전)
- [x] 커리큘럼 모듈 아코디언 (native `<details>`)
- [x] CSS 페이드업 keyframes (`ddpage-sales-fadeUp`)
- [x] In-page anchor 스크롤 (`#why`, `#curriculum`, `#reviews`, `#pricing`, `#faq`)
- [x] Sticky 모바일 CTA (`md:hidden`)
- [ ] 폼 입력 (구매는 외부 결제로 가정 — 폼 없음)
- [ ] 탭 전환

---

## 5. 기술 스택

- Framework: Next.js 16 App Router (`'use client'`)
- Language: TypeScript
- Styling: Tailwind CSS 4 + `<style dangerouslySetInnerHTML>`로 주입된 `.ddpage-sales` 스코프 CSS (pill/btn/blob/marker/gradient-bar/fade-up keyframes)
- 아이콘: lucide-react (Gift, Clock, TrendingUp, ArrowRight, Play, PlayCircle, Check, Star, Users, AlertCircle, X, FileX, SearchX, CircleHelp, ClockAlert, HeartHandshake, BadgeCheck, Infinity, MessageCircle, ArrowRightLeft, Search, FileText, Repeat, BarChart3, ShieldCheck, Quote, User, GraduationCap, Briefcase, Youtube, Award, PenTool, BookOpen, Layers, Lock, ChevronDown, FileSpreadsheet, MessageSquare, ArrowDown, Wallet, CreditCard, Building, Smartphone, MessageCircleQuestion, AlarmClock, Zap, Target)
- 폰트: Open Sans / Proxima Nova(sans-serif) + Source Serif 4(serif italic 강조용) — CSS font-family로 시도, 폴백 system
- 이미지: SVG inline 차트 + 가짜 강사 portrait(SVG path), 외부 placeholder 없음
- 폼: 없음 (외부 결제 페이지 가정)

---

## 6. 고객에게 받을 정보 체크리스트

### 필수 정보
- [ ] **브랜드명 / 코스명** (예: 랭킹메이커)
- [ ] **코스 한 줄 정의** (서브카피 용)
- [ ] **메인 헤드라인 후킹** (결과 약속 / 문제 해결 / 역설 중 1)
- [ ] **타겟 대상** (예: 1인 사업자 · 프리랜서 · 부업 시작자)
- [ ] **기수/정원** (예: 5기 모집 · 한정 200명)
- [ ] **얼리버드 마감일** (카운트다운 타겟 ISO 일시)
- [ ] **정가 / 할인가 / 할인율** (예: 799,000 / 399,000 / 50%)
- [ ] **월 분납 금액** (12개월 무이자 기준)
- [ ] **CTA 문구** (1차 큰 버튼 / 보조 ghost)

### 섹션별 콘텐츠
- [ ] **페인 포인트** 5개 (구체적 상황 + 감정 카피)
- [ ] **공감 카피** ("다 겪어봤습니다" 마무리 1문장)
- [ ] **솔루션 한 줄 정의** (Serif italic 강조 카피)
- [ ] **핵심 가치 3개** (검증된 방법론/평생 소장/실시간 코칭 형태)
- [ ] **Before 리스트** 7개 + **After 리스트** 7개 (강조 숫자 포함)
- [ ] **강사 정보**: 이름, 한 줄 정체성, 3문단 스토리, 자격/경력 6개
- [ ] **결과(Outcome) 6개**: 큰 아이콘 + 결과형 헤딩 + 1~2줄 설명
- [ ] **후기 9개**: Featured 1개(인용 + 결과 통계) + 카드 8개(이니셜/이름/직업/배지/본문) + 전체 후기 페이지 링크
- [ ] **커리큘럼 모듈 7개** × 모듈명 + 강의 수 + 총 시간 + 워크북 페이지 + 강의 5~8개(제목/길이/free 여부) 또는 body 한 줄
- [ ] **메타**: 총 모듈/강의 수/총 시간/워크북 페이지 수
- [ ] **보너스 4개**: 가치(원) + 제목 + 설명, 총 가치 합계
- [ ] **포함 항목 7개**: 제목 + 보조 설명
- [ ] **환불 카피 + 조건 1줄**
- [ ] **FAQ 8개**
- [ ] **잔여 자리 수** (예: 37/200, 채워진 % 자동 계산)
- [ ] **결제 수단** 라벨 4개 (카드/계좌이체/카카오페이/네이버페이 등)

### 비주얼 자산
- [ ] 강사 portrait 사진 (4:5 비율, 없으면 placeholder 유지)
- [ ] 강의 미리보기 영상 썸네일 (선택)
- [ ] 수강생 소속 로고/텍스트 (현재 텍스트)
- [ ] (선택) 결과 스크린샷 / 대시보드 캡처

### 사업자 정보 (푸터용)
- [ ] 법인/대표자명
- [ ] 사업자등록번호
- [ ] 통신판매업 신고번호
- [ ] 주소 + 전화번호
- [ ] 운영시간
- [ ] 문의 이메일 (일반 + B2B)
- [ ] 약관 / 개인정보 / 환불 정책 URL

---

## 7. 권장 디자인 톤 (이 유형과 잘 맞는 톤)

- 1순위: Peach Base + Deep Teal Accent (구현됨) — 강한 후킹 컬러 vs 안정감 있는 다크 톤이 롱폼 페이지의 단조로움을 깨고 섹션별 호흡을 만들어줌
- 2순위: Vivid Colorful — 클래스101 톤. 정보성 상품의 활기/대중성 강조
- 비추: 미니멀 모노톤 — 롱폼 구간에서 시선 유도가 약해 스크롤 이탈 위험

---

## 8. 흔한 변형/맞춤 요청 (운영 누적 시 업데이트)

- (운영 후 추가)

---

## 9. 관련 자료

- 시안 생성 프롬프트: `PROMPT.md`
- 결과물 코드: `RESULT.tsx`
- 라이브 URL: `https://ddpage.kr/portfolio/sales`
- 미리보기: `preview.html`
