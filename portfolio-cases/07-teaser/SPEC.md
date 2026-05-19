# 07 사전예약/티저형 랜딩페이지 SPEC

> 결과물: `app/portfolio/teaser/page.tsx`
> 케이스 폴더: `portfolio-cases/07-teaser/`
> 작성일: 2026-05-19

---

## 1. 기본 정보

- **유형**: 사전예약/티저형 (Coming Soon · 미스터리 톤 + 풀패키지 브랜드 티저)
- **목적**: 출시 전 기대감 조성 + 이메일 사전예약자 확보 + 브랜드 톤 사전 노출
- **사용 디자인 시스템**: Deep Indigo Base (#21164c) + Pastel Accent (Pink #ffaae6 / Cyan #bcf2ff / Lime #a2ea13 / Violet #592eff) + Serif(Noto Serif KR / Nanum Myeongjo) × Sans(Montserrat) 믹스
- **참고 레퍼런스**: 절제된 럭셔리 라이프스타일 브랜드의 Coming Soon (예: Aesop/Le Labo/Norm Architects 톤 + 한국 공예 정서)
- **예상 작업 시간**: 시안 25~35분 + 통합 10~15분 ≈ 35~50분
- **샘플 스코프 메모**: 루트 PROMPT.md의 "1 풀스크린 히어로 + 5섹션" 미니멀 버전보다, 실제 시안은 11섹션 풀세트(컬렉션/소재/저니/파운더 노트/FAQ 포함)로 확장됨

---

## 2. 적합한 사업 (고객 매칭용)

이 템플릿이 잘 맞는 케이스:
- 라이프스타일/오브제/홈데코 브랜드 런칭
- 디자인 스튜디오의 새 컬렉션 사전 공개
- 향수/뷰티/의류 등 감성 D2C 브랜드 1차 런칭
- 책/매거진/굿즈 같은 한정 수량 발매 사전예약
- 공예 작가의 작품 컬렉션 오픈
- 멤버십 사전 모집 (한정 정원 + 이메일 캡처)

---

## 3. 구현된 섹션 구조

실제 코드(page.tsx)에서 확인된 섹션 순서.

### 섹션 1: HERO (풀스크린)
- **구성**: `min-h-screen` 풀스크린 다크(#21164c) + 데코 outlined SVG 3개(좌상 별/원, 우하 wave, 우상 4-point star). 상단 sticky 헤더(brand mark + NOUN + md 메뉴 4개). 중앙 스택: Coming soon 배지(eyebrow pulse dot) → 64~84px 헤드라인 + pink 강조 단어 → 부제 2줄 → 카운트다운 4셀(d/h/m/s, 92px min-width 카드) → 이메일 폼(rounded-full, focus-within 강조, data-done 성공 상태) → 성공 메시지 페이드인 → 누적 가입자 trust strip(아바타 3개 + count)
- **인터랙션**:
  - `useEffect` + `setInterval(1s)`로 카운트다운 갱신, `localStorage`에 launch target 시드 저장
  - `useState`로 email/done/trustCount 관리
  - 폼 onSubmit에서 email regex 검증 → `console.log` → `setDone(true)` → trustCount++
  - `data-done` 속성으로 form/success 메시지 시각 상태 전환
- **콘텐츠 슬롯**: 브랜드 로고/이름, 카운트다운 타겟(현재 +30일 자동 시드), 메인 헤드라인 2줄, 부제 2줄, 폼 placeholder/CTA, 성공 메시지, 누적 가입자 수

### 섹션 2: ABOUT teaser
- **구성**: 다크 배경 유지, 중앙 정렬 좁은 max-w(720px) 캡슐. caption(About) → 22~30px sans-serif 단락 (pink 강조 1구절) → "SEE YOU SOON" letter-spaced bold caption
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 3~4문장 브랜드 정의 카피, signoff caption

### 섹션 3: MANIFESTO
- **구성**: 2열 그리드(`1fr_2.4fr`). 좌: Manifesto eyebrow + 4년의 준비 캡션. 우: Serif italic 거대 quote(`::before`로 좌상 88px 핑크 curly mark, 모바일에서 위치 보정). 980px 이하에서 1열로 fallback
- **인터랙션**: 없음 (순수 typography + ::before 의사요소)
- **콘텐츠 슬롯**: 매니페스토 caption, 4문장 인용 quote

### 섹션 4: FIRST-LOOK COLLECTION (`#collection`)
- **구성**: 헤더(좌 The first chapter + 헤딩 / 우 보조 카피) + 3×2 그리드(`ddpage-teaser-collection-grid` — 데스크 3열, 980px 2열, 720px 1열). 각 카드: 4:5 비율, 다크 그라데이션 배경(각각 다른 색), 좌상 No.NN + 우상 카테고리 chip(border-round), 중앙에 absolute SVG art(50% 크기, accent 컬러 stroke), 좌하 영문 name + Serif 한글 부제
- **인터랙션**: hover 시 `translateY(-2px)` (`.ddpage-teaser-obj`)
- **콘텐츠 슬롯**: 6 오브제 × (no/chip/name/kr/bg/stroke/art SVG)

### 섹션 5: MATERIALS & CRAFT (`#craft`)
- **구성**: 중앙정렬 헤더(Materials & craft eyebrow + 헤딩 + 1줄 설명) + 4×1 그리드(`ddpage-teaser-craft-grid` — 데스크 4열, 980px 2열, 720px 1열). 각 카드: 4:3 swatch(CSS gradient로 oak/linen/onggi/brass 텍스처 구현) + 본문(M/NN + name + 한글 부제)
- **인터랙션**: 없음 (순수 CSS 텍스처)
- **콘텐츠 슬롯**: 4 소재 × (no/name/kr/swatch class)

### 섹션 6: BENEFITS (light)
- **구성**: 흰 배경으로 톤 전환, 좌측 정렬 헤딩 + 우측 보조 카피. 3개 `BenefitCard` 그리드(rounded-26 + tinted icon 박스 + num + title + body, hover violet 보더). 하단 한정 자리 바: 360/500 남음 + 72% 프로그래스 바
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 혜택 3개(평생 20% 할인 / 7일 먼저 입장 / 한정 오브제 키트), 한정 수량 표시 + 진행률

### 섹션 7: JOURNEY (`#journey`)
- **구성**: 흰 배경, 중앙 헤더(Journey eyebrow + 헤딩) + 좌측 세로 타임라인 트랙(`ddpage-teaser-journey-track`, border-left + 도트). 각 step: `120px_1fr` 그리드, 좌 연도(28px bold), 우 title + 본문. `data-current="true"`인 step은 violet 도트 + glow ring + 보라 badge "In 30 days"
- **인터랙션**: 없음 (정적 타임라인)
- **콘텐츠 슬롯**: 4단계 (2022 시작 / 2024 시제품 / 2025 비공개 베타 / 2026 정식 공개·current)

### 섹션 8: FOUNDER'S NOTE
- **구성**: light gray(#eeeeee) 배경, 2열(`1fr_2fr`). 좌: 3:4 portrait placeholder(보라 그라데이션 + radial overlay + 80px 흰 이니셜 SJ). 우: A note from the founder eyebrow → Serif 28px quote → Serif 본문 단락 → 서명(서지윤 + 직책). 980px 이하 1열 + portrait 16:9로 fallback
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 파운더 이니셜/portrait, 인용 1줄, 본문 2~3문장, 이름/직책

### 섹션 9: FAQ (`#faq`)
- **구성**: 흰 배경, 2열(`320px_1fr`). 좌: FAQ eyebrow + 헤딩 + 1줄 안내 + 메일 링크. 우: `<details>/<summary>` 아코디언 리스트 5개. summary 우측 `+/×` 커스텀 아이콘(`::before/::after` 두 막대, open 시 세로 막대 `scaleY(0)`로 → 가로 막대만 보임)
- **인터랙션**: native `<details>` 토글 + 의사요소 transition + open 시 violet 컬러 전환
- **콘텐츠 슬롯**: FAQ 5개(사전예약 절차 / 20% 할인 / 한정 굿즈 / 해외 배송 / 오프라인 매장)

### 섹션 10: SOCIAL
- **구성**: 다크 배경 복귀, 중앙정렬 컬럼. Stay tuned 헤딩 → 1줄 안내 → 4개 `SocialIcon`(rounded-18 border, 56px, hover 강조)
- **인터랙션**: 없음
- **콘텐츠 슬롯**: 4 SNS 아이콘 — Instagram(inline SVG), X(lucide X close icon as Twitter glyph), YouTube(inline SVG), Threads(lucide AtSign), 핸들 @noun.studio

### 섹션 11: FOOTER
- **구성**: 다크 배경, 좌(브랜드 dot + NOUN Studio · Seoul + © 카피라이트 + "포트폴리오용 샘플 작업입니다") + 우(`<Link href="/portfolio">← 다른 포트폴리오 보기</Link>` + 개인정보/이용약관 링크 3개)
- **콘텐츠 슬롯**: 브랜드 카피라이트, 정책 링크 3개

---

## 4. 인터랙티브 요소

- [x] 카운트다운 타이머 (useState + useRef + useEffect + setInterval(1s), localStorage 시드)
- [x] 이메일 폼 (useState email/done/trustCount, regex 검증, console.log, 시각 상태 전환 via `data-done`)
- [x] 성공 메시지 페이드인 (`data-on` + opacity/transform transition)
- [x] FAQ 아코디언 (native `<details>/<summary>` + 의사요소 +/× 아이콘 회전)
- [x] CSS keyframes 펄스 닷 (`ddpage-teaser-pulse`)
- [x] 카드 hover lift (`.ddpage-teaser-obj` translateY)
- [x] `:focus-within`으로 폼 상태 전환
- [x] In-page anchor (`#collection`, `#craft`, `#journey`, `#faq`)
- [ ] 탭 전환
- [ ] 라이브 채팅/캘린더 등 외부 위젯

---

## 5. 기술 스택

- Framework: Next.js 16 App Router (`'use client'`)
- Language: TypeScript (state types: `Remaining`, OBJECTS/MATERIALS/JOURNEY/FAQ 데이터 타입 명시)
- Styling: Tailwind CSS 4 (arbitrary values 다수: `text-[clamp(40px,6.4vw,84px)]` 등) + `<style dangerouslySetInnerHTML>`로 주입된 `.ddpage-teaser` 스코프 CSS (keyframes, :focus-within, ::before/::after 아이콘, 4개 swatch background gradient, journey timeline 도트, manifesto pull-quote, FAQ 아이콘, 반응형 grid fallback)
- 아이콘: lucide-react (XIcon, AtSign, Gift, DoorOpen, Package) + 인라인 SVG 컴포넌트 2개(InstagramGlyph, YoutubeGlyph) — lucide v1에서 브랜드 아이콘 제거됨에 따라 통합 단계에서 추가
- 폰트: Montserrat(sans) + Noto Serif KR / Nanum Myeongjo(serif) — CSS font-family로 시도, 폴백 system
- 이미지: 외부 placeholder URL 없음 — 6 오브제는 inline SVG art, 4 소재는 CSS gradient, founder portrait는 CSS gradient + 이니셜
- 로컬 저장소: `localStorage` 키 `noun-launch-target` (페이지 첫 로드 시 +30일 시드, 재방문 시 같은 시점 유지)
- 폼: console.log + state 기반 가짜 성공 메시지

---

## 6. 고객에게 받을 정보 체크리스트

### 필수 정보
- [ ] **브랜드명** (영문 + 한글 발음, 예: NOUN / 노운)
- [ ] **카테고리/한 줄 정의** (예: 라이프스타일 / 데일리 오브제)
- [ ] **출시 예정일** (ISO 일시 또는 "+N일")
- [ ] **메인 헤드라인** (2줄, 미스터리 톤)
- [ ] **부제** (1~2줄, 카테고리/약속 힌트)
- [ ] **목표 사전예약자 수** (trust strip 시작값, 예: 2,847명)

### 섹션별 콘텐츠
- [ ] **ABOUT teaser**: 3~4문장 절제 카피, signoff 캡션
- [ ] **MANIFESTO**: pull-quote 4문장, manifesto eyebrow 캡션
- [ ] **COLLECTION 6 오브제** × (No/카테고리 chip/영문 name/한글 부제/배경 그라데이션 컬러/accent stroke 컬러/SVG art 또는 placeholder 일러스트)
- [ ] **MATERIALS 4 소재** × (No/영문 name/한글 부제/swatch 텍스처 종류: 나무결/리넨/도자/금속 등)
- [ ] **BENEFITS 3 혜택** × (번호/아이콘/타이틀/1~2줄 설명) + 한정 수량(예: 500개 / 남은 자리 360)
- [ ] **JOURNEY 4단계** × (연도/제목/2~3문장 설명/current 여부/badge)
- [ ] **FOUNDER'S NOTE**: 파운더 이니셜/사진, 인용 1줄, 본문 2~3문장, 이름/직책
- [ ] **FAQ 5개** (질문 + 답 1~3문장)
- [ ] **SNS 핸들 + 4개 링크** (Instagram/X/YouTube/Threads 등)

### 비주얼 자산
- [ ] (선택) 컬렉션 오브제 6점 — 출시 후 실 사진으로 교체, 사전공개 단계에는 SVG art 유지
- [ ] (선택) 파운더 사진 — 3:4 비율, 없으면 이니셜 placeholder 유지
- [ ] (선택) 소재 사진 — CSS gradient swatch가 기본, 실 사진으로 교체 가능

### 사업자 정보 (푸터용)
- [ ] 스튜디오/법인명 + 본사 도시
- [ ] 카피라이트 연도
- [ ] 문의 메일 (FAQ 섹션 + 푸터)
- [ ] 개인정보 처리방침 / 이용약관 URL

---

## 7. 권장 디자인 톤 (이 유형과 잘 맞는 톤)

- 1순위: Deep Indigo + Pastel Pop (구현됨) — 미스터리 + 절제 + 한국 공예 정서를 동시에. 사전 정보를 적게 노출하면서도 4년의 준비 같은 시간감을 줌
- 2순위: 모노톤 화이트 (Aesop/Norm Architects 톤) — 더 미니멀한 미스터리, 라이프스타일·뷰티 브랜드에 적합
- 3순위: Vivid Sunset 그라데이션 — 디지털 네이티브 브랜드, 게이밍/뮤지션 등 활기 있는 톤
- 비추: 비비드 컬러 풀 채도 — 미스터리·기대감보다 직설적 마케팅 톤이 되어 "Coming Soon" 분위기와 충돌

---

## 8. 흔한 변형/맞춤 요청 (운영 누적 시 업데이트)

- (운영 후 추가)

---

## 9. 관련 자료

- 시안 생성 프롬프트: `PROMPT.md`
- 결과물 코드: `RESULT.tsx`
- 라이브 URL: `https://ddpage.kr/portfolio/teaser`
- 미리보기: `preview.html`
