'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Star, ArrowRight, Menu, X } from 'lucide-react'

/* =================================================================
   Scoped page CSS — all selectors prefixed `.ddpage-ohgong`.
   We keep here only what Tailwind can't express cleanly:
   - keyframes (ohg-rise, ohg-breathe, ohg-marquee)
   - radial-gradient surfaces (sphere, stars, washes)
   - backdrop-filter on the nav
   - gradient-bordered "frame-violet" via border-box trick
   - background-clip:text gradient text
   - ::before / ::after rings on the sphere
   ================================================================= */
const SCOPED_CSS = `
.ddpage-ohgong {
  --bg:        #050510;
  --bg-2:      #0a0a1a;
  --card:      rgba(255,255,255,0.035);
  --card-hi:   rgba(255,255,255,0.06);
  --line:      rgba(255,255,255,0.08);
  --line-hi:   rgba(255,255,255,0.14);
  --ink:       #ffffff;
  --ink-2:     #d4d4dc;
  --muted:     #8a8a9c;
  --muted-2:   #5a5a6a;
  --v-300:     #d8b4fe;
  --v-400:     #c084fc;
  --v-500:     #a855f7;
  --v-700:     #7c3aed;

  background: var(--bg);
  color: var(--ink);
  font-family: 'Pretendard', 'Inter Tight', ui-sans-serif, system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  overflow-x: hidden;
}

.ddpage-ohgong .font-display { font-family: 'Bricolage Grotesque', 'Pretendard', 'Inter Tight', ui-sans-serif, sans-serif; letter-spacing: -0.025em; }
.ddpage-ohgong .font-mono    { font-family: ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace; }
.ddpage-ohgong .h-display    {
  font-family: 'Pretendard', 'Bricolage Grotesque', ui-sans-serif, sans-serif;
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.96;
}

.ddpage-ohgong .eyebrow {
  font-size: 11px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--muted);
  font-weight: 500;
}

/* Gradient text */
.ddpage-ohgong .text-v-gradient {
  background: linear-gradient(180deg, #f3e8ff 0%, #c084fc 50%, #9333ea 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.ddpage-ohgong .text-v-soft {
  background: linear-gradient(180deg, #ffffff 0%, #d8b4fe 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}

/* Stars */
.ddpage-ohgong .stars {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.7), transparent 60%),
    radial-gradient(1px 1px at 86% 14%, rgba(255,255,255,0.55), transparent 60%),
    radial-gradient(1.2px 1.2px at 24% 78%, rgba(255,255,255,0.8), transparent 60%),
    radial-gradient(1px 1px at 92% 64%, rgba(255,255,255,0.45), transparent 60%),
    radial-gradient(1px 1px at 6% 52%, rgba(255,255,255,0.6), transparent 60%),
    radial-gradient(0.8px 0.8px at 44% 38%, rgba(216,180,254,0.55), transparent 60%),
    radial-gradient(1px 1px at 68% 84%, rgba(255,255,255,0.45), transparent 60%),
    radial-gradient(1.2px 1.2px at 34% 8%, rgba(255,255,255,0.5), transparent 60%),
    radial-gradient(1px 1px at 78% 32%, rgba(255,255,255,0.55), transparent 60%),
    radial-gradient(0.8px 0.8px at 58% 64%, rgba(216,180,254,0.6), transparent 60%),
    radial-gradient(1px 1px at 18% 96%, rgba(255,255,255,0.5), transparent 60%),
    radial-gradient(1px 1px at 96% 90%, rgba(255,255,255,0.4), transparent 60%);
  background-size: 1200px 1200px;
  background-repeat: repeat;
  opacity: 0.85;
}

/* Spheres */
.ddpage-ohgong .sphere {
  position: relative;
  width: 360px; height: 360px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 28%, rgba(255,255,255,0.85), rgba(255,255,255,0) 28%),
    radial-gradient(circle at 64% 38%, rgba(244,114,182,0.35), transparent 45%),
    radial-gradient(circle at 50% 50%, #c084fc 0%, #8b5cf6 30%, #5b21b6 60%, #1e1b4b 92%);
  box-shadow:
    0 0 60px 8px rgba(168, 85, 247, 0.55),
    0 0 160px 40px rgba(124, 58, 237, 0.32),
    0 0 280px 80px rgba(76, 29, 149, 0.22),
    inset -32px -32px 80px rgba(0, 0, 0, 0.55),
    inset 14px 14px 32px rgba(255, 255, 255, 0.06);
  animation: ohg-breathe 7s ease-in-out infinite;
}
.ddpage-ohgong .sphere-ring {
  position: relative;
  width: 280px; height: 280px;
  border-radius: 50%;
  background:
    radial-gradient(circle at 40% 32%, rgba(255,255,255,0.75), rgba(255,255,255,0) 30%),
    radial-gradient(circle at 50% 50%, #a78bfa 0%, #7c3aed 35%, #4c1d95 65%, #1e1b4b 92%);
  box-shadow:
    0 0 50px 8px rgba(167, 139, 250, 0.5),
    0 0 140px 40px rgba(124, 58, 237, 0.28),
    inset -28px -28px 60px rgba(0, 0, 0, 0.55);
}
.ddpage-ohgong .sphere-ring::after {
  content: ''; position: absolute; inset: -60% -45%;
  border-radius: 50%;
  border: 1px solid rgba(216, 180, 254, 0.18);
  transform: rotate(-14deg);
  box-shadow: inset 0 0 60px rgba(168,85,247,0.18), 0 0 60px rgba(167,139,250,0.06);
}
.ddpage-ohgong .sphere-ring::before {
  content: ''; position: absolute; inset: -38% -22%;
  border-radius: 50%;
  border: 1px solid rgba(216, 180, 254, 0.28);
  transform: rotate(-14deg);
}
.ddpage-ohgong .sphere-wrap { position: relative; display: flex; align-items: center; justify-content: center; }
.ddpage-ohgong .sphere-wrap::before {
  content: ''; position: absolute;
  width: 720px; height: 720px;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(124, 58, 237, 0.28), transparent 55%);
  pointer-events: none; z-index: -1;
}

@keyframes ohg-breathe {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.025); }
}

/* Cards */
.ddpage-ohgong .card-ohg {
  background: linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid var(--line);
  border-radius: 20px;
  transition: border-color 0.4s ease, background 0.4s ease, transform 0.4s ease;
}
.ddpage-ohgong .card-ohg:hover {
  border-color: var(--line-hi);
  background: linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
}
.ddpage-ohgong .card-soft {
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--line);
  border-radius: 14px;
}
.ddpage-ohgong .card-glow {
  position: relative;
  background: linear-gradient(180deg, rgba(124,58,237,0.18) 0%, rgba(76,29,149,0.05) 100%);
  border: 1px solid rgba(192,132,252,0.22);
  border-radius: 20px;
  overflow: hidden;
}
.ddpage-ohgong .card-glow::after {
  content: ''; position: absolute; top: -40%; right: -20%;
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(192,132,252,0.35), transparent 60%);
  pointer-events: none;
}

/* Gradient-bordered frame (border-box trick — Tailwind can't do this cleanly) */
.ddpage-ohgong .frame-violet {
  position: relative;
  background:
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)) padding-box,
    linear-gradient(160deg, rgba(192,132,252,0.5), rgba(255,255,255,0.04) 40%, rgba(192,132,252,0.2)) border-box;
  border: 1px solid transparent;
  border-radius: 22px;
}

/* Buttons */
.ddpage-ohgong .btn-ohg {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.01em;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease, transform 0.15s ease;
  line-height: 1;
}
.ddpage-ohgong .btn-ohg:active { transform: scale(0.97); }
.ddpage-ohgong .btn-primary  { background: #ffffff; color: #050510; }
.ddpage-ohgong .btn-primary:hover  { background: #e8e6f0; }
.ddpage-ohgong .btn-outline  { background: rgba(255,255,255,0.04); color: #fff; border-color: rgba(255,255,255,0.18); }
.ddpage-ohgong .btn-outline:hover  { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); }

/* Chips */
.ddpage-ohgong .chip {
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 12px;
  letter-spacing: -0.005em;
  border: 1px solid var(--line);
  color: var(--muted);
  background: transparent;
  cursor: pointer;
  transition: all 0.25s ease;
}
.ddpage-ohgong .chip:hover { color: #fff; border-color: var(--line-hi); }
.ddpage-ohgong .chip[aria-pressed="true"] {
  background: #fff; color: #050510; border-color: #fff;
}

/* Work card hover */
.ddpage-ohgong .work-card { transition: transform 0.5s cubic-bezier(0.22,0.61,0.36,1); }
.ddpage-ohgong .work-card:hover { transform: translateY(-4px); }
.ddpage-ohgong .work-img { transition: transform 0.7s cubic-bezier(0.22,0.61,0.36,1); }
.ddpage-ohgong .work-card:hover .work-img { transform: scale(1.05); }
.ddpage-ohgong .work-overlay {
  background: linear-gradient(180deg, rgba(5,5,16,0) 35%, rgba(5,5,16,0.85) 100%);
  opacity: 0; transition: opacity 0.4s ease;
}
.ddpage-ohgong .work-card:hover .work-overlay { opacity: 1; }

/* Reveal */
.ddpage-ohgong .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.9s ease, transform 0.9s ease; }
.ddpage-ohgong .reveal.in { opacity: 1; transform: translateY(0); }

/* Entrance */
@keyframes ohg-rise {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ddpage-ohgong .rise-1 { animation: ohg-rise 1.0s cubic-bezier(0.22,0.61,0.36,1) 0.05s both; }
.ddpage-ohgong .rise-2 { animation: ohg-rise 1.0s cubic-bezier(0.22,0.61,0.36,1) 0.20s both; }
.ddpage-ohgong .rise-3 { animation: ohg-rise 1.0s cubic-bezier(0.22,0.61,0.36,1) 0.40s both; }
.ddpage-ohgong .rise-4 { animation: ohg-rise 1.0s cubic-bezier(0.22,0.61,0.36,1) 0.55s both; }
.ddpage-ohgong .rise-5 { animation: ohg-rise 1.0s cubic-bezier(0.22,0.61,0.36,1) 0.70s both; }

/* Section background washes */
.ddpage-ohgong .wash-tl {
  position: absolute; top: 0; left: -15%;
  width: 720px; height: 720px;
  background: radial-gradient(circle, rgba(124,58,237,0.22), transparent 60%);
  pointer-events: none; z-index: 0;
}
.ddpage-ohgong .wash-br {
  position: absolute; bottom: 0; right: -15%;
  width: 720px; height: 720px;
  background: radial-gradient(circle, rgba(168,85,247,0.18), transparent 60%);
  pointer-events: none; z-index: 0;
}

/* Nav blur */
.ddpage-ohgong .nav-blur {
  background: rgba(0,0,0,0.55);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
}

/* Form */
.ddpage-ohgong .field {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 12px 14px;
  color: #fff;
  width: 100%;
  font-family: inherit; font-size: 14px;
  transition: border-color 0.25s ease, background 0.25s ease;
}
.ddpage-ohgong .field::placeholder { color: var(--muted-2); }
.ddpage-ohgong .field:focus { outline: none; border-color: rgba(192,132,252,0.55); background: rgba(255,255,255,0.05); }
`

