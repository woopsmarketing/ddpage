'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Check, X, Plus, Search, MapPin, Train, Building2 } from 'lucide-react'

/* =========================================================================
   Scoped styles — ddpage-makecon
   Tailwind v4 (@theme based) is assumed in app/globals.css.
   All custom selectors are prefixed `.ddpage-makecon`.
   ========================================================================= */
const SCOPED_CSS = `
.ddpage-makecon {
  --ink: #1d1d1f; --graphite: #707070; --slate: #474747;
  --fog: #f5f5f7; --snow: #ffffff; --obsidian: #000000;
  --mist: #e8e8ed; --azure: #0071e3; --cobalt: #0066cc; --caution: #b64400;

  background: var(--fog);
  color: var(--ink);
  font-family: 'SF Pro Text','Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17px; line-height: 1.47; letter-spacing: -0.1px;
  font-feature-settings: "numr";
  word-break: keep-all;
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
}
.ddpage-makecon h1,
.ddpage-makecon h2,
.ddpage-makecon h3,
.ddpage-makecon h4 {
  font-family: 'SF Pro Display','Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  margin: 0; color: var(--ink);
}

.ddpage-makecon .display     { font-size: clamp(56px, 9vw, 96px); font-weight: 700; line-height: 1.04; letter-spacing: -2.11px; }
.ddpage-makecon .heading-lg  { font-size: clamp(40px, 5.6vw, 56px); font-weight: 700; line-height: 1.07; letter-spacing: -0.9px; }
.ddpage-makecon .heading     { font-size: clamp(28px, 3.4vw, 40px); font-weight: 700; line-height: 1.17; letter-spacing: -0.6px; }
.ddpage-makecon .heading-sm  { font-size: 24px; font-weight: 600; line-height: 1.29; letter-spacing: -0.36px; }
.ddpage-makecon .subheading  { font-size: 20px; font-weight: 300; line-height: 1.4;  letter-spacing: -0.2px; }
.ddpage-makecon .body-sm     { font-size: 14px; line-height: 1.43; letter-spacing: -0.04px; }
.ddpage-makecon .caption     { font-size: 12px; line-height: 1.33; letter-spacing: -0.26px; color: var(--graphite); }
.ddpage-makecon .light-display { font-weight: 300 !important; letter-spacing: -2.6px; }

.ddpage-makecon .btn-azure {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--azure); color: #fff; border: 0; cursor: pointer;
  border-radius: 999px; padding: 12px 22px;
  font-size: 17px; font-weight: 400; letter-spacing: -0.1px;
  transition: background-color .1s ease, transform .1s ease;
}
.ddpage-makecon .btn-azure:hover  { background: #0077ED; }
.ddpage-makecon .btn-azure:active { transform: scale(0.96); }

.ddpage-makecon .btn-dark {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--obsidian); color: #fff; border: 0; cursor: pointer;
  border-radius: 999px; padding: 12px 22px;
  font-size: 17px; font-weight: 400; letter-spacing: -0.1px;
  transition: background-color .1s ease, transform .1s ease;
}
.ddpage-makecon .btn-dark:hover  { background: #1d1d1f; }
.ddpage-makecon .btn-dark:active { transform: scale(0.96); }

.ddpage-makecon .link-chev { color: var(--cobalt); font-size: 17px; }
.ddpage-makecon .link-chev::after { content: " \\203A"; }
.ddpage-makecon .link-chev:hover { text-decoration: underline; }

.ddpage-makecon .card     { background: var(--snow); border-radius: 28px; padding: 40px; }
.ddpage-makecon .card-fog { background: var(--fog);  border-radius: 28px; padding: 40px; }

.ddpage-makecon .global-nav {
  position: sticky; top: 0; z-index: 50;
  background: rgba(250,250,252,0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  height: 44px;
}
.ddpage-makecon .global-nav__inner {
  max-width: 1024px; margin: 0 auto; padding: 0 22px;
  height: 100%; display: flex; align-items: center; justify-content: space-between;
  font-size: 12px;
}
.ddpage-makecon .global-nav a { color: var(--ink); text-decoration: none; }
.ddpage-makecon .global-nav a:hover { opacity: 0.6; }

.ddpage-makecon .sub-nav {
  position: sticky; top: 44px; z-index: 49;
  background: rgba(250,250,252,0.94);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 1px solid var(--mist);
  height: 52px;
}
.ddpage-makecon .sub-nav__inner {
  max-width: 1200px; margin: 0 auto; padding: 0 22px;
  height: 100%; display: flex; align-items: center; justify-content: space-between;
  font-size: 14px;
}
.ddpage-makecon .sub-nav a { color: var(--slate); text-decoration: none; }
.ddpage-makecon .sub-nav a:hover { color: var(--ink); }

.ddpage-makecon .count-cell {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: var(--snow); border-radius: 18px; padding: 16px 20px; min-width: 92px;
}
.ddpage-makecon .count-num {
  font-family: 'SF Pro Display','Inter', sans-serif;
  font-size: 48px; font-weight: 700; line-height: 1; letter-spacing: -1.4px;
  font-variant-numeric: tabular-nums;
}
.ddpage-makecon .count-label {
  font-size: 12px; color: var(--graphite); margin-top: 6px;
  letter-spacing: 0.4px; text-transform: uppercase;
}

.ddpage-makecon .info-row {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  background: var(--snow); border-radius: 22px; overflow: hidden;
}
.ddpage-makecon .info-cell { padding: 22px 24px; }
.ddpage-makecon .info-cell + .info-cell { box-shadow: inset 1px 0 0 var(--mist); }

.ddpage-makecon .portrait {
  aspect-ratio: 1 / 1; border-radius: 28px;
  background: radial-gradient(120% 80% at 50% 0%, #ffffff 0%, #f5f5f7 55%, #e8e8ed 100%);
  position: relative; overflow: hidden;
}
.ddpage-makecon .portrait__initials {
  font-family: 'SF Pro Display','Inter', sans-serif;
  font-weight: 700; font-size: 96px; letter-spacing: -2px;
  color: rgba(29,29,31,0.18);
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-58%);
  user-select: none;
}

.ddpage-makecon .tt-row {
  display: grid; grid-template-columns: 140px 1fr 200px;
  gap: 28px; align-items: baseline;
  padding: 28px 0; border-bottom: 1px solid var(--mist);
}
.ddpage-makecon .tt-row:last-child { border-bottom: 0; }
.ddpage-makecon .tt-time   { font-family: 'SF Pro Display','Inter', sans-serif; font-weight: 600; font-size: 22px; letter-spacing: -0.3px; font-variant-numeric: tabular-nums; }
.ddpage-makecon .tt-title  { font-size: 22px; font-weight: 600; letter-spacing: -0.4px; }
.ddpage-makecon .tt-speaker{ color: var(--graphite); font-size: 15px; text-align: right; }
.ddpage-makecon .tt-row--break { background: var(--fog); border-radius: 18px; padding: 22px 28px; border: 0; margin: 8px 0; }
.ddpage-makecon .tt-row--break .tt-title { color: var(--slate); font-weight: 500; }

.ddpage-makecon .price-card { background: var(--snow); border-radius: 28px; padding: 36px; display: flex; flex-direction: column; gap: 20px; height: 100%; }
.ddpage-makecon .price-card--featured { background: var(--obsidian); color: #fff; }
.ddpage-makecon .price-card--featured h3 { color: #fff; }
.ddpage-makecon .price-card--featured .check { background: rgba(255,255,255,0.1); color: #fff; }
.ddpage-makecon .check {
  display: inline-flex; width: 22px; height: 22px; border-radius: 999px;
  background: var(--fog); color: var(--ink);
  align-items: center; justify-content: center; flex-shrink: 0;
}

.ddpage-makecon .field-label { display: block; font-size: 13px; color: var(--slate); margin-bottom: 8px; font-weight: 500; }
.ddpage-makecon .field-input, .ddpage-makecon .field-select {
  width: 100%; padding: 14px 18px; border-radius: 14px; border: 1px solid var(--mist);
  background: var(--snow); font: inherit; color: var(--ink);
  transition: border-color .2s ease, box-shadow .2s ease;
}
.ddpage-makecon .field-input:focus, .ddpage-makecon .field-select:focus {
  outline: 0; border-color: var(--azure); box-shadow: 0 0 0 4px rgba(0,113,227,0.15);
}
.ddpage-makecon .radio-tile {
  border: 1px solid var(--mist); background: var(--snow); border-radius: 14px;
  padding: 16px 18px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;
  transition: border-color .15s ease;
  width: 100%; text-align: left;
}
.ddpage-makecon .radio-tile:hover { border-color: #c8c8cf; }
.ddpage-makecon .radio-tile.is-selected { border-color: var(--ink); }
.ddpage-makecon .radio-dot { width: 18px; height: 18px; border-radius: 999px; border: 1.5px solid var(--mist); background: #fff; position: relative; flex-shrink: 0; }
.ddpage-makecon .radio-tile.is-selected .radio-dot { border-color: var(--ink); }
.ddpage-makecon .radio-tile.is-selected .radio-dot::after {
  content:""; position:absolute; inset:3px; border-radius:999px; background: var(--ink);
}

.ddpage-makecon .faq-trigger {
  width: 100%; text-align: left; padding: 28px 0; background: transparent; border: 0; cursor: pointer;
  display: flex; align-items: center; justify-content: space-between; gap: 20px;
  font-size: 22px; font-weight: 500; letter-spacing: -0.3px; color: var(--ink);
  font-family: inherit;
}
.ddpage-makecon .faq-item { border-bottom: 1px solid var(--mist); }
.ddpage-makecon .faq-body { max-height: 0; overflow: hidden; transition: max-height .3s ease; }
.ddpage-makecon .faq-item.is-open .faq-body { max-height: 400px; }
.ddpage-makecon .faq-item.is-open .faq-trigger .chev { transform: rotate(45deg); }
.ddpage-makecon .chev { transition: transform .2s ease; flex-shrink: 0; }

.ddpage-makecon .final-stage {
  background:
    radial-gradient(50% 60% at 50% 0%, rgba(0,113,227,0.18) 0%, transparent 60%),
    var(--obsidian);
  color: #fff; border-radius: 28px; padding: 96px 40px;
  text-align: center; overflow: hidden; position: relative;
}
.ddpage-makecon .final-stage h2 { color: #fff; }
.ddpage-makecon .final-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 14px; border-radius: 999px;
  background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.85);
  font-size: 13px;
}
.ddpage-makecon .pulse-dot {
  width: 8px; height: 8px; border-radius: 999px; background: #ff6b3d;
  box-shadow: 0 0 0 0 rgba(255,107,61,0.6);
  animation: ddpage-makecon-pulse 1.6s ease-out infinite;
}
@keyframes ddpage-makecon-pulse {
  0%   { box-shadow: 0 0 0 0   rgba(255,107,61,0.6); }
  70%  { box-shadow: 0 0 0 12px rgba(255,107,61,0); }
  100% { box-shadow: 0 0 0 0   rgba(255,107,61,0); }
}
.ddpage-makecon .final-count { display: inline-flex; gap: 14px; margin: 36px 0 40px; }
.ddpage-makecon .final-count .cell {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px; padding: 18px 22px; min-width: 96px;
  display: flex; flex-direction: column; align-items: center;
}
.ddpage-makecon .final-count .num {
  font-family: 'SF Pro Display','Inter', sans-serif;
  font-weight: 700; font-size: 44px; line-height: 1; letter-spacing: -1px;
  color: #fff; font-variant-numeric: tabular-nums;
}
.ddpage-makecon .final-count .lab { font-size: 12px; color: rgba(255,255,255,0.55); margin-top: 6px; letter-spacing: 0.4px; text-transform: uppercase; }

.ddpage-makecon .trust-strip {
  display: inline-flex; align-items: center; gap: 22px;
  background: rgba(255,255,255,0.6); backdrop-filter: blur(20px);
  border: 1px solid rgba(0,0,0,0.04);
  padding: 12px 22px; border-radius: 999px; margin-top: 24px;
  font-size: 14px; color: var(--slate);
}
.ddpage-makecon .trust-strip .sep { width: 1px; height: 14px; background: var(--mist); }
.ddpage-makecon .stars { color: #1d1d1f; letter-spacing: 1px; }

.ddpage-makecon .gallery-tile {
  aspect-ratio: 4 / 3; border-radius: 22px; overflow: hidden; position: relative;
  background: linear-gradient(135deg, #2a2a2c 0%, #4a4a4c 100%);
}
.ddpage-makecon .gallery-tile.t-1 { background: linear-gradient(135deg, #dddc8c 0%, #b8b840 100%); }
.ddpage-makecon .gallery-tile.t-2 { background: linear-gradient(135deg, #596680 0%, #2a3550 100%); }
.ddpage-makecon .gallery-tile.t-3 { background: linear-gradient(135deg, #e8d0d0 0%, #d49a9a 100%); }
.ddpage-makecon .gallery-tile.t-4 { background: linear-gradient(135deg, #1d1d1f 0%, #4a4a4c 100%); }
.ddpage-makecon .gallery-tile.t-5 { background: linear-gradient(135deg, #f5f5f7 0%, #c4c4cc 100%); }
.ddpage-makecon .gallery-tile.t-6 { background: linear-gradient(135deg, #2a3550 0%, #596680 50%, #dddc8c 100%); }
.ddpage-makecon .gallery-tile__cap {
  position: absolute; left: 18px; bottom: 16px; color: #fff;
  font-size: 13px; text-shadow: 0 1px 4px rgba(0,0,0,0.3);
}
.ddpage-makecon .gallery-tile.t-1 .gallery-tile__cap,
.ddpage-makecon .gallery-tile.t-3 .gallery-tile__cap,
.ddpage-makecon .gallery-tile.t-5 .gallery-tile__cap { color: rgba(29,29,31,0.85); text-shadow: none; }

.ddpage-makecon .map-tile {
  aspect-ratio: 4 / 3; border-radius: 28px; overflow: hidden;
  background: linear-gradient(180deg, #eef1f5 0%, #e2e6ec 100%);
  position: relative;
}
.ddpage-makecon .map-pin {
  position: absolute; left: 58%; top: 46%; transform: translate(-50%,-100%);
  width: 36px; height: 36px; border-radius: 999px;
  background: var(--azure);
  box-shadow: 0 0 0 8px rgba(0,113,227,0.18);
  display: flex; align-items: center; justify-content: center; color: #fff;
}
.ddpage-makecon .map-pin::after {
  content: ""; position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%);
  width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 9px solid var(--azure);
}
.ddpage-makecon .map-lines {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(180deg, transparent 30%, rgba(180,190,210,0.5) 30%, rgba(180,190,210,0.5) 31%, transparent 31%),
    linear-gradient(90deg,  transparent 65%, rgba(180,190,210,0.5) 65%, rgba(180,190,210,0.5) 66%, transparent 66%),
    linear-gradient(70deg,  transparent 48%, rgba(160,170,190,0.4) 48%, rgba(160,170,190,0.4) 49.4%, transparent 49.4%);
}

.ddpage-makecon .num-mark {
  width: 56px; height: 56px; border-radius: 18px; background: var(--fog);
  display: inline-flex; align-items: center; justify-content: center;
  font-family: 'SF Pro Display','Inter', sans-serif;
  font-weight: 600; font-size: 24px; color: var(--ink); letter-spacing: -0.4px;
}

@media (max-width: 768px) {
  .ddpage-makecon .info-row { grid-template-columns: 1fr 1fr; }
  .ddpage-makecon .info-cell:nth-child(2) { box-shadow: inset 1px 0 0 var(--mist); }
  .ddpage-makecon .info-cell:nth-child(3) { box-shadow: inset 0 1px 0 var(--mist); }
  .ddpage-makecon .info-cell:nth-child(4) { box-shadow: inset 1px 1px 0 var(--mist); }
  .ddpage-makecon .tt-row { grid-template-columns: 1fr; gap: 8px; padding: 22px 0; }
  .ddpage-makecon .tt-time { font-size: 18px; color: var(--graphite); }
  .ddpage-makecon .tt-title { font-size: 18px; }
  .ddpage-makecon .tt-speaker { text-align: left; }
  .ddpage-makecon .card, .ddpage-makecon .card-fog { padding: 28px; }
  .ddpage-makecon .count-cell { min-width: 0; padding: 12px 14px; }
  .ddpage-makecon .count-num { font-size: 36px; }
  .ddpage-makecon .final-stage { padding: 64px 24px; }
  .ddpage-makecon .final-count .cell { padding: 14px 16px; min-width: 0; }
  .ddpage-makecon .final-count .num { font-size: 32px; }
}
`

