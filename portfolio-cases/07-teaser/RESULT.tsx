'use client'

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import Link from 'next/link'
import {
  X as XIcon,
  AtSign,
  Gift,
  DoorOpen,
  Package,
} from 'lucide-react'

function InstagramGlyph({ strokeWidth = 1.6, className }: { strokeWidth?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function YoutubeGlyph({ strokeWidth = 1.6, className }: { strokeWidth?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
    </svg>
  )
}

/* =========================================================================
   Scoped CSS — only what Tailwind can't express cleanly:
   keyframes, :focus-within, pseudo-elements, complex backgrounds (woodgrain,
   weave, brass sheen, clay speckle), <details> accordion, the manifesto
   pull-quote curly mark, and the peek/object hover transitions.
   All selectors prefixed with .ddpage-teaser to avoid leaking.
   ========================================================================= */
const SCOPED_CSS = `
.ddpage-teaser { word-break: keep-all; }

/* ---- Hero eyebrow dot ---- */
.ddpage-teaser .ddpage-teaser-eyebrow-dot {
  width: 6px; height: 6px; border-radius: 9999px;
  background: #f843c2; box-shadow: 0 0 12px #f843c2;
  animation: ddpage-teaser-pulse 2.2s ease-in-out infinite;
}
@keyframes ddpage-teaser-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%      { opacity: .45; transform: scale(.85); }
}

/* ---- Brand mark (ring + inner dot) ---- */
.ddpage-teaser .ddpage-teaser-brand-mark {
  width: 26px; height: 26px;
  border: 1.5px solid #ffffff;
  border-radius: 9999px;
  display: grid; place-items: center;
}
.ddpage-teaser .ddpage-teaser-brand-mark::after {
  content: ""; width: 6px; height: 6px; border-radius: 9999px;
  background: #ffffff;
}

/* ---- Signup form (focus-within + done state) ---- */
.ddpage-teaser .ddpage-teaser-form {
  transition: border-color 200ms cubic-bezier(.2,.7,.2,1),
              background-color 200ms cubic-bezier(.2,.7,.2,1);
}
.ddpage-teaser .ddpage-teaser-form:focus-within {
  border-color: #ffffff !important;
  background-color: rgba(255,255,255,0.10) !important;
}
.ddpage-teaser .ddpage-teaser-form[data-done="true"] {
  border-color: #a2ea13 !important;
  background-color: rgba(162,234,19,0.08) !important;
}
.ddpage-teaser .ddpage-teaser-input::placeholder { color: rgba(255,255,255,.5); }

.ddpage-teaser .ddpage-teaser-success {
  opacity: 0; transform: translateY(4px);
  transition: opacity 360ms cubic-bezier(.2,.7,.2,1),
              transform 360ms cubic-bezier(.2,.7,.2,1);
}
.ddpage-teaser .ddpage-teaser-success[data-on="true"] {
  opacity: 1; transform: translateY(0);
}

/* ---- Manifesto pull-quote curly mark ---- */
.ddpage-teaser .ddpage-teaser-quote { position: relative; }
.ddpage-teaser .ddpage-teaser-quote::before {
  content: "\\201C";
  position: absolute;
  left: -52px; top: -24px;
  font-family: "Noto Serif KR", "Nanum Myeongjo", serif;
  font-size: 96px;
  color: #ffaae6;
  line-height: 1; opacity: .9;
}
@media (max-width: 980px) {
  .ddpage-teaser .ddpage-teaser-quote::before { left: -8px; top: -56px; font-size: 80px; }
}

/* ---- Collection grid: 3 cols on desktop, 2 on tablet, 1 on phone ---- */
.ddpage-teaser .ddpage-teaser-collection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
@media (max-width: 980px) {
  .ddpage-teaser .ddpage-teaser-collection-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 720px) {
  .ddpage-teaser .ddpage-teaser-collection-grid { grid-template-columns: 1fr; }
}

/* Object hover */
.ddpage-teaser .ddpage-teaser-obj {
  transition: transform 200ms cubic-bezier(.2,.7,.2,1);
}
.ddpage-teaser .ddpage-teaser-obj:hover { transform: translateY(-2px); }

/* ---- Materials grid + swatch backgrounds ---- */
.ddpage-teaser .ddpage-teaser-craft-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 980px) { .ddpage-teaser .ddpage-teaser-craft-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 720px) { .ddpage-teaser .ddpage-teaser-craft-grid { grid-template-columns: 1fr; } }

.ddpage-teaser .ddpage-teaser-swatch-oak {
  background:
    repeating-linear-gradient(
      87deg,
      #c69366 0px, #c69366 2px,
      #b27e52 2px, #b27e52 4px,
      #c89870 4px, #c89870 7px,
      #a96e44 7px, #a96e44 8px
    );
  position: relative; overflow: hidden;
}
.ddpage-teaser .ddpage-teaser-swatch-oak::after {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 30% 60% at 30% 50%, rgba(120,70,30,.4), transparent 70%),
    radial-gradient(ellipse 25% 70% at 70% 50%, rgba(160,100,60,.3), transparent 70%);
}
.ddpage-teaser .ddpage-teaser-swatch-linen {
  background:
    repeating-linear-gradient(0deg, rgba(255,255,255,.18) 0 1px, transparent 1px 5px),
    repeating-linear-gradient(90deg, rgba(255,255,255,.12) 0 1px, transparent 1px 5px),
    linear-gradient(135deg, #d6cab1 0%, #b3a583 100%);
}
.ddpage-teaser .ddpage-teaser-swatch-clay {
  background:
    radial-gradient(circle at 25% 30%, rgba(80,30,20,.4) 0 1px, transparent 2px),
    radial-gradient(circle at 60% 20%, rgba(80,30,20,.3) 0 1px, transparent 2px),
    radial-gradient(circle at 80% 70%, rgba(80,30,20,.4) 0 1px, transparent 2px),
    radial-gradient(circle at 35% 75%, rgba(80,30,20,.3) 0 1px, transparent 2px),
    radial-gradient(circle at 50% 50%, rgba(80,30,20,.25) 0 1.5px, transparent 3px),
    radial-gradient(circle at 70% 40%, rgba(80,30,20,.3) 0 1px, transparent 2px),
    radial-gradient(circle at 15% 60%, rgba(80,30,20,.35) 0 1px, transparent 2px),
    linear-gradient(150deg, #6b3a26 0%, #3a1e12 100%);
  background-size: 24px 24px, 32px 32px, 36px 36px, 28px 28px, 40px 40px, 30px 30px, 26px 26px, auto;
}
.ddpage-teaser .ddpage-teaser-swatch-brass {
  background:
    linear-gradient(105deg,
      #c89c4a 0%, #e6c073 18%, #b88334 30%, #d9a857 45%,
      #a87b2e 60%, #e3b961 75%, #b08433 90%, #d6a553 100%);
  position: relative; overflow: hidden;
}
.ddpage-teaser .ddpage-teaser-swatch-brass::after {
  content: "";
  position: absolute; inset: 0;
  background:
    repeating-linear-gradient(105deg,
      transparent 0px, transparent 6px,
      rgba(255,255,255,.06) 6px, rgba(255,255,255,.06) 7px);
}

/* ---- Journey timeline ---- */
.ddpage-teaser .ddpage-teaser-journey-track {
  position: relative;
  padding-left: 24px;
  border-left: 1px solid #e0e0db;
  margin-left: 8px;
}
.ddpage-teaser .ddpage-teaser-journey-step {
  position: relative;
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 32px;
  padding: 24px 0 36px;
}
.ddpage-teaser .ddpage-teaser-journey-step::before {
  content: "";
  position: absolute;
  left: -29px; top: 36px;
  width: 11px; height: 11px;
  border-radius: 50%;
  background: #ffffff;
  border: 1.5px solid #e0e0db;
}
.ddpage-teaser .ddpage-teaser-journey-step[data-current="true"]::before {
  background: #592eff; border-color: #592eff;
  box-shadow: 0 0 0 4px rgba(89,46,255,.18);
}
@media (max-width: 720px) {
  .ddpage-teaser .ddpage-teaser-journey-step { grid-template-columns: 1fr; gap: 6px; }
}

/* ---- Founder note photo placeholder (gradient + soft overlays) ---- */
.ddpage-teaser .ddpage-teaser-note-photo {
  background: linear-gradient(160deg, #4a3a8e 0%, #21164c 100%);
  position: relative;
}
.ddpage-teaser .ddpage-teaser-note-photo::after {
  content: "";
  position: absolute; inset: 0;
  background:
    radial-gradient(circle at 40% 30%, rgba(255,170,230,.22) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(188,242,255,.15) 0%, transparent 50%);
}

/* ---- FAQ accordion (details/summary with custom +/× icon) ---- */
.ddpage-teaser .ddpage-teaser-faq-item summary {
  list-style: none;
  cursor: pointer;
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px;
  font-family: Montserrat, system-ui, sans-serif;
  font-weight: 600;
  font-size: 17px;
  letter-spacing: -.02em;
  color: #21164c;
  padding: 4px 0;
  transition: color 120ms cubic-bezier(.2,.7,.2,1);
}
.ddpage-teaser .ddpage-teaser-faq-item summary::-webkit-details-marker { display: none; }
.ddpage-teaser .ddpage-teaser-faq-item summary:hover { color: #592eff; }
.ddpage-teaser .ddpage-teaser-faq-icon {
  width: 22px; height: 22px; flex: none;
  position: relative; display: grid; place-items: center;
}
.ddpage-teaser .ddpage-teaser-faq-icon::before,
.ddpage-teaser .ddpage-teaser-faq-icon::after {
  content: "";
  position: absolute;
  background: #21164c;
  border-radius: 1px;
  transition: transform 200ms cubic-bezier(.2,.7,.2,1);
}
.ddpage-teaser .ddpage-teaser-faq-icon::before { width: 14px; height: 1.6px; }
.ddpage-teaser .ddpage-teaser-faq-icon::after  { width: 1.6px; height: 14px; }
.ddpage-teaser .ddpage-teaser-faq-item[open] summary { color: #592eff; }
.ddpage-teaser .ddpage-teaser-faq-item[open] summary .ddpage-teaser-faq-icon::before { background: #592eff; }
.ddpage-teaser .ddpage-teaser-faq-item[open] summary .ddpage-teaser-faq-icon::after  { transform: scaleY(0); }

/* ---- Manifesto / Founder note 2-col fallback ---- */
@media (max-width: 980px) {
  .ddpage-teaser .ddpage-teaser-manifesto-grid,
  .ddpage-teaser .ddpage-teaser-note-grid,
  .ddpage-teaser .ddpage-teaser-faq-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
  .ddpage-teaser .ddpage-teaser-note-photo-wrap { aspect-ratio: 16 / 9 !important; max-width: 320px !important; }
}
`

/* =========================================================================
   Helpers
   ========================================================================= */
const LAUNCH_KEY = 'noun-launch-target'
const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0')

type Remaining = { d: string; h: string; m: string; s: string }

function readOrSeedTarget(): number {
  if (typeof window === 'undefined') return Date.now() + 30 * 86_400_000
  const raw = window.localStorage.getItem(LAUNCH_KEY)
  const existing = raw ? parseInt(raw, 10) : NaN
  if (!isNaN(existing)) return existing
  const seeded = Date.now() + 30 * 86_400_000
  window.localStorage.setItem(LAUNCH_KEY, String(seeded))
  return seeded
}

function diffToParts(targetMs: number): Remaining {
  const diff = Math.max(0, targetMs - Date.now())
  return {
    d: pad(Math.floor(diff / 86_400_000)),
    h: pad(Math.floor((diff % 86_400_000) / 3_600_000)),
    m: pad(Math.floor((diff % 3_600_000) / 60_000)),
    s: pad(Math.floor((diff % 60_000) / 1000)),
  }
}

/* =========================================================================
   Data
   ========================================================================= */
const OBJECTS: Array<{
  no: string
  chip: string
  name: string
  kr: string
  bg: string
  stroke: string
  art: ReactNode
}> = [
  {
    no: 'No. 01',
    chip: 'Living',
    name: 'Lumen',
    kr: '빛머묾 · 빛이 오래 머무는 자리',
    bg: 'linear-gradient(160deg, #2c2358 0%, #161033 100%)',
    stroke: '#ffaae6',
    art: (
      <svg viewBox="0 0 100 140" fill="none" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M50 18 C 50 22, 47 26, 47 31 C 47 35, 53 35, 53 31 C 53 26, 50 22, 50 18 Z" />
        <path d="M50 31 L50 40" />
        <rect x="38" y="40" width="24" height="58" rx="2" />
        <path d="M32 98 L68 98 L72 110 L28 110 Z" />
        <path d="M30 110 L70 110 L72 116 L28 116 Z" />
      </svg>
    ),
  },
  {
    no: 'No. 02',
    chip: 'Kitchen',
    name: 'Hereo',
    kr: '담는것 · 가만한 깊이의 그릇',
    bg: 'linear-gradient(160deg, #2a4751 0%, #15252b 100%)',
    stroke: '#bcf2ff',
    art: (
      <svg viewBox="0 0 120 90" fill="none" strokeWidth="1.2">
        <ellipse cx="60" cy="28" rx="42" ry="6" />
        <path d="M18 28 Q18 62 40 70 L80 70 Q102 62 102 28" />
        <path d="M30 50 Q60 56 90 50" opacity="0.4" />
        <path d="M34 36 Q60 42 86 36" opacity="0.25" />
      </svg>
    ),
  },
  {
    no: 'No. 03',
    chip: 'Mood',
    name: 'Nara',
    kr: '향 · 가벼운 연기, 무거운 기억',
    bg: 'linear-gradient(160deg, #4a2c4a 0%, #221224 100%)',
    stroke: '#f843c2',
    art: (
      <svg viewBox="0 0 100 140" fill="none" strokeWidth="1.2" strokeLinecap="round">
        <path d="M54 12 Q47 24 54 36 Q61 48 54 60" />
        <path d="M48 18 Q42 30 48 42" opacity="0.5" />
        <path d="M58 22 Q64 34 58 46" opacity="0.4" />
        <line x1="50" y1="60" x2="50" y2="98" />
        <ellipse cx="50" cy="102" rx="6" ry="3" />
        <path d="M28 108 L72 108 L66 124 L34 124 Z" />
      </svg>
    ),
  },
  {
    no: 'No. 04',
    chip: 'Table',
    name: 'Mol',
    kr: '잔 · 손에 잡히는 온도',
    bg: 'linear-gradient(160deg, #3b4a22 0%, #1c2410 100%)',
    stroke: '#a2ea13',
    art: (
      <svg viewBox="0 0 100 130" fill="none" strokeWidth="1.2">
        <ellipse cx="50" cy="28" rx="22" ry="5" />
        <path d="M28 28 L32 95 Q50 102 68 95 L72 28" />
        <ellipse cx="50" cy="95" rx="18" ry="3" opacity="0.4" />
        <path d="M72 40 Q86 50 84 70 Q82 84 72 86" />
      </svg>
    ),
  },
  {
    no: 'No. 05',
    chip: 'Flora',
    name: 'Ooru',
    kr: '화 · 줄기를 위한 한 칸',
    bg: 'linear-gradient(160deg, #4a3122 0%, #221710 100%)',
    stroke: '#f5b87a',
    art: (
      <svg viewBox="0 0 100 160" fill="none" strokeWidth="1.2">
        <ellipse cx="50" cy="22" rx="10" ry="3" />
        <path d="M40 22 L40 52 Q22 72 22 104 Q22 134 50 138 Q78 134 78 104 Q78 72 60 52 L60 22" />
        <path d="M30 100 Q50 106 70 100" opacity="0.35" />
        <path d="M28 116 Q50 122 72 116" opacity="0.25" />
      </svg>
    ),
  },
  {
    no: 'No. 06',
    chip: 'Cloth',
    name: 'Gyeol',
    kr: '결 · 손이 닿을 때 처음 아는',
    bg: 'linear-gradient(160deg, #2b3a5a 0%, #131c2e 100%)',
    stroke: '#2ed6ff',
    art: (
      <svg viewBox="0 0 120 100" fill="none" strokeWidth="1.2">
        <path d="M18 30 L102 30 L102 82 L18 82 Z" />
        <path d="M18 30 L60 52 L102 30" />
        <path d="M60 52 L60 82" />
        <path d="M30 50 L90 50" opacity="0.3" />
        <path d="M30 65 L90 65" opacity="0.3" />
        <path d="M30 75 L90 75" opacity="0.25" />
      </svg>
    ),
  },
]

const MATERIALS = [
  { no: 'M / 01', name: 'Oak',   kr: '참나무 · 천연 무도장', cls: 'ddpage-teaser-swatch-oak' },
  { no: 'M / 02', name: 'Linen', kr: '린넨 · 자연 표백',    cls: 'ddpage-teaser-swatch-linen' },
  { no: 'M / 03', name: 'Onggi', kr: '옹기 · 무유 소성',    cls: 'ddpage-teaser-swatch-clay' },
  { no: 'M / 04', name: 'Brass', kr: '황동 · 손 광택',      cls: 'ddpage-teaser-swatch-brass' },
]

const JOURNEY = [
  { year: '2022', title: '스튜디오의 시작', body: '두 명의 디자이너가 작은 공방에서 첫 도면을 그립니다. 도면 위에는 형태만 있고, 아직 이름이 없습니다.', current: false, badge: null as string | null },
  { year: '2024', title: '첫 시제품',       body: '여섯 점의 오브제가 일곱 번의 형태를 거쳐 모양을 잡습니다. 청주의 공방, 서울의 작업실.', current: false, badge: null },
  { year: '2025', title: '비공개 베타',     body: '200명의 동료들이 6개월간 자신의 집에서 오브제를 두고, 결과 흠을 함께 기록합니다.', current: false, badge: null },
  { year: '2026', title: '정식 공개',       body: '첫 컬렉션, 첫 이름들이 한 곳에 모입니다. 사전예약 멤버에게 가장 먼저 도착합니다.', current: true,  badge: 'In 30 days' },
]

const FAQ = [
  { q: '사전예약은 어떻게 진행되나요?', a: '상단의 폼에 이메일만 남겨주시면 됩니다. 결제는 정식 출시일에 별도로 안내드리며, 사전예약 자체에는 비용이 없습니다.' },
  { q: '20% 할인은 어떻게 적용되나요?', a: '출시 후 첫 1년간 멤버 코드를 통해 자동 적용됩니다. 코드는 사전예약자에게 이메일로 1:1 발송됩니다.' },
  { q: '한정 굿즈는 어떤 것인가요?',    a: '사전예약 멤버 500분께만 보내드리는 넘버링 키트입니다. 첫 컬렉션과 동일 소재로 제작되며 첫 주문에 동봉됩니다.' },
  { q: '해외 배송도 가능한가요?',       a: '초기에는 국내(한국) 배송만 지원합니다. 해외 배송은 출시 후 점진적으로 열어 갈 계획이며 알림을 별도로 보내드립니다.' },
  { q: '오프라인 매장이 있나요?',       a: '정식 출시 시점에는 온라인 위주로 시작합니다. 서울의 작은 쇼룸을 2026년 후반에 열 예정이며, 사전 초대장은 멤버에게 먼저 보내드립니다.' },
]

/* =========================================================================
   Page
   ========================================================================= */
export default function Page() {
  const [remaining, setRemaining] = useState<Remaining>({ d: '30', h: '00', m: '00', s: '00' })
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [trustCount, setTrustCount] = useState(2847)
  const targetRef = useRef<number>(0)

  useEffect(() => {
    targetRef.current = readOrSeedTarget()
    setRemaining(diffToParts(targetRef.current))
    const id = setInterval(() => setRemaining(diffToParts(targetRef.current)), 1000)
    return () => clearInterval(id)
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = email.trim()
    if (!value || !/.+@.+\..+/.test(value)) return
    console.log('[signup] submit', { email: value })
    setDone(true)
    setTrustCount((c) => c + 1)
  }

  return (
    <main className="ddpage-teaser bg-[#21164c] text-white">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="relative min-h-screen overflow-hidden px-6 pt-8 pb-16 flex flex-col">
        {/* Decorative outlined vectors */}
        <div className="pointer-events-none absolute top-[8%] -left-10 w-[280px] opacity-[0.35]" aria-hidden="true">
          <svg viewBox="0 0 240 240" fill="none">
            <path d="M120 8 L140 96 L228 120 L140 144 L120 232 L100 144 L12 120 L100 96 Z" stroke="#bcf2ff" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6" />
            <circle cx="120" cy="120" r="60" stroke="#ffaae6" strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
        <div className="pointer-events-none absolute bottom-[4%] -right-14 w-[320px] opacity-30" aria-hidden="true">
          <svg viewBox="0 0 320 200" fill="none">
            <path d="M20 120 Q90 40 200 80 T 310 60" stroke="#dfff9d" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M20 150 Q90 80 200 110 T 310 100" stroke="#ffaae6" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.5" />
            <path d="M20 180 Q90 120 200 140 T 310 140" stroke="#bcf2ff" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4" />
          </svg>
        </div>
        <div className="pointer-events-none absolute top-[28%] right-[8%] w-24 opacity-55" aria-hidden="true">
          <svg viewBox="0 0 96 96" fill="none">
            <path d="M48 6 L54 42 L90 48 L54 54 L48 90 L42 54 L6 48 L42 42 Z" stroke="#ffaae6" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Top bar */}
        <header className="flex items-center justify-between pt-3">
          <Link href="#" className="inline-flex items-center gap-2.5 text-white font-bold text-[18px] tracking-[-0.04em] font-[family-name:Montserrat,system-ui,sans-serif]">
            <span className="ddpage-teaser-brand-mark" aria-hidden="true" />
            <span>NOUN</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-[13px] text-white/70">
            <a href="#collection" className="hover:text-white">컬렉션</a>
            <a href="#craft" className="hover:text-white">소재</a>
            <a href="#journey" className="hover:text-white">여정</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
          </nav>
        </header>

        {/* Centered stack */}
        <div className="relative z-10 mx-auto flex max-w-[880px] flex-1 flex-col items-center justify-center gap-7 py-14 text-center">
          <span className="inline-flex h-7 items-center gap-2 rounded-full border border-white/35 px-3.5 text-[13px] font-medium tracking-[-0.02em] text-white">
            <span className="ddpage-teaser-eyebrow-dot" />
            Coming soon · 2026
          </span>

          <h1 className="m-0 max-w-[14ch] font-bold leading-[1.05] tracking-[-0.03em] text-white font-[family-name:Montserrat,system-ui,sans-serif] text-[clamp(40px,6.4vw,84px)] break-keep">
            곧, 이름이
            <br />
            <span className="text-[#ffaae6]">생깁니다.</span>
          </h1>

          <p className="m-0 max-w-[42ch] text-[18px] leading-[1.6] text-white/70 tracking-[-0.02em] break-keep">
            이름 없던 일상의 오브제 — NOUN.
            <br />
            데일리의 새로운 정의가 곧 도착합니다.
          </p>

          {/* Countdown */}
          <div className="mt-2 flex gap-3" aria-label="출시까지 남은 시간">
            {([
              ['d', 'Days'],
              ['h', 'Hours'],
              ['m', 'Minutes'],
              ['s', 'Seconds'],
            ] as const).map(([key, label]) => (
              <div key={key} className="flex min-w-[92px] flex-col items-center rounded-[18px] border border-white/10 bg-white/5 px-2 pt-4 pb-3">
                <span className="text-[44px] font-bold leading-none tracking-[-0.04em] text-white tabular-nums font-[family-name:Montserrat,system-ui,sans-serif]">
                  {remaining[key]}
                </span>
                <span className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/50">{label}</span>
              </div>
            ))}
          </div>

          {/* Signup */}
          <form
            onSubmit={handleSubmit}
            data-done={done ? 'true' : 'false'}
            className="ddpage-teaser-form mt-2 flex w-full max-w-[460px] rounded-full border border-white/20 bg-white/[0.06] p-1.5"
            noValidate
          >
            <input
              type="email"
              required
              aria-label="이메일"
              placeholder="이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={done}
              className="ddpage-teaser-input flex-1 bg-transparent px-4 text-[15px] tracking-[-0.02em] text-white outline-none border-0 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={done}
              className="h-11 rounded-full bg-white px-5 text-[15px] font-semibold tracking-[-0.02em] text-[#21164c] transition-[background-color,color,transform] duration-200 ease-out hover:bg-[#592eff] hover:text-white active:translate-y-px active:scale-[0.99] disabled:hover:bg-white disabled:hover:text-[#21164c]"
            >
              {done ? '완료' : '사전예약하기'}
            </button>
          </form>

          <p data-on={done ? 'true' : 'false'} className="ddpage-teaser-success m-0 text-[14px] text-[#a2ea13]">
            사전예약이 완료되었어요. 가장 먼저 알려드릴게요.
          </p>

          <div className="inline-flex items-center gap-2 text-[13px] text-white/50">
            <span className="inline-flex">
              <i className="inline-block size-[18px] rounded-full border-[1.5px] border-[#21164c] bg-[#bcf2ff]" />
              <i className="-ml-1.5 inline-block size-[18px] rounded-full border-[1.5px] border-[#21164c] bg-[#ffaae6]" />
              <i className="-ml-1.5 inline-block size-[18px] rounded-full border-[1.5px] border-[#21164c] bg-[#dfff9d]" />
            </span>
            <span className="break-keep">
              이미 <strong className="font-semibold text-white/85">{trustCount.toLocaleString()}</strong>명이 기다리고 있어요
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          ABOUT teaser
          ============================================================ */}
      <section className="border-t border-white/10 bg-[#21164c] px-6 pt-25 pb-25 text-center">
        <div className="mx-auto max-w-[720px]">
          <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#bcf2ff]">About</p>
          <p className="mt-6 mb-0 font-semibold leading-[1.45] tracking-[-0.02em] text-white/90 font-[family-name:Montserrat,system-ui,sans-serif] text-[clamp(22px,2.4vw,30px)] break-keep">
            일상은 사물로 이루어져 있습니다. 우리는 그 사물에 이름을 다시 붙입니다.
            오래된 형태에 새로운 시선을 더해,{' '}
            <span className="text-[#ffaae6]">이름 없던 것들에 이름을</span> 돌려줍니다.
          </p>
          <p className="mt-10 text-[14px] font-bold tracking-[0.3em] text-white/50 font-[family-name:Montserrat,system-ui,sans-serif]">
            SEE YOU SOON
          </p>
        </div>
      </section>

      {/* ============================================================
          MANIFESTO
          ============================================================ */}
      <section className="border-t border-white/10 bg-[#21164c] px-6 pt-25 pb-30">
        <div className="ddpage-teaser-manifesto-grid mx-auto max-w-[1080px] grid grid-cols-[1fr_2.4fr] items-start gap-20">
          <div className="flex flex-col gap-4.5">
            <p className="m-0 text-[13px] font-bold uppercase tracking-[0.2em] text-[#bcf2ff] font-[family-name:Montserrat,system-ui,sans-serif]">
              Manifesto · 我們相信
            </p>
            <p className="m-0 max-w-[22ch] text-[14px] leading-[1.7] text-white/55 break-keep">
              4년간 13명의 장인, 6개의 공방, 2개 도시를 거쳐 다듬어 온 한 줄의 문장.
            </p>
          </div>
          <div>
            <p className="ddpage-teaser-quote m-0 max-w-[22ch] font-normal leading-[1.45] tracking-[-0.01em] text-white font-[family-name:'Noto_Serif_KR','Nanum_Myeongjo',serif] text-[clamp(28px,3.8vw,48px)] break-keep">
              우리는 사물을 만들지 않습니다.
              <br />
              그 사물이 머무는 <span className="text-[#ffaae6]">시간</span>을 만듭니다.
            </p>
            <p className="mt-8 text-[13px] text-white/55 tracking-[-0.02em]">
              <b className="mb-0.5 block font-semibold text-white/85">NOUN Studio · 2026</b>
              서울 · 청주
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FIRST-LOOK COLLECTION
          ============================================================ */}
      <section id="collection" className="border-t border-white/10 bg-[#21164c] px-6 pt-28 pb-30">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#ffaae6]">The first chapter</p>
              <h2 className="mt-3 mb-0 max-w-[16ch] font-bold leading-[1.05] tracking-[-0.03em] text-white font-[family-name:Montserrat,system-ui,sans-serif] text-[clamp(32px,4.4vw,56px)] break-keep">
                첫 컬렉션
                <br />
                여섯 개의 오브제.
              </h2>
            </div>
            <p className="m-0 max-w-[32ch] text-[14px] leading-[1.65] text-white/55 break-keep">
              형태와 이름을 다시 짓는 작은 일들. 사진은 출시일에 공개되며, 지금은 윤곽만 살짝.
            </p>
          </div>

          <div className="ddpage-teaser-collection-grid">
            {OBJECTS.map((o) => (
              <article
                key={o.no}
                className="ddpage-teaser-obj relative aspect-[4/5] overflow-hidden rounded-[24px] p-5.5 flex flex-col justify-between"
                style={{ background: o.bg }}
              >
                <div className="relative z-[2] flex items-center justify-between gap-2">
                  <span className="text-[12px] font-bold tracking-[0.18em] text-white/60 font-[family-name:Montserrat,system-ui,sans-serif]">{o.no}</span>
                  <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.14em] text-white/55">{o.chip}</span>
                </div>
                <div className="absolute inset-0 z-[1] grid place-items-center" aria-hidden="true">
                  <div style={{ color: o.stroke, width: '50%', height: '50%' }} className="[&_svg]:size-full [&_svg]:stroke-current [&_svg]:fill-none">
                    {o.art}
                  </div>
                </div>
                <div className="relative z-[2] flex flex-col gap-0.5">
                  <h3 className="m-0 text-[22px] font-bold tracking-[-0.02em] text-white font-[family-name:Montserrat,system-ui,sans-serif]">{o.name}</h3>
                  <span className="text-[15px] text-white/70 font-[family-name:'Noto_Serif_KR','Nanum_Myeongjo',serif]">{o.kr}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          MATERIALS & CRAFT
          ============================================================ */}
      <section id="craft" className="border-t border-white/10 bg-[#21164c] px-6 py-30">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 flex max-w-[720px] flex-col items-center gap-3.5 text-center">
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#a2ea13]">Materials &amp; craft</p>
            <h2 className="m-0 font-bold leading-[1.1] tracking-[-0.02em] text-white font-[family-name:Montserrat,system-ui,sans-serif] text-[clamp(28px,3.4vw,42px)] break-keep">
              손과 시간으로 다듬은 네 가지.
            </h2>
            <p className="m-0 max-w-[42ch] text-[16px] leading-[1.65] text-white/60 break-keep">
              모든 오브제는 단일 소재의 정직한 표면을 지향합니다. 과한 마감은 빼고, 오래 두고 보아도 질리지 않는 결만 남깁니다.
            </p>
          </div>

          <div className="ddpage-teaser-craft-grid">
            {MATERIALS.map((m) => (
              <article key={m.no} className="flex flex-col overflow-hidden rounded-[24px] border border-white/8 bg-white/[0.02]">
                <div className={`${m.cls} aspect-[4/3]`} aria-label={`${m.kr} 스와치`} />
                <div className="flex flex-col gap-1 px-5 pt-4.5 pb-5.5">
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-white/40 font-[family-name:Montserrat,system-ui,sans-serif]">{m.no}</span>
                  <h3 className="m-0 text-[18px] font-bold tracking-[-0.02em] text-white font-[family-name:Montserrat,system-ui,sans-serif]">{m.name}</h3>
                  <span className="text-[13px] text-white/55 font-[family-name:'Noto_Serif_KR','Nanum_Myeongjo',serif]">{m.kr}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          BENEFITS (light)
          ============================================================ */}
      <section className="bg-white px-6 py-28 text-[#353241]">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="m-0 max-w-[18ch] font-bold leading-[1.1] tracking-[-0.02em] text-[#21164c] font-[family-name:Montserrat,system-ui,sans-serif] text-[clamp(28px,3.6vw,44px)] break-keep">
              사전예약 멤버에게만
              <br />
              드리는 세 가지.
            </h2>
            <p className="m-0 max-w-[32ch] text-[15px] text-[#353241]/65 break-keep">
              정식 출시 전 가입한 분들에게만 드리는 혜택입니다. 자리는 한정되어 있어요.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <BenefitCard num="01" tint="#dfff9d" icon={<Gift strokeWidth={1.6} className="size-5.5" />} title="평생 20% 할인" body="정식 출시 후 첫 1년간, 사전예약자에게만 적용되는 멤버 가격." />
            <BenefitCard num="02" tint="#bcf2ff" icon={<DoorOpen strokeWidth={1.6} className="size-5.5" />} title="7일 먼저 입장" body="정식 오픈 일주일 전, 멤버 전용 프리뷰로 첫 컬렉션을 먼저 만나보세요." />
            <BenefitCard num="03" tint="#ffaae6" icon={<Package strokeWidth={1.6} className="size-5.5" />} title="한정 오브제 키트" body="사전예약자에게만 보내드리는 첫 컬렉션 사은품. 넘버링 한정 수량." />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6 rounded-[22px] bg-[#eeeeee] px-8 py-7">
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#592eff] font-[family-name:Montserrat,system-ui,sans-serif]">
                한정 수량 · Numbered 001 → 500
              </span>
              <p className="m-0 text-[20px] font-bold tracking-[-0.02em] text-[#21164c] font-[family-name:Montserrat,system-ui,sans-serif]">
                남은 자리 360 / 500
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-1.5 w-60 max-w-full overflow-hidden rounded-full bg-[#21164c]/12">
                <i className="absolute inset-y-0 left-0 right-[28%] rounded-full bg-[#592eff]" />
              </div>
              <span className="text-[13px] font-bold text-[#21164c] font-[family-name:Montserrat,system-ui,sans-serif]">72%</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          JOURNEY
          ============================================================ */}
      <section id="journey" className="bg-white px-6 pt-25 pb-30">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-16 flex flex-col items-center gap-3.5 text-center">
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#592eff]">Journey</p>
            <h2 className="m-0 font-bold leading-[1.1] tracking-[-0.02em] text-[#21164c] font-[family-name:Montserrat,system-ui,sans-serif] text-[clamp(28px,3.6vw,44px)] break-keep">
              사 년의 준비, 한 달의 도착.
            </h2>
          </div>

          <div className="ddpage-teaser-journey-track">
            {JOURNEY.map((s) => (
              <div key={s.year} data-current={s.current ? 'true' : 'false'} className="ddpage-teaser-journey-step">
                <div className={`text-[28px] font-bold tracking-[-0.02em] font-[family-name:Montserrat,system-ui,sans-serif] ${s.current ? 'text-[#592eff]' : 'text-[#21164c]'}`}>
                  {s.year}
                </div>
                <div>
                  <h4 className="mt-1 mb-1.5 text-[18px] font-bold tracking-[-0.02em] text-[#21164c] font-[family-name:Montserrat,system-ui,sans-serif]">
                    {s.title}
                    {s.badge && (
                      <span className="ml-2 inline-flex h-5.5 items-center rounded-full bg-[#592eff] px-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                        {s.badge}
                      </span>
                    )}
                  </h4>
                  <p className="m-0 max-w-[48ch] text-[15px] leading-[1.65] text-[#353241]/75 break-keep">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FOUNDER'S NOTE
          ============================================================ */}
      <section className="bg-[#eeeeee] px-6 py-25">
        <div className="ddpage-teaser-note-grid mx-auto grid max-w-[800px] grid-cols-[1fr_2fr] items-start gap-14">
          <div className="ddpage-teaser-note-photo-wrap aspect-[3/4] overflow-hidden rounded-[24px]">
            <div className="ddpage-teaser-note-photo grid h-full w-full place-items-center" aria-hidden="true">
              <span className="relative z-[2] text-[80px] font-bold tracking-[-0.04em] text-white/92 font-[family-name:Montserrat,system-ui,sans-serif]">
                SJ
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#592eff] font-[family-name:Montserrat,system-ui,sans-serif]">
              A note from the founder
            </p>
            <h3 className="m-0 text-[28px] leading-[1.35] tracking-[-0.01em] text-[#21164c] font-[family-name:'Noto_Serif_KR','Nanum_Myeongjo',serif] break-keep">
              &ldquo;이름을 다시 짓는 일은,
              <br />
              사물을 다시 좋아하게 하는 일.&rdquo;
            </h3>
            <p className="m-0 text-[17px] leading-[1.85] text-[#353241] font-[family-name:'Noto_Serif_KR','Nanum_Myeongjo',serif] break-keep">
              오래된 사물을 좋아하는 사람들이 모였습니다. 매끈한 표면보다 손때, 새것보다 두 번째 사용을 좋아하는 사람들.
              우리는 그 마음을 일상의 형태로 옮기는 일을 하기로 했습니다. 한 줄 한 줄, 천천히 보내드리겠습니다.
            </p>
            <div className="mt-3 flex flex-col gap-0.5">
              <span className="text-[16px] font-semibold text-[#21164c] font-[family-name:'Noto_Serif_KR','Nanum_Myeongjo',serif]">
                서지윤
              </span>
              <span className="text-[13px] text-[#353241]/60">Founder, NOUN Studio</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FAQ
          ============================================================ */}
      <section id="faq" className="bg-white px-6 pt-28 pb-32">
        <div className="ddpage-teaser-faq-grid mx-auto grid max-w-[880px] grid-cols-[320px_1fr] gap-15">
          <div>
            <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#21164c]">FAQ</p>
            <h2 className="mt-2 mb-4 font-bold leading-[1.1] tracking-[-0.02em] text-[#21164c] font-[family-name:Montserrat,system-ui,sans-serif] text-[clamp(28px,3.4vw,42px)] break-keep">
              궁금하실 것들.
            </h2>
            <p className="m-0 mb-5 text-[15px] leading-[1.65] text-[#353241]/70 break-keep">
              출시 전 가장 많이 받은 질문들을 모았습니다. 더 궁금한 점은 메일로 답해드릴게요.
            </p>
            <a href="mailto:hello@noun.studio" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#592eff] hover:opacity-75" target="_blank" rel="noopener noreferrer">
              hello@noun.studio →
            </a>
          </div>
          <div className="flex flex-col border-t border-[#e0e0db]">
            {FAQ.map((f) => (
              <details key={f.q} className="ddpage-teaser-faq-item border-b border-[#e0e0db] py-5">
                <summary>
                  {f.q}
                  <span className="ddpage-teaser-faq-icon" aria-hidden="true" />
                </summary>
                <p className="mt-2 mb-1 max-w-[56ch] text-[15px] leading-[1.7] text-[#353241]/80 break-keep">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SOCIAL
          ============================================================ */}
      <section className="flex flex-col items-center gap-6 border-t border-white/10 bg-[#21164c] px-6 pt-6 pb-25 text-white">
        <p className="mt-12 mb-0 text-[20px] font-semibold tracking-[-0.02em] text-white font-[family-name:Montserrat,system-ui,sans-serif] break-keep">
          Stay tuned — 소식을 가장 먼저 받아보세요.
        </p>
        <p className="m-0 text-[14px] text-white/55 break-keep">메일 외에도 인스타그램에서 작업 과정을 살짝 공개합니다.</p>
        <div className="mt-2 flex gap-3">
          <SocialIcon href="#" label="Instagram"><InstagramGlyph strokeWidth={1.6} className="size-5.5" /></SocialIcon>
          <SocialIcon href="#" label="X (Twitter)"><XIcon strokeWidth={1.6} className="size-5.5" /></SocialIcon>
          <SocialIcon href="#" label="YouTube"><YoutubeGlyph strokeWidth={1.6} className="size-5.5" /></SocialIcon>
          <SocialIcon href="#" label="Threads"><AtSign strokeWidth={1.6} className="size-5.5" /></SocialIcon>
        </div>
        <p className="mt-2 text-[14px] tracking-[0.04em] text-white/45 font-[family-name:Montserrat,system-ui,sans-serif]">@noun.studio</p>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="border-t border-white/10 bg-[#21164c] px-6 pt-9 pb-11 text-[12px] tracking-[-0.02em] text-white/40">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1.5 text-[14px] font-bold tracking-[-0.02em] text-white/60 font-[family-name:Montserrat,system-ui,sans-serif]">
              <span className="size-1.5 rounded-full bg-[#ffaae6]" />
              NOUN Studio · Seoul
            </span>
            <span className="text-[11px] text-white/30">© 2026 NOUN. All rights reserved. · 포트폴리오용 샘플 작업입니다</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/portfolio" className="hover:text-white/70">← 다른 포트폴리오 보기</Link>
            <Link href="#" className="hover:text-white/70">개인정보 처리방침</Link>
            <Link href="#" className="hover:text-white/70">이용약관</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* =========================================================================
   Sub-components
   ========================================================================= */
function BenefitCard({
  num, tint, icon, title, body,
}: { num: string; tint: string; icon: ReactNode; title: string; body: string }) {
  return (
    <article className="flex min-h-[240px] flex-col gap-3.5 rounded-[26px] border border-[#e0e0db] bg-white px-7 pt-8 pb-9 transition-colors duration-200 hover:border-[#592eff]">
      <span className="text-[13px] font-bold tracking-[0.14em] text-[#592eff] font-[family-name:Montserrat,system-ui,sans-serif]">{num}</span>
      <div className="-mt-1 grid size-11 place-items-center rounded-[14px] text-[#21164c]" style={{ backgroundColor: tint }} aria-hidden="true">
        {icon}
      </div>
      <h3 className="m-0 text-[22px] font-bold leading-[1.2] tracking-[-0.02em] text-[#21164c] font-[family-name:Montserrat,system-ui,sans-serif] break-keep">{title}</h3>
      <p className="m-0 text-[15px] leading-[1.55] text-[#353241]/80 break-keep">{body}</p>
    </article>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  const isExternal = /^https?:\/\//.test(href)
  const cls = "grid size-14 place-items-center rounded-[18px] border border-white/15 text-white transition-colors duration-200 hover:border-white hover:bg-white/[0.06]"
  if (isExternal) {
    return (
      <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} aria-label={label} className={cls}>
      {children}
    </Link>
  )
}