/* ──────────── Data ──────────── */
type Category = 'all' | 'identity' | 'package' | 'editorial'
type Work = {
  id: number; title: string; meta: string; year: string
  cat: Exclude<Category, 'all'>
  img: string; span: string; aspect: string
}

const WORKS: Work[] = [
  { id: 1, title: '고요한 책방',         meta: 'Brand Identity · 2024',  cat: 'identity',  year: '2024', img: 'https://placehold.co/900x680/100828/c084fc?text=Plate+%E2%80%A2+01', span: 'md:col-span-7', aspect: 'aspect-[4/3]' },
  { id: 2, title: '달의 차',             meta: 'Tea · Package Design',   cat: 'package',   year: '2023', img: 'https://placehold.co/600x800/0a0a1a/c084fc?text=Plate+%E2%80%A2+02', span: 'md:col-span-5', aspect: 'aspect-[3/4]' },
  { id: 3, title: '여름 산문집',         meta: 'Book Design',            cat: 'editorial', year: '2024', img: 'https://placehold.co/600x750/0a0a1a/c084fc?text=Plate+%E2%80%A2+03', span: 'md:col-span-4', aspect: 'aspect-[4/5]' },
  { id: 4, title: '늦은 카페',           meta: 'Café · Identity',        cat: 'identity',  year: '2023', img: 'https://placehold.co/600x600/100828/c084fc?text=Plate+%E2%80%A2+04', span: 'md:col-span-4', aspect: 'aspect-square' },
  { id: 5, title: '작은 향초',           meta: 'Candle · Package',       cat: 'package',   year: '2024', img: 'https://placehold.co/600x750/0a0a1a/c084fc?text=Plate+%E2%80%A2+05', span: 'md:col-span-4', aspect: 'aspect-[4/5]' },
  { id: 6, title: '겨울 전시 — 흰 종이', meta: 'Poster · Exhibition',    cat: 'editorial', year: '2024', img: 'https://placehold.co/1280x720/100828/c084fc?text=Plate+%E2%80%A2+06', span: 'md:col-span-8', aspect: 'aspect-video' },
  { id: 7, title: '조용한 화방',         meta: 'Art Supply · Identity',  cat: 'identity',  year: '2022', img: 'https://placehold.co/600x750/0a0a1a/c084fc?text=Plate+%E2%80%A2+07', span: 'md:col-span-4', aspect: 'aspect-[4/5]' },
]