/* =========================================================================
   Data
   ========================================================================= */
const TARGET = new Date('2026-05-23T10:00:00+09:00').getTime()

const SPEAKERS = [
  { name: '김다현', initials: 'KD', role: '브랜드 디렉터',     co: '스튜디오 어웨이크', session: '작게, 그러나 잊히지 않게 — 1인 브랜드의 윤곽선' },
  { name: '이상우', initials: 'SW', role: '퍼포먼스 마케터',   co: '레이드그로스',       session: '광고비 100만 원 안에서 결판내기' },
  { name: '박서윤', initials: 'SY', role: '온라인 클래스 운영', co: '데일리 메이크',     session: '리스트 1,000명, 매출 1억 만들기' },
  { name: '정한별', initials: 'HB', role: '브랜드 컨설턴트',   co: '한별스튜디오',       session: '리브랜딩 전, 진짜 물어야 할 7가지' },
  { name: '최도윤', initials: 'DY', role: '프로덕트 마케터',   co: '루프',               session: '리텐션이 모든 것을 정리한다' },
  { name: '강예린', initials: 'YR', role: '콘텐츠 크리에이터', co: '예린의 책상',         session: '하루 30분, 매주 한 편의 글로 사는 법' },
]

const TIMETABLE: { time: string; title: string; speaker: string; kind?: 'break' }[] = [
  { time: '09:30 – 10:00', title: '등록 및 입장',                              speaker: '운영팀',     kind: 'break' },
  { time: '10:00 – 10:40', title: '오프닝 키노트 — 작게, 그러나 잊히지 않게',  speaker: '김다현' },
  { time: '10:50 – 11:30', title: '광고비 100만 원 안에서 결판내기',           speaker: '이상우' },
  { time: '11:40 – 12:20', title: '리스트 1,000명, 매출 1억 만들기',            speaker: '박서윤' },
  { time: '12:20 – 13:30', title: '점심 + 네트워킹 라운지',                    speaker: '도시락 제공', kind: 'break' },
  { time: '13:30 – 14:10', title: '리브랜딩 전, 진짜 물어야 할 7가지',          speaker: '정한별' },
  { time: '14:20 – 15:00', title: '리텐션이 모든 것을 정리한다',                speaker: '최도윤' },
  { time: '15:10 – 15:50', title: '하루 30분, 매주 한 편의 글로 사는 법',       speaker: '강예린' },
  { time: '16:00 – 17:30', title: '패널 토크 · 1인 사업자 Q&A',                 speaker: '전체 연사' },
  { time: '17:30 – 18:00', title: '클로징 + 단체 사진',                        speaker: '',           kind: 'break' },
]

