# 08 1인 프로필형 랜딩페이지 SPEC

> 결과물: `app/portfolio/profile/page.tsx`
> 케이스 폴더: `portfolio-cases/08-profile/`
> 작성일: 2026-05-19

---

## 1. 기본 정보

- **유형**: 1인 프로필형 (Link in Bio 대체 · 모바일 퍼스트)
- **목적**: 작가·크리에이터의 채널/링크 허브 + 최신 작업 1점 강조 + 외부 컨택 진입
- **사용 디자인 시스템**: Firecrawl 화이트보드 톤 — Dot-grid Cloud Canvas(#e5e7eb 바탕 + radial dot 24px grid) + Fire Orange(#ff4d00) 단일 액센트 + Paper White(#f9f9f9) 카드 + 풍부한 다층 shadow + Inter sans / Geist Mono 믹스
- **참고 레퍼런스**: Firecrawl 사이트의 카드/그림자 시스템 + Linktree/Bento 같은 1인 프로필 허브 + 한국 에세이 작가 톤
- **예상 작업 시간**: 시안 15~20분 + 통합 5분 ≈ 20~25분 (가장 단순한 케이스)
- **샘플 스코프 메모**: PROMPT.md의 7섹션과 거의 일치. 인터랙션은 hover lift + pulse dot만 있어서 서버 컴포넌트로 출력됨

---

## 2. 적합한 사업 (고객 매칭용)

이 템플릿이 잘 맞는 케이스:
- 작가 / 에세이스트 / 칼럼니스트
- 강연자 / 코치 / 전문가 컨설턴트
- 유튜버 / 팟캐스터 / 뉴스레터 운영자
- 일러스트레이터 / 디자이너 / 사진가 (작품 허브가 따로 있을 때 입구용)
- 작은 출판사 / 독립 매거진의 대표 페이지
- SNS 프로필 링크에 들어갈 "한 페이지 명함" 용도

---

## 3. 구현된 섹션 구조

실제 코드(page.tsx)에서 확인된 섹션 순서. 전체가 `max-w-md` 단일 컬럼.

### 섹션 1: PROFILE CARD
- **구성**: 흰 카드(`ddpage-profile-card`, 20px radius, 다층 shadow + 10px paper border). 중앙정렬: 104px 원형 아바타(linear-gradient pink + 6px paper-white 외곽 ring + drop shadow + 이니셜 "지" 36px fire orange) → 이름(28px 500 weight) → 한 줄 정체성(stone gray) → mono 메타 라인(MapPin + "서울" · "에세이 작가 · 독립 출판인") → 자기소개 단락(280px max-w, 14px line 1.65) → primary fire-orange pill CTA(BookOpen + 최신 책 구매 + ArrowUpRight) → mono pulse dot + "새 글 매주 화요일 발행"
- **인터랙션**: pulse dot keyframes(`ddpage-profile-pulse`, 1.6s ease-out infinite)
- **콘텐츠 슬롯**: 아바타(이니셜 또는 사진), 이름, 정체성 1줄, 위치 + 직업 카테고리, 자기소개 2~3문장, 메인 CTA 텍스트/링크, 발행 캐던스 카피

### 섹션 2: LINK CARDS
- **구성**: 캡션(Links, 10px uppercase) + 6개 링크 카드 vertical stack(gap 3). 각 카드 = paper-white 16px radius + 36px icon box(cloud-canvas 배경, rounded-10) + title(14.5px 500) + 보조 meta(12px slate gray, metaMono 옵션 적용 시 Geist Mono) + 우측 ArrowUpRight(silver-mist)
- **인터랙션**: hover `translateY(-2px)` + shadow 강화, active `scale(0.995)` (200ms cubic-bezier(0.16,1,0.3,1))
- **콘텐츠 슬롯**: 6개 링크 × (lucide 아이콘 / 제목 / 보조 메타 / href / metaMono 여부)
  - 뉴스레터 · 강의 · 인스타그램 · 유튜브 · 팟캐스트 · 컨택

### 섹션 3: LATEST HIGHLIGHT
- **구성**: 캡션(좌 "Latest" / 우 mono 발행일) + 단일 highlight 카드(paper-white, hover lift). 16:10 cover(pink linear gradient + SVG 그리드 패턴 + 중앙 mono pill "essay · vol.47") + 본문(카테고리 캡션 fire orange + 16px 제목 + 13px 한 줄 설명 + "읽어보기 →")
- **인터랙션**: hover `translateY(-2px)`
- **콘텐츠 슬롯**: 최신 콘텐츠 1점 (커버 placeholder, 카테고리, 제목, 1줄 설명, 발행일, 외부 링크)

### 섹션 4: SNS QUICK ROW (Elsewhere)
- **구성**: 캡션 "Elsewhere" 중앙 + 6개 원형 SNS 아이콘(40px paper-white 배경, hover ink black + translateY -1px)
- **인터랙션**: 아이콘 hover 컬러/lift
- **콘텐츠 슬롯**: 6 SNS 링크 — X(Twitter inline SVG), Instagram(inline SVG), Threads(lucide AtSign), YouTube(inline SVG), RSS(lucide Rss), Email(lucide Mail)

### 섹션 5: FOOTER
- **구성**: hairline(`ddpage-footer-divider`) + 중앙정렬. `<Link href="/portfolio">` (좌 ArrowLeft + "다른 포트폴리오 보기", 12px stone gray) → mono 카피라이트(10px silver mist, "© 2026 김지온 — 포트폴리오용 샘플 작업입니다")
- **콘텐츠 슬롯**: 카피라이트, 샘플 안내

---

## 4. 인터랙티브 요소

- [x] CSS hover lift (링크 카드 / SNS 아이콘 / highlight 카드)
- [x] CSS active scale (링크 카드)
- [x] Pulse dot keyframes (`ddpage-profile-pulse`)
- [x] 외부 링크 자동 분기 (`href`가 `http`/`mailto:`로 시작하면 `target="_blank" rel="noopener noreferrer"`)
- [ ] 카운트다운
- [ ] 폼 입력 (없음 — 채널 진입만)
- [ ] 탭/아코디언

서버 컴포넌트로 출력 (`'use client'` 없음).

---

## 5. 기술 스택

- Framework: Next.js 16 App Router (서버 컴포넌트, no `'use client'`)
- Language: TypeScript (LinkItem 타입 명시)
- Styling: Tailwind CSS 4 + `<style dangerouslySetInnerHTML>`로 주입된 `.ddpage-profile` 스코프 CSS (CSS variables로 컬러 토큰 7종 + shadow-xl/shadow-xl-3 다층 그림자 + keyframes pulse)
- 아이콘: lucide-react (ArrowLeft, ArrowRight, ArrowUpRight, AtSign, BookOpen, GraduationCap, Mail, MapPin, MessageSquare, Mic, Rss) + 인라인 SVG glyph 3개(InstagramGlyph, TwitterGlyph, YoutubeGlyph) — lucide v1에서 브랜드 아이콘 제거되어 통합 단계에서 교체
- 폰트: Inter (메인 sans) + Geist Mono (mono 강조 — 위치/메타/카피라이트/날짜)
- 이미지: 외부 placeholder URL 없음 — 아바타는 CSS gradient + 이니셜, highlight 커버는 SVG 그리드 패턴 + 가짜 vol 배지
- 폼: 없음 (Link in Bio 허브 페이지)
- 레이아웃: `max-w-md` (28rem) 단일 컬럼, 모바일 퍼스트, 좌우 padding 16px

---

## 6. 고객에게 받을 정보 체크리스트

### 필수 정보
- [ ] **이름**
- [ ] **한 줄 정체성** (예: "느린 글을 쓰는 사람")
- [ ] **직업 카테고리** (예: 에세이 작가 · 독립 출판인)
- [ ] **위치** (예: 서울)
- [ ] **자기소개** 2~3문장
- [ ] **메인 CTA** (가장 강조하고 싶은 액션 1개 — 책 구매 / 코칭 신청 / 메인 채널 등) + 링크
- [ ] **발행 캐던스 카피** (선택, pulse dot 옆 짧은 한 줄)

### 링크 카드 (5~7개 권장)
- [ ] 각 카드 × (아이콘 / 제목 / 보조 설명 / URL / metaMono 여부)
- 예시 종류: 뉴스레터, 강의, 인스타그램, 유튜브, 팟캐스트, 블로그, 컨택(이메일)
- 보조 설명에는 구독자 수 / 캐던스 / 핸들 등 구체적 신뢰 신호

### LATEST / Highlight (선택)
- [ ] 최신 콘텐츠 1점 × (카테고리, 제목, 1줄 설명, 발행일, 외부 URL, 커버 이미지 또는 placeholder)

### SNS Quick Row
- [ ] 6개 내외 SNS 핸들/URL (X, Instagram, Threads, YouTube, RSS, Email)

### 아바타
- [ ] 프로필 사진 (정사각 권장, 없으면 이니셜 1글자)
- [ ] 아바타 그라데이션 컬러 (브랜드 톤 맞춤)

### 푸터
- [ ] 카피라이트 표기 (연도 + 이름)

---

## 7. 권장 디자인 톤 (이 유형과 잘 맞는 톤)

- 1순위: 화이트보드/모눈 도트 그리드 + 단일 액센트 (구현됨) — 도구적 느낌으로 1인 크리에이터의 작업 도구 같은 인상. 글 쓰는 사람·뉴스레터 운영자에 잘 맞음
- 2순위: 부드러운 그라데이션 + 라운드 카드 — 일러스트·디자이너·뮤지션
- 3순위: 다크 미니멀 + 1픽셀 보더 — 개발자·디자인 디렉터
- 비추: 과도한 비비드 컬러 / 사진 풀블리드 배경 — 모바일 인앱 브라우저에서 가독성 떨어짐, 첫 1초에 신뢰감 약함

---

## 8. 흔한 변형/맞춤 요청 (운영 누적 시 업데이트)

- (운영 후 추가)

---

## 9. 관련 자료

- 시안 생성 프롬프트: `PROMPT.md`
- 결과물 코드: `RESULT.tsx`
- 라이브 URL: `https://ddpage.kr/portfolio/profile`
- 미리보기: `preview.html`