const FILTERS: { id: Category; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'identity',  label: 'Identity' },
  { id: 'package',   label: 'Package' },
  { id: 'editorial', label: 'Editorial' },
]

const TESTIMONIALS = [
  { quote: '처음 시안을 받았을 때, 우리 가게가 처음부터 이런 모습이었던 것 같았어요. 오공의 디자인은 어색하지 않고, 자리에 가만히 앉아 있어요.', author: '정 ◯ ◯', role: '고요한 책방 · 대표',        avatar: 'from-violet-300 to-violet-700' },
  { quote: '말로 다 풀어내지 못한 것들을 글자와 색으로 정확히 들어 주셨어요. 오래 함께 작업하고 싶은 분이에요.',                              author: '임 ◯ ◯', role: '달의 차 · 브랜드 매니저',   avatar: 'from-fuchsia-300 to-purple-700' },
  { quote: '결과물이 마음에 든 것은 물론이고, 진행 과정에서 한 번도 답답한 적이 없었어요. 다음 책도 부탁드리고 싶어요.',                       author: '박 ◯ ◯', role: 'paper press · 편집장',       avatar: 'from-violet-300 to-indigo-700' },
  { quote: '작은 가게라서 큰 스튜디오에 맡기기 부담스러웠는데, 오공은 우리 가게의 호흡을 정확히 들어 주셨어요.',                              author: '윤 ◯ ◯', role: '늦은 카페 · 대표',           avatar: 'from-purple-300 to-violet-700' },
  { quote: '포장지가 도착했을 때, 손님들이 받고 한참 들여다 보더라는 이야기를 가장 많이 들어요.',                                              author: '한 ◯ ◯', role: '작은 향초 · 대표',           avatar: 'from-pink-300 to-violet-700' },
  { quote: '디자인 외적인 것까지 신경 써 주셔서 든든했어요. 전시 도록이 작품의 일부처럼 느껴졌어요.',                                          author: '최 ◯ ◯', role: 'winter notes · 작가',        avatar: 'from-violet-200 to-purple-700' },
]