const FAQS = [
  { q: '주차가 가능한가요?',         a: '코엑스 지하 주차장 이용 시 3시간 무료 주차를 지원합니다. 행사장 입구에서 주차권을 발급해 드립니다.' },
  { q: '당일 입장 가능한가요?',      a: '잔여 좌석이 있는 경우 당일 입장이 가능하지만, 정원이 200명으로 제한되어 있어 사전 신청을 권장드립니다. 마감 시 현장 등록은 받지 않습니다.' },
  { q: '환불 정책은 어떻게 되나요?', a: '행사 7일 전까지는 100% 환불, 6일 전부터 3일 전까지는 50% 환불이 가능합니다. 2일 전부터 당일은 환불이 어렵습니다.' },
  { q: '식사는 제공되나요?',         a: '점심 도시락이 모든 티켓에 포함되어 있습니다. 음료(커피, 차, 생수)는 종일 무제한으로 제공됩니다. 식이 제한이 있는 경우 신청 시 별도 문의 부탁드립니다.' },
  { q: '녹화본이 제공되나요?',       a: '얼리버드 티켓에는 행사 후 30일간 다시 보기가 포함됩니다. 정가/그룹 티켓은 별도 신청 시 추가 구매가 가능합니다.' },
  { q: '드레스코드가 있나요?',       a: '비즈니스 캐주얼을 권장드리지만 자유 복장으로 오셔도 됩니다. 단체 사진이 있으니 편한 옷차림을 추천합니다.' },
]