/* ──────────── Page ──────────── */
export default function Page() {
  const [filter, setFilter] = useState<Category>('all')
  const [status, setStatus] = useState('보통 2–3일 안에 답장 드립니다.')
  const [submitted, setSubmitted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const revealRoot = useRef<HTMLElement | null>(null)

  const NAV_LINKS = [
    ['#about', '소개'],
    ['#work', '작업'],
    ['#services', '분야'],
    ['#process', '과정'],
    ['#voices', '목소리'],
  ] as const

  useEffect(() => {
    const root = revealRoot.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
        })
      },
      { threshold: 0.10, rootMargin: '0px 0px -6% 0px' }
    )
    root.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    console.log('contact submit', Object.fromEntries(fd.entries()))
    setStatus('메시지가 도착했어요. 곧 답장 드릴게요. 고맙습니다.')
    setSubmitted(true)
    e.currentTarget.reset()
  }

  const visibleWorks = filter === 'all' ? WORKS : WORKS.filter((w) => w.cat === filter)

  return (
    <main ref={revealRoot} className="ddpage-ohgong break-keep min-h-screen relative">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* ============ NAV ============ */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 mt-3">
          <div className="nav-blur h-12 px-4 flex items-center justify-between rounded-full border border-[var(--line)]">
            <a href="#top" className="flex items-center gap-2 text-[14px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" style={{ boxShadow: '0 0 8px #c084fc' }} />
              Ohgong
            </a>
            <nav className="hidden md:flex items-center gap-7 text-[13px] text-[var(--ink-2)]">
              {NAV_LINKS.map(([href, label]) => (
                <a key={href} href={href} className="hover:text-white transition-colors">{label}</a>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <a href="#contact" className="hidden sm:inline-flex btn-ohg btn-primary !py-1.5 !px-3.5 !text-[13px]">의뢰하기</a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="메뉴 열기"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-white md:hidden"
              >
                <Menu className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside
            className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col gap-8 px-7 pb-10 pt-6 border-l border-[var(--line)]"
            style={{ background: 'rgba(10,8,22,0.96)' }}
          >
            <div className="flex items-center justify-between">
              <a href="#top" className="flex items-center gap-2 text-[14px] font-medium text-white" onClick={() => setMobileMenuOpen(false)}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" style={{ boxShadow: '0 0 8px #c084fc' }} />
                Ohgong
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="메뉴 닫기"
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line)] text-white"
              >
                <X className="h-4 w-4" strokeWidth={1.8} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 text-[20px] text-[var(--ink-2)]">
              {NAV_LINKS.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 hover:text-white transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-auto btn-ohg btn-primary !py-3 !px-5 !text-[15px] justify-center"
            >
              의뢰하기
            </a>
          </aside>
        </div>
      )}

      {/* ============ HERO ============ */}
      <section id="top" className="relative pt-28 pb-0 overflow-hidden">
        <div className="stars" />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
          <div className="rise-1 eyebrow mb-7">— Studio Ohgong is the place to —</div>
          <h1 className="rise-2 h-display text-[64px] sm:text-[88px] md:text-[112px] lg:text-[136px]">
            오래 보고 싶은<br />
            <span className="text-v-soft">디자인을 만들어요</span>
          </h1>
          <p className="rise-3 mt-9 text-[15px] md:text-[16px] text-[var(--ink-2)] max-w-md mx-auto leading-relaxed">
            작은 브랜드의 작은 목소리에 귀를 기울이는 1인 스튜디오.<br />
            빠르게 지나가는 디자인이 아닌, 곁에 두고 오래 바라볼 디자인을 짓습니다.
          </p>
          <div className="rise-4 mt-9 flex items-center justify-center gap-3">
            <a href="#work"    className="btn-ohg btn-primary">작업 보기</a>
            <a href="#contact" className="btn-ohg btn-outline">의뢰하기</a>
          </div>
        </div>

        <div className="rise-5 relative mt-12 lg:mt-16 mb-20 flex justify-center">
          <div className="sphere-wrap">
            <div className="sphere" />
          </div>
        </div>
      </section>

      {/* ============ BELIEF / STATS ============ */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="wash-tl" />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
            <div className="lg:col-span-7 reveal">
              <div className="eyebrow mb-5">— At Ohgong we believe that —</div>
              <h2 className="h-display text-[40px] md:text-[56px] lg:text-[68px]">
                작품이 주인공이고<br />
                디자인은 <span className="text-v-soft">조용히 받쳐</span>줘요.
              </h2>
              <p className="mt-7 text-[15px] text-[var(--ink-2)] leading-[1.85] max-w-lg">
                모든 브랜드에는 자기만의 박자가 있다고 믿어요. 그 박자를 흐트러뜨리지 않고,
                글자 하나, 색 하나, 여백 하나가 자리를 잡을 때까지 천천히 들여다 봅니다.
              </p>
              <a href="#about" className="mt-8 inline-flex btn-ohg btn-outline">스튜디오 이야기</a>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4 reveal">
              <div className="card-ohg p-7">
                <div className="font-display text-[44px] md:text-[56px] text-v-gradient leading-none font-bold">7<span className="text-[20px] text-[var(--ink-2)] ml-1 align-middle">년</span></div>
                <div className="eyebrow mt-3">Practice</div>
                <div className="mt-2 text-[13px] text-[var(--muted)]">스튜디오를 짓고 다듬어 온 시간</div>
              </div>
              <div className="card-ohg p-7">
                <div className="font-display text-[44px] md:text-[56px] text-v-gradient leading-none font-bold">40<span className="text-[20px] text-[var(--ink-2)] ml-1 align-middle">+</span></div>
                <div className="eyebrow mt-3">Projects</div>
                <div className="mt-2 text-[13px] text-[var(--muted)]">함께 만든 브랜드와 책</div>
              </div>
              <div className="card-ohg p-7 col-span-2">
                <div className="flex items-baseline gap-4">
                  <div className="font-display text-[44px] md:text-[56px] text-v-gradient leading-none font-bold">1<span className="text-[20px] text-[var(--ink-2)] ml-1 align-middle">인</span></div>
                  <div className="font-display text-[22px] text-[var(--ink-2)]">스튜디오</div>
                </div>
                <div className="eyebrow mt-3">Independent</div>
                <div className="mt-2 text-[13px] text-[var(--muted)]">기획부터 납품까지 한 사람이 끝까지 책임집니다.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="relative py-24 lg:py-32 overflow-hidden border-t border-[var(--line)]">
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            <div className="md:col-span-5 reveal">
              <div className="card-soft overflow-hidden aspect-[3/4]">
                <img src="https://placehold.co/600x800/0a0a1a/8a8a9c?text=portrait" alt="오공 작가" className="w-full h-full object-cover opacity-90" />
              </div>
            </div>
            <div className="md:col-span-7 reveal">
              <div className="eyebrow mb-5">— Who is Ohgong —</div>
              <h3 className="h-display text-[36px] md:text-[44px] max-w-md">
                작은 것들을<br />오래 들여다봐요.
              </h3>
              <div className="mt-7 space-y-5 max-w-lg text-[15px] leading-[1.85] text-[var(--ink-2)]">
                <p>
                  안녕하세요, 그래픽 디자이너 오공입니다.
                  홍대에서 시각디자인을 공부했고, 작은 출판사와 패키지 스튜디오를 거쳐 2018년 1인 스튜디오를 열었습니다.
                </p>
                <p>
                  저는 큰 목소리로 말하는 디자인보다, 한 박자 늦게 다시 보게 되는 디자인을 좋아해요.
                  지난 7년간 작은 책방, 동네 카페, 독립 출판사들과 함께 로고와 패키지, 책의 모양을 다듬어 왔습니다.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-2 text-[12px] text-[var(--muted)]">
                {['Brand Identity', 'Package', 'Editorial', 'Poster'].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full border border-[var(--line)]">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WORK ON DISPLAY ============ */}
      <section className="relative py-24 lg:py-32 overflow-hidden border-t border-[var(--line)]">
        <div className="wash-br" />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 reveal order-2 lg:order-1">
              <div className="card-glow p-5 md:p-7 max-w-[640px] mx-auto">
                <div className="rounded-2xl overflow-hidden border border-[var(--line)] bg-[#0a0a1a]">
                  <img src="https://placehold.co/900x520/100828/c084fc?text=Plate+%E2%80%A2+%EA%B3%A0%EC%9A%94%ED%95%9C+%EC%B1%85%EB%B0%A9" alt="고요한 책방 작업 미리보기" className="w-full h-full object-cover" />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-[13px] text-[var(--muted)]">Identity · 2024</div>
                    <div className="font-display text-[22px] mt-1">고요한 책방</div>
                    <div className="text-[13px] text-[var(--ink-2)] mt-1">Logo · Stationery · Signage</div>
                  </div>
                  <a href="#work" className="btn-ohg btn-outline shrink-0">자세히</a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 reveal order-1 lg:order-2">
              <div className="eyebrow mb-5">— Shareable with anyone —</div>
              <h3 className="h-display text-[40px] md:text-[52px]">
                작업을<br />진열대 <span className="text-v-soft">위에.</span>
              </h3>
              <p className="mt-6 text-[15px] text-[var(--ink-2)] leading-[1.85] max-w-md">
                모든 프로젝트는 한 장의 사진으로 끝나지 않아요.
                기획 노트, 색의 선택, 글자의 결까지 함께 정리해 보내드립니다.
              </p>
              <a href="#work" className="mt-7 inline-flex btn-ohg btn-primary">전체 작업 보기</a>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section id="services" className="relative py-24 lg:py-32 overflow-hidden border-t border-[var(--line)]">
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <div className="eyebrow mb-4">— What I do · 4 ways to work together —</div>
            <h3 className="h-display text-[40px] md:text-[56px]">
              조용히, <span className="text-v-soft">단단하게</span>
            </h3>
            <p className="mt-5 text-[15px] text-[var(--ink-2)] leading-[1.8]">
              4가지 영역에서 작업합니다. 모든 영역이 한 사람의 손으로 시작해 한 사람의 손으로 마무리됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            <div className="card-glow p-7 md:p-9 md:col-span-2 reveal">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                <div className="md:col-span-7">
                  <div className="eyebrow mb-3">01 · Most requested</div>
                  <h4 className="font-display text-[28px] md:text-[36px] text-v-soft font-bold">Brand Identity</h4>
                  <p className="mt-3 text-[15px] text-[var(--ink-2)] leading-[1.8] max-w-md">
                    로고, 색, 글자가 한 사람처럼 말하게 만듭니다.
                    작은 브랜드, 작은 가게의 시작에 어울려요.
                  </p>
                </div>
                <div className="md:col-span-5 flex md:justify-end">
                  <ul className="text-[13px] text-[var(--ink-2)] space-y-2.5">
                    {['로고 디자인', '컬러 & 타입 시스템', '명함 · 사인 · 보조 그래픽', '브랜드 가이드'].map((s) => (
                      <li key={s} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-ohg p-7 reveal">
              <div className="eyebrow mb-3">02</div>
              <h4 className="font-display text-[24px] text-white font-bold">Package Design</h4>
              <p className="mt-3 text-[14px] text-[var(--ink-2)] leading-[1.8]">
                손에 쥐었을 때 가만히 들여다보게 되는 패키지. 오래 두고 보고 싶은 표정을 함께 찾습니다.
              </p>
            </div>
            <div className="card-ohg p-7 reveal">
              <div className="eyebrow mb-3">03</div>
              <h4 className="font-display text-[24px] text-white font-bold">Editorial</h4>
              <p className="mt-3 text-[14px] text-[var(--ink-2)] leading-[1.8]">
                책의 모양과 호흡을 짓습니다. 독립 출판물부터 작은 잡지, 전시 도록까지.
              </p>
            </div>
            <div className="card-ohg p-7 reveal md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-8">
                  <div className="eyebrow mb-3">04</div>
                  <h4 className="font-display text-[24px] text-white font-bold">Poster &amp; Print</h4>
                  <p className="mt-3 text-[14px] text-[var(--ink-2)] leading-[1.8] max-w-lg">
                    벽에 붙여 놓고 싶은 한 장. 인쇄와 종이의 결까지 함께 정합니다.
                  </p>
                </div>
                <div className="md:col-span-4 flex md:justify-end">
                  <div className="text-[12px] text-[var(--muted)] tracking-wider">printed in seoul · 2018 →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section id="process" className="relative py-24 lg:py-32 overflow-hidden border-t border-[var(--line)]">
        <div className="wash-tl" />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 reveal">
              <div className="eyebrow mb-5">— Take control of —</div>
              <h3 className="h-display text-[40px] md:text-[56px]">
                당신의 시간,<br />당신의 <span className="text-v-soft">속도로.</span>
              </h3>
              <p className="mt-6 text-[15px] text-[var(--ink-2)] leading-[1.85] max-w-md">
                모든 프로젝트는 보통 8–12주를 함께 보내요.
                처음의 대화부터 마지막의 납품까지, 한 박자 천천히 같이 걷습니다.
              </p>
              <a href="#contact" className="mt-7 inline-flex btn-ohg btn-primary">일정 문의</a>
            </div>

            <div className="lg:col-span-7 reveal">
              <div className="frame-violet p-6 md:p-7">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" />
                    <div className="text-[13px] text-[var(--ink-2)]">Process — 고요한 책방</div>
                  </div>
                  <div className="text-[12px] text-[var(--muted)] font-mono">DEC · 2024</div>
                </div>

                <div className="flex items-center gap-2 mb-5">
                  <span className="chip" aria-pressed="true">01 기획</span>
                  <span className="chip">02 디자인</span>
                  <span className="chip">03 피드백</span>
                  <span className="chip">04 납품</span>
                </div>

                <div className="card-soft p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[13px] text-[var(--ink-2)]">기획 노트</div>
                    <div className="text-[12px] text-[var(--muted)] font-mono">2주</div>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    {[
                      { name: '첫 인터뷰',        d: 'D-14', state: '완료' },
                      { name: '레퍼런스 큐레이션', d: 'D-9',  state: '완료' },
                      { name: '방향성 정리',      d: 'D-3',  state: '완료' },
                    ].map((row, i) => (
                      <div key={i}>
                        <div className="flex items-baseline justify-between gap-4">
                          <div className="text-[var(--ink-2)]">{row.name}</div>
                          <div className="flex items-center gap-3">
                            <div className="text-[var(--muted)] font-mono text-[12px]">{row.d}</div>
                            <div className="text-white">{row.state}</div>
                          </div>
                        </div>
                        <div className="h-px bg-[var(--line)] mt-3" />
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="text-white">다음 단계 — 디자인</div>
                      <a href="#" className="btn-ohg btn-primary !py-1.5 !px-3 !text-[12px]">시작 →</a>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-4 gap-2 text-[11px] text-[var(--muted)]">
                  {[
                    { l: '기획',   v: '2주' },
                    { l: '디자인', v: '4–6주' },
                    { l: '피드백', v: '2주' },
                    { l: '납품',   v: '1주' },
                  ].map((c) => (
                    <div key={c.l} className="text-center">{c.l}<br /><span className="text-white font-mono">{c.v}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ GALLERY ============ */}
      <section id="work" className="relative py-24 lg:py-32 overflow-hidden border-t border-[var(--line)]">
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal">
            <div className="eyebrow mb-4">— Selected work · 7 plates —</div>
            <h3 className="h-display text-[44px] md:text-[64px]">
              함께 만든<br /><span className="text-v-soft">작업들.</span>
            </h3>
          </div>

          <div className="flex justify-center gap-2 flex-wrap mb-12 reveal">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className="chip"
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-4 md:gap-5">
            {visibleWorks.map((w) => (
              <article key={w.id} className={`work-card group col-span-12 ${w.span} reveal`}>
                <div className="card-soft overflow-hidden relative">
                  <div className={w.aspect}>
                    <img src={w.img} alt={w.title} className="work-img w-full h-full object-cover" />
                  </div>
                  <div className="work-overlay absolute inset-0 flex items-end p-6">
                    <div>
                      <div className="eyebrow mb-2">{w.cat[0].toUpperCase() + w.cat.slice(1)} · {w.year}</div>
                      <div className="font-display text-[22px] text-white">{w.title}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-[18px] text-white">{w.title}</div>
                    <div className="text-[12px] text-[var(--muted)] mt-1">{w.meta}</div>
                  </div>
                  <div className="font-mono text-[12px] text-[var(--muted)] flex-none">— {String(w.id).padStart(2, '0')}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="voices" className="relative py-24 lg:py-32 overflow-hidden border-t border-[var(--line)]">
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--line)] bg-white/5 text-[12px] mb-5">
              <Star size={14} fill="#c084fc" strokeWidth={0} />
              <span className="text-[var(--ink)] font-medium">4.9 / 5</span>
              <span className="text-[var(--muted)]">— 40+ clients</span>
            </div>
            <h3 className="h-display text-[40px] md:text-[56px]">
              그들의 <span className="text-v-soft">말.</span>
            </h3>
            <p className="mt-4 text-[15px] text-[var(--ink-2)] max-w-md mx-auto leading-relaxed">
              지난 7년 동안 함께 작업한 분들이 남겨 주신 이야기들이에요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className="card-ohg p-6 reveal">
                <blockquote className="text-[14px] leading-[1.7] text-[var(--ink)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatar}`} />
                  <div>
                    <div className="text-[13px] text-white">{t.author}</div>
                    <div className="text-[12px] text-[var(--muted)]">{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BOTTOM HERO + CONTACT ============ */}
      <section id="contact" className="relative pt-24 lg:pt-32 pb-16 overflow-hidden border-t border-[var(--line)]">
        <div className="stars" />

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
          <div className="eyebrow mb-7">— Let&apos;s make something quiet together —</div>
          <h2 className="h-display text-[56px] sm:text-[80px] md:text-[104px] lg:text-[128px]">
            함께 만들어<br /><span className="text-v-soft">봐요.</span>
          </h2>
          <p className="mt-8 text-[15px] text-[var(--ink-2)] max-w-md mx-auto leading-relaxed">
            흥미로운 프로젝트는 언제든 환영해요.<br />
            편하게 메일을 보내 주세요.
          </p>
          <div className="mt-9">
            <a href="mailto:hello@studio-ohgong.com" className="inline-flex btn-ohg btn-primary !py-3 !px-5 !text-[15px]">
              hello@studio-ohgong.com
            </a>
          </div>
        </div>

        <div className="relative mt-16 mb-20 flex justify-center">
          <div className="sphere-wrap">
            <div className="sphere-ring" />
          </div>
        </div>

        <div className="relative max-w-[640px] mx-auto px-6 lg:px-10">
          <div className="frame-violet p-6 md:p-7">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="block">
                <span className="block text-[11px] text-[var(--muted)] mb-1.5 tracking-[0.18em] uppercase">이름</span>
                <input type="text" name="name" required className="field" placeholder="홍길동" />
              </label>
              <label className="block">
                <span className="block text-[11px] text-[var(--muted)] mb-1.5 tracking-[0.18em] uppercase">이메일</span>
                <input type="email" name="email" required className="field" placeholder="hello@example.com" />
              </label>
              <label className="block md:col-span-2">
                <span className="block text-[11px] text-[var(--muted)] mb-1.5 tracking-[0.18em] uppercase">메시지</span>
                <textarea name="message" rows={3} required className="field resize-none" placeholder="어떤 작업을 함께 만들고 싶으신가요?" />
              </label>
              <div className="md:col-span-2 mt-2 flex items-center justify-between">
                <span className="text-[12px]" style={{ color: submitted ? '#d8b4fe' : 'var(--muted)' }}>{status}</span>
                <button type="submit" className="btn-ohg btn-primary inline-flex items-center gap-2">
                  보내기 <ArrowRight size={14} strokeWidth={1.6} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative border-t border-[var(--line)] py-14">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2 text-[14px] font-medium mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" style={{ boxShadow: '0 0 8px #c084fc' }} />
                Studio Ohgong
              </div>
              <p className="text-[13px] text-[var(--muted)] max-w-xs leading-relaxed">
                서울에서 작은 브랜드를 위한 그래픽 디자인을 하는 1인 스튜디오.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink-2)] hover:text-white hover:border-[var(--line-hi)] transition-colors">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a href="https://www.behance.net/" target="_blank" rel="noopener noreferrer" aria-label="Behance" className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink-2)] hover:text-white hover:border-[var(--line-hi)] transition-colors">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h5.5a2.5 2.5 0 0 1 0 5H3z" />
                    <path d="M3 11h6a3 3 0 0 1 0 6H3z" />
                    <path d="M14 13h7a3 3 0 0 0-7 0v3a3 3 0 0 0 6 0" />
                    <path d="M15 7h5" />
                  </svg>
                </a>
                <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full border border-[var(--line)] flex items-center justify-center text-[var(--ink-2)] hover:text-white hover:border-[var(--line-hi)] transition-colors">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="eyebrow mb-4">Studio</div>
              <ul className="space-y-2 text-[13px]">
                <li><a href="#about"    className="text-[var(--ink-2)] hover:text-white transition-colors">소개</a></li>
                <li><a href="#work"     className="text-[var(--ink-2)] hover:text-white transition-colors">작업</a></li>
                <li><a href="#services" className="text-[var(--ink-2)] hover:text-white transition-colors">분야</a></li>
                <li><a href="#process"  className="text-[var(--ink-2)] hover:text-white transition-colors">과정</a></li>
              </ul>
            </div>
            <div className="md:col-span-4">
              <div className="eyebrow mb-4">Get in touch</div>
              <a href="mailto:hello@studio-ohgong.com" className="text-[15px] text-white hover:text-[#c084fc] transition-colors">hello@studio-ohgong.com</a>
              <div className="mt-2 text-[13px] text-[var(--muted)]">서울특별시 마포구 · 평일 10–18시</div>
            </div>
          </div>

          <div className="pt-6 border-t border-[var(--line)] flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[12px] text-[var(--muted)]">
            <div className="flex items-center gap-4">
              <Link href="/portfolio" className="hover:underline">← 다른 포트폴리오 보기</Link>
              <span>·</span>
              <span>© 2025 Studio Ohgong.</span>
            </div>
            <div className="text-[11px] text-[var(--muted)]">포트폴리오용 샘플 작업입니다</div>
          </div>
        </div>
      </footer>
    </main>
  )
}