/* =========================================================================
   Hooks
   ========================================================================= */
function useCountdown(target: number) {
  const [now, setNow] = useState<number>(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  return useMemo(() => {
    let d = Math.max(0, target - now)
    const days  = Math.floor(d / 86400000); d -= days  * 86400000
    const hours = Math.floor(d / 3600000);  d -= hours * 3600000
    const mins  = Math.floor(d / 60000);    d -= mins  * 60000
    const secs  = Math.floor(d / 1000)
    const pad = (n: number) => String(n).padStart(2, '0')
    return { days: pad(days), hours: pad(hours), mins: pad(mins), secs: pad(secs) }
  }, [now, target])
}

/* =========================================================================
   Page
   ========================================================================= */
export default function Page() {
  const cd = useCountdown(TARGET)
  const [ticket, setTicket] = useState<'early' | 'regular' | 'group'>('early')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = {
      name:  (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      biz:   (form.elements.namedItem('biz') as HTMLSelectElement).value,
      ticket,
    }
    console.log('apply submit', data)
    setSubmitted(true)
  }

  return (
    <main className="ddpage-makecon">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* ============ Global nav ============ */}
      <header className="global-nav">
        <div className="global-nav__inner">
          <a href="#overview" aria-label="마컨2026">
            <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
              <path d="M9 1.5L1.5 5.5v6L9 15.5l7.5-4v-6L9 1.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M9 8.5v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </a>
          <nav className="hidden md:flex gap-7">
            <a href="#why">소개</a>
            <a href="#speakers">연사</a>
            <a href="#schedule">일정</a>
            <a href="#venue">장소</a>
            <a href="#tickets">티켓</a>
            <a href="#faq">FAQ</a>
          </nav>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="검색"><Search size={15} /></a>
            <a href="#apply">신청</a>
          </div>
        </div>
      </header>

      {/* ============ Sub nav ============ */}
      <div className="sub-nav">
        <div className="sub-nav__inner">
          <div className="text-[21px] font-semibold tracking-[-0.32px] text-[#1d1d1f]">마컨2026</div>
          <nav className="hidden md:flex gap-7">
            <a href="#why">소개</a>
            <a href="#speakers">연사</a>
            <a href="#schedule">일정</a>
            <a href="#venue">장소</a>
            <a href="#tickets">티켓</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="#apply" className="btn-azure" style={{ padding: '6px 16px', fontSize: 14 }}>지금 신청</a>
        </div>
      </div>

      {/* ============ 1. Hero ============ */}
      <section id="overview" className="px-[22px] pt-20 pb-20 lg:pb-[120px]" style={{ background: '#f5f5f7' }}>
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="caption" style={{ color: '#0066cc', fontWeight: 500, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
            제 3회 · 서울
          </div>
          <h1 className="display mt-[18px]">
            마컨<span className="light-display">2026</span><span style={{ color: '#707070', fontWeight: 300 }}>.</span>
          </h1>
          <p className="subheading mt-[22px] mx-auto max-w-[720px]" style={{ color: '#474747' }}>
            혼자서도 충분히 큰 매출을 만드는 사람들의 모임.<br />
            1인 사업자 마케팅 컨퍼런스 2026.
          </p>

          <div className="mt-12 flex justify-center gap-3" aria-live="polite">
            {[
              { v: cd.days,  l: 'Days' },
              { v: cd.hours, l: 'Hours' },
              { v: cd.mins,  l: 'Mins' },
              { v: cd.secs,  l: 'Secs' },
            ].map(c => (
              <div key={c.l} className="count-cell">
                <div className="count-num">{c.v}</div>
                <div className="count-label">{c.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
            <a href="#apply" className="btn-azure">지금 신청 · 얼리버드 30%</a>
            <a href="#schedule" className="link-chev">프로그램 보기</a>
          </div>

          <div className="trust-strip">
            <span className="stars">★★★★★</span>
            <span>지난 회차 만족도 <strong style={{ color: '#1d1d1f', fontWeight: 600 }}>4.8</strong>/5</span>
            <span className="sep" />
            <span>누적 참가자 <strong style={{ color: '#1d1d1f', fontWeight: 600 }}>1,200+</strong></span>
          </div>

          <div className="info-row mt-14 text-left">
            <InfoCell label="일시"  value="2026. 05. 23 토" sub="10:00 – 18:00" />
            <InfoCell label="장소"  value="코엑스 컨퍼런스룸" sub="서울 강남구 · 401호" />
            <InfoCell label="가격"  value="49,000원" sub="얼리버드 · 정가 79,000원" />
            <InfoCell label="정원"  value="142 / 200" sub="58자리 남음" subColor="#b64400" />
          </div>
        </div>
      </section>

      {/* ============ 2. Why attend ============ */}
      <section id="why" className="px-[22px] py-20 lg:py-[120px]" style={{ background: '#ffffff' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="max-w-3xl">
            <div className="caption" style={{ color: '#707070', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>왜 참석해야 하나요</div>
            <h2 className="heading-lg mt-3">혼자 하는 일에도,<br />함께 배울 때가 있습니다.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-16">
            <WhyCard n="01" h="실전 사례로 배웁니다."   p="이론이 아닌, 월매출 1,000만 원에서 1억 원으로 성장한 1인 사업자의 실제 데이터와 의사결정 과정을 그대로 공유합니다." />
            <WhyCard n="02" h="동료를 만납니다."         p="같은 고민을 하는 1인 사업자 200명과 하루 종일 같은 공간에서. 일이 풀리지 않을 때 연락할 사람이 생깁니다." />
            <WhyCard n="03" h="바로 적용 가능합니다."     p="강의 후 1주 안에 실행할 수 있는 액션 리스트만 다룹니다. 듣고 끝이 아닌, 다음 주 월요일부터 달라집니다." />
          </div>
        </div>
      </section>

      {/* ============ 3. Speakers ============ */}
      <section id="speakers" className="px-[22px] py-20 lg:py-[120px]" style={{ background: '#f5f5f7' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <div className="caption" style={{ color: '#707070', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Speakers</div>
            <h2 className="heading-lg mt-3">이 분들이 이야기합니다.</h2>
            <p className="subheading mt-[18px]" style={{ color: '#474747' }}>혼자서 시작해 자신만의 방식을 만든 6명의 1인 사업자.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-16">
            {SPEAKERS.map(s => (
              <article key={s.name} className="card" style={{ padding: 20 }}>
                <div className="portrait">
                  <div className="portrait__initials">{s.initials}</div>
                </div>
                <div className="mt-5">
                  <h3 className="font-semibold text-[20px] tracking-[-0.3px]" style={{ fontFamily: "'SF Pro Display','Inter',sans-serif" }}>{s.name}</h3>
                  <p className="body-sm mt-0.5" style={{ color: '#707070' }}>{s.role} · {s.co}</p>
                  <p className="mt-3.5 text-[15px] leading-[1.45]" style={{ color: '#474747' }}>{s.session}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. Schedule ============ */}
      <section id="schedule" className="px-[22px] py-20 lg:py-[120px]" style={{ background: '#ffffff' }}>
        <div className="max-w-[980px] mx-auto">
          <div className="caption" style={{ color: '#707070', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Schedule</div>
          <h2 className="heading-lg mt-3">당일 일정.</h2>
          <p className="subheading mt-[18px] max-w-[580px]" style={{ color: '#474747' }}>2026년 5월 23일 토요일. 코엑스 컨퍼런스룸 401호.</p>

          <div className="mt-14">
            {TIMETABLE.map(t => (
              <div key={t.time} className={`tt-row ${t.kind === 'break' ? 'tt-row--break' : ''}`}>
                <div className="tt-time">{t.time}</div>
                <div className="tt-title">{t.title}</div>
                <div className="tt-speaker">{t.speaker}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 5. Venue ============ */}
      <section id="venue" className="px-[22px] py-20 lg:py-[120px]" style={{ background: '#f5f5f7' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="caption" style={{ color: '#707070', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Venue</div>
          <h2 className="heading-lg mt-3">코엑스, 401호.</h2>

          <div className="grid md:grid-cols-2 gap-8 mt-14 items-stretch">
            <div className="map-tile">
              <div className="map-lines" />
              <div className="map-pin"><MapPin size={14} /></div>
              <div className="absolute left-5 top-5 px-3.5 py-2 text-[13px] rounded-xl" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(10px)' }}>
                코엑스 · 컨퍼런스룸 401
              </div>
            </div>

            <div className="card">
              <h3 className="heading-sm">서울 강남구 영동대로 513</h3>
              <p className="mt-1.5" style={{ color: '#474747' }}>코엑스 컨퍼런스 4층 401호</p>
              <div className="mt-8 space-y-5">
                <VenueRow icon={<Train size={20} />}   title="지하철 2호선 삼성역" sub="5번 출구 도보 5분" />
                <VenueRow icon={<MapPin size={20} />}  title="주차 가능 (3시간 무료)" sub="코엑스 지하 주차장 이용" />
                <VenueRow icon={<Building2 size={20}/>}title="입장 안내"             sub="4층 401호. 09:30부터 등록 시작." />
              </div>
              <div className="mt-7 pt-6 border-t" style={{ borderColor: '#e8e8ed' }}>
                <a href="#" className="link-chev">길찾기 열기</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 6. Past gallery + testimonials ============ */}
      <section id="gallery" className="px-[22px] py-20 lg:py-[120px]" style={{ background: '#ffffff' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="caption" style={{ color: '#707070', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>지난 회차</div>
              <h2 className="heading-lg mt-3">2025년의 어느 토요일.</h2>
            </div>
            <p className="max-w-[380px]" style={{ color: '#474747' }}>지난 회차 현장과, 다녀가신 분들이 남긴 한 줄.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-14">
            {[
              { t: 1, c: '오프닝 키노트 — 김다현' },
              { t: 4, c: '패널 토크 · 점심 후 라운드' },
              { t: 2, c: '네트워킹 세션' },
              { t: 5, c: '현장 부스 — 인쇄물 워크숍' },
              { t: 6, c: '클로징 · 단체 사진' },
              { t: 3, c: '참가자 인터뷰' },
            ].map((g, i) => (
              <div key={i} className={`gallery-tile t-${g.t}`}>
                <div className="gallery-tile__cap">{g.c}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-5 mt-12">
            <Testimonial quote="마케팅 강의는 많이 들었지만, 이렇게 ‘내 매출에 맞춰 다시 짜라’고 말해 준 곳은 처음이었다." name="박서윤" role="온라인 클래스 운영 · 4년차" />
            <Testimonial quote="돌아오는 길에 머리가 너무 가벼웠다. 안 쳐도 되는 광고를 정리하고, 진짜 해야 할 일이 보였다."     name="이도윤" role="스마트스토어 운영 · 2년차" />
            <Testimonial quote="여기서 만난 사람들과 지금까지 함께 일하고 있다. 1인 사업자에게 이런 자리는 흔치 않다."         name="정한별" role="브랜드 컨설팅 · 6년차" />
          </div>
        </div>
      </section>

      {/* ============ 7. Tickets ============ */}
      <section id="tickets" className="px-[22px] py-20 lg:py-[120px]" style={{ background: '#f5f5f7' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto">
            <div className="caption" style={{ color: '#707070', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Tickets</div>
            <h2 className="heading-lg mt-3">티켓 선택.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 mt-16 items-stretch">
            {/* Early featured */}
            <article className="price-card price-card--featured">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold uppercase tracking-[0.4px]" style={{ color: '#ff6b3d' }}>Early Bird · 30% OFF</span>
                <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.5)' }}>58자리 남음</span>
              </div>
              <h3 className="heading-sm" style={{ marginTop: 8 }}>얼리버드</h3>
              <div className="flex items-baseline gap-2.5">
                <span style={{ fontFamily: "'SF Pro Display','Inter',sans-serif", fontWeight: 700, fontSize: 44, letterSpacing: '-1px' }}>49,000원</span>
                <span style={{ textDecoration: 'line-through', color: 'rgba(255,255,255,0.4)' }}>79,000원</span>
              </div>
              <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.6)' }}>4월 30일까지 한정</p>
              <ul className="space-y-3 mt-2 flex-1">
                {['본 행사 8시간 전체 입장', '점심 도시락 + 음료 무제한', '발표 자료 + 워크북 PDF', '네트워킹 라운지 입장', '녹화본 30일 다시 보기'].map(item => (
                  <li key={item} className="flex gap-3 items-start"><span className="check"><Check size={12} strokeWidth={3} /></span><span>{item}</span></li>
                ))}
              </ul>
              <a href="#apply" className="btn-azure" style={{ marginTop: 8 }}>얼리버드로 신청</a>
            </article>

            {/* Regular */}
            <article className="price-card">
              <div><span className="text-[12px] font-semibold uppercase tracking-[0.4px]" style={{ color: '#707070' }}>Regular</span></div>
              <h3 className="heading-sm">정가</h3>
              <div className="flex items-baseline gap-2.5">
                <span style={{ fontFamily: "'SF Pro Display','Inter',sans-serif", fontWeight: 700, fontSize: 44, letterSpacing: '-1px' }}>79,000원</span>
              </div>
              <p className="text-[14px]" style={{ color: '#707070' }}>5월 1일부터 행사 당일까지</p>
              <ul className="space-y-3 mt-2 flex-1">
                <TicketLine on>본 행사 8시간 전체 입장</TicketLine>
                <TicketLine on>점심 도시락 + 음료 무제한</TicketLine>
                <TicketLine on>발표 자료 + 워크북 PDF</TicketLine>
                <TicketLine on>네트워킹 라운지 입장</TicketLine>
                <TicketLine on={false}>녹화본 다시 보기</TicketLine>
              </ul>
              <a href="#apply" className="btn-dark" style={{ marginTop: 8 }}>정가로 신청</a>
            </article>

            {/* Group */}
            <article className="price-card">
              <div><span className="text-[12px] font-semibold uppercase tracking-[0.4px]" style={{ color: '#707070' }}>Group · 3인 이상</span></div>
              <h3 className="heading-sm">그룹 할인</h3>
              <div className="flex items-baseline gap-2.5">
                <span style={{ fontFamily: "'SF Pro Display','Inter',sans-serif", fontWeight: 700, fontSize: 44, letterSpacing: '-1px' }}>39,000원</span>
                <span style={{ fontSize: 14, color: '#707070' }}>/ 인</span>
              </div>
              <p className="text-[14px]" style={{ color: '#707070' }}>3인부터 자동 적용</p>
              <ul className="space-y-3 mt-2 flex-1">
                {['본 행사 8시간 전체 입장', '점심 도시락 + 음료 무제한', '그룹 좌석 동선 배정', '발표 자료 + 워크북 PDF', '전용 사전 미팅 1회'].map(item => (
                  <li key={item} className="flex gap-3 items-start"><span className="check"><Check size={12} strokeWidth={3} /></span><span>{item}</span></li>
                ))}
              </ul>
              <a href="#apply" className="btn-dark" style={{ marginTop: 8 }}>그룹으로 신청</a>
            </article>
          </div>
          <p className="caption text-center mt-7">환불은 행사 7일 전까지 100% 가능합니다. 7일 이내 50%, 3일 이내 환불 불가.</p>
        </div>
      </section>

      {/* ============ 8. Apply form ============ */}
      <section id="apply" className="px-[22px] py-20 lg:py-[120px]" style={{ background: '#ffffff' }}>
        <div className="max-w-[980px] mx-auto">
          <div className="caption" style={{ color: '#707070', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>Apply</div>
          <h2 className="heading-lg mt-3">지금 신청.</h2>
          <p className="subheading mt-[18px] max-w-[580px]" style={{ color: '#474747' }}>결제는 다음 단계에서 진행됩니다. 신청 정보는 환불 정책에 따라 보호됩니다.</p>

          <form className="mt-14" onSubmit={onSubmit} noValidate>
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="field-label" htmlFor="name">이름</label><input className="field-input" id="name" name="name" type="text" placeholder="홍길동" required /></div>
              <div><label className="field-label" htmlFor="phone">연락처</label><input className="field-input" id="phone" name="phone" type="tel" placeholder="010-0000-0000" required /></div>
              <div className="md:col-span-2"><label className="field-label" htmlFor="email">이메일</label><input className="field-input" id="email" name="email" type="email" placeholder="you@example.com" required /></div>
              <div className="md:col-span-2">
                <label className="field-label" htmlFor="biz">사업 형태 (선택)</label>
                <select className="field-select" id="biz" name="biz" defaultValue="">
                  <option value="">선택해 주세요</option>
                  <option>개인사업자 · 온라인 판매</option>
                  <option>개인사업자 · 서비스/컨설팅</option>
                  <option>프리랜서 · 크리에이터</option>
                  <option>예비 창업자</option>
                  <option>기타</option>
                </select>
              </div>
            </div>

            <div className="mt-10">
              <div className="field-label">티켓 종류</div>
              <div className="grid md:grid-cols-3 gap-3">
                <TicketRadio active={ticket === 'early'}   onClick={() => setTicket('early')}   title="얼리버드"  sub="49,000원" />
                <TicketRadio active={ticket === 'regular'} onClick={() => setTicket('regular')} title="정가"      sub="79,000원" />
                <TicketRadio active={ticket === 'group'}   onClick={() => setTicket('group')}   title="그룹 · 3인+" sub="39,000원 / 인" />
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <Agree required strong="[필수]">이용약관 및 개인정보 처리방침에 동의합니다.</Agree>
              <Agree required strong="[필수]">환불 정책(행사 7일 전까지 100% 환불)에 동의합니다.</Agree>
              <Agree>마컨 뉴스레터(월 1회) 수신에 동의합니다.</Agree>
            </div>

            <div className="mt-12 flex flex-col items-start gap-4">
              <button type="submit" className="btn-azure" style={{ padding: '16px 28px' }}>신청 + 결제 진행 ›</button>
              <p className="caption">환불은 행사 7일 전까지 100% 가능 · 결제 후 영수증 자동 발송</p>
            </div>

            {submitted && (
              <div className="mt-7 p-6 rounded-[18px] border" style={{ background: '#f5f5f7', borderColor: '#e8e8ed' }}>
                <div className="flex gap-3.5 items-start">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: '#0071e3' }}>
                    <Check size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <div className="font-semibold">신청이 접수되었습니다.</div>
                    <p className="body-sm mt-1" style={{ color: '#474747' }}>결제 페이지로 이동합니다. 이메일로 영수증이 발송됩니다.</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>

      {/* ============ 9. FAQ ============ */}
      <section id="faq" className="px-[22px] py-20 lg:py-[120px]" style={{ background: '#f5f5f7' }}>
        <div className="max-w-[980px] mx-auto">
          <div className="caption" style={{ color: '#707070', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase' }}>FAQ</div>
          <h2 className="heading-lg mt-3">자주 묻는 질문.</h2>
          <div className="mt-14">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <div key={f.q} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button className="faq-trigger" type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : i)}>
                    <span>{f.q}</span>
                    <Plus className="chev" size={18} strokeWidth={1.6} />
                  </button>
                  <div className="faq-body"><p className="pb-7 text-[17px]" style={{ color: '#474747' }}>{f.a}</p></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ 10. Final CTA ============ */}
      <section className="px-[22px] pt-10 pb-[120px]" style={{ background: '#ffffff' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="final-stage">
            <div className="final-pill">
              <span className="pulse-dot" />
              마감 임박 · <strong style={{ color: '#fff', fontWeight: 600 }}>58자리</strong> 남음
            </div>
            <h2 className="heading-lg mt-6">놓치면, 한 번 더 기다려야 합니다.</h2>
            <p className="subheading mt-[18px] mx-auto max-w-[580px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              다음 회차는 2027년 봄.<br />지금이 가장 빠르고, 가장 저렴합니다.
            </p>

            <div className="final-count" aria-live="polite">
              {[{ v: cd.days, l: 'Days' }, { v: cd.hours, l: 'Hours' }, { v: cd.mins, l: 'Mins' }, { v: cd.secs, l: 'Secs' }].map(c => (
                <div key={c.l} className="cell"><div className="num">{c.v}</div><div className="lab">{c.l}</div></div>
              ))}
            </div>

            <div>
              <a href="#apply" className="btn-azure" style={{ padding: '16px 32px' }}>지금 신청 · 얼리버드 49,000원</a>
            </div>
            <p className="caption mt-[18px]" style={{ color: 'rgba(255,255,255,0.5)' }}>결제 없이 신청만 먼저 진행해도 됩니다.</p>
          </div>
        </div>
      </section>

      {/* ============ 11. Footer ============ */}
      <footer className="px-[22px] py-[60px] pb-20 border-t" style={{ background: '#f5f5f7', borderColor: '#e8e8ed' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5">
                <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
                  <path d="M9 1.5L1.5 5.5v6L9 15.5l7.5-4v-6L9 1.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M9 8.5v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <span className="font-semibold">마컨2026</span>
              </div>
              <p className="body-sm mt-3.5 max-w-[360px]" style={{ color: '#707070' }}>
                1인 사업자 마케팅 컨퍼런스. 주최 · 마컨 운영팀.
              </p>
            </div>
            <div>
              <div className="text-[13px] font-semibold">문의</div>
              <ul className="mt-4 space-y-2 body-sm" style={{ color: '#707070' }}>
                <li>02-1234-5678</li>
                <li>카카오톡 채널 · @마컨2026</li>
                <li>hello@makecon2026.kr</li>
              </ul>
            </div>
            <div>
              <div className="text-[13px] font-semibold">팔로우</div>
              <ul className="mt-4 space-y-2 body-sm" style={{ color: '#707070' }}>
                <li><a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Instagram</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>YouTube</a></li>
                <li><a href="#" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>Brunch</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t flex flex-col items-center gap-2" style={{ borderColor: '#e8e8ed' }}>
            <Link href="/portfolio" className="text-[14px] hover:underline" style={{ color: '#1d1d1f' }}>
              ← 다른 포트폴리오 보기
            </Link>
            <div className="caption">Copyright © 2026 마컨 운영팀. 사업자등록번호 000-00-00000.</div>
            <div className="text-[12px]" style={{ color: '#a1a1a6' }}>포트폴리오용 샘플 작업입니다.</div>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* =========================================================================
   Subcomponents
   ========================================================================= */
function InfoCell({ label, value, sub, subColor }: { label: string; value: string; sub: string; subColor?: string }) {
  return (
    <div className="info-cell">
      <div className="text-[12px] uppercase tracking-[0.4px] mb-2" style={{ color: '#707070' }}>{label}</div>
      <div className="text-[17px] font-medium tracking-[-0.2px]" style={{ color: '#1d1d1f' }}>{value}</div>
      <div className="text-[13px] mt-0.5" style={{ color: subColor ?? '#707070' }}>{sub}</div>
    </div>
  )
}

function WhyCard({ n, h, p }: { n: string; h: string; p: string }) {
  return (
    <article className="card-fog">
      <div className="num-mark">{n}</div>
      <h3 className="heading-sm mt-6">{h}</h3>
      <p className="mt-3" style={{ color: '#474747' }}>{p}</p>
    </article>
  )
}

function VenueRow({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#f5f5f7' }}>{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="body-sm" style={{ color: '#707070' }}>{sub}</div>
      </div>
    </div>
  )
}

function Testimonial({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <article className="card-fog">
      <div className="stars">★★★★★</div>
      <p className="mt-4" style={{ color: '#1d1d1f' }}>“{quote}”</p>
      <div className="mt-6 flex gap-3 items-center">
        <div className="w-9 h-9 rounded-full" style={{ background: '#e8e8ed' }} />
        <div>
          <div className="font-medium">{name}</div>
          <div className="body-sm" style={{ color: '#707070' }}>{role}</div>
        </div>
      </div>
    </article>
  )
}

function TicketLine({ children, on }: { children: React.ReactNode; on: boolean }) {
  return (
    <li className="flex gap-3 items-start" style={{ opacity: on ? 1 : 0.4 }}>
      <span className="check">{on ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={2.4} />}</span>
      <span>{children}</span>
    </li>
  )
}

function TicketRadio({ active, onClick, title, sub }: { active: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button type="button" className={`radio-tile ${active ? 'is-selected' : ''}`} onClick={onClick}>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="body-sm" style={{ color: '#707070' }}>{sub}</span>
      </span>
      <span className="radio-dot" />
    </button>
  )
}

function Agree({ children, required, strong }: { children: React.ReactNode; required?: boolean; strong?: string }) {
  return (
    <label className="flex gap-3 items-start cursor-pointer">
      <input type="checkbox" required={required} className="mt-1" style={{ accentColor: '#1d1d1f' }} />
      <span className="body-sm" style={{ color: '#474747' }}>
        {strong ? <><strong style={{ color: '#1d1d1f', fontWeight: 500 }}>{strong}</strong> </> : '[선택] '}{children}
      </span>
    </label>
  )
}
