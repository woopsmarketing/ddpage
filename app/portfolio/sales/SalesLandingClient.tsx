'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Gift, Clock, TrendingUp, ArrowRight, Play, PlayCircle, Check, Star, Users,
  AlertCircle, X, FileX, SearchX, CircleHelp, ClockAlert, HeartHandshake,
  BadgeCheck, Infinity as InfinityIcon, MessageCircle, ArrowRightLeft,
  Search, FileText, Repeat, BarChart3, ShieldCheck, Quote, User,
  GraduationCap, Briefcase, Award, PenTool, BookOpen, Layers, Lock,
  ChevronDown, FileSpreadsheet, MessageSquare, ArrowDown, Wallet,
  CreditCard, Building, Smartphone, MessageCircleQuestion, AlarmClock, Zap,
  Target, Menu,
} from 'lucide-react'

const SCOPED_CSS = `
.ddpage-sales{font-family:'Open Sans','Proxima Nova',ui-sans-serif,system-ui,sans-serif;background:#fff5ee;color:#0f161e;}
.ddpage-sales *{word-break:keep-all;}
.ddpage-sales .ddpage-serif{font-family:'Source Serif 4','Source Serif Pro',Georgia,serif;}
.ddpage-sales .ddpage-num{font-variant-numeric:tabular-nums;letter-spacing:-0.01em;}
.ddpage-sales .ddpage-tight{letter-spacing:-0.02em;}
.ddpage-sales .ddpage-tighter{letter-spacing:-0.028em;}
.ddpage-sales .ddpage-blob{position:absolute;pointer-events:none;filter:blur(40px);border-radius:50%;opacity:0.55;background:radial-gradient(circle at 30% 30%, #00f5dc 0%, transparent 60%),radial-gradient(circle at 70% 60%, #d5ff4d 0%, transparent 55%),radial-gradient(circle at 60% 80%, #b773ff 0%, transparent 50%);}
.ddpage-sales .ddpage-marker{background-image:linear-gradient(transparent 62%, rgba(0,245,220,0.55) 62%, rgba(0,245,220,0.55) 92%, transparent 92%);padding:0 2px;}
.ddpage-sales .ddpage-marker-lime{background-image:linear-gradient(transparent 62%, rgba(213,255,77,0.7) 62%, rgba(213,255,77,0.7) 92%, transparent 92%);padding:0 2px;}
@keyframes ddpage-sales-fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.ddpage-sales .ddpage-fade-up{animation:ddpage-sales-fadeUp 600ms cubic-bezier(0.22,1,0.36,1) both;}
.ddpage-sales details > summary{list-style:none;cursor:pointer;}
.ddpage-sales details > summary::-webkit-details-marker{display:none;}
.ddpage-sales details[open] .ddpage-chev{transform:rotate(180deg);}
.ddpage-sales .ddpage-chev{transition:transform 200ms ease-out;}
.ddpage-sales .ddpage-glass-edge{box-shadow:inset 0 0 0 1px rgba(255,255,255,0.08);}
.ddpage-sales .ddpage-gradient-bar{background:linear-gradient(90deg, rgb(0,245,220), rgb(213,255,77) 48.5%, rgb(183,115,255));}
.ddpage-sales .ddpage-strike{text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:rgba(255,255,255,0.5);}
.ddpage-sales .ddpage-strike-dark{text-decoration:line-through;text-decoration-thickness:2px;text-decoration-color:rgba(15,22,30,0.4);}
.ddpage-sales .ddpage-before-item{color:#5a5e63;}
.ddpage-sales .ddpage-before-ico{background:#e9e4dd;color:#7a5a52;}
.ddpage-sales .ddpage-hairline{height:1px;background:rgba(15,22,30,0.08);}
.ddpage-sales .ddpage-pill{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:25px;font-size:14px;font-weight:700;line-height:1;background:#fff;border:1px solid rgba(15,22,30,0.12);}
.ddpage-sales .ddpage-pill-teal{background:#00f5dc;border-color:transparent;color:#012620;}
.ddpage-sales .ddpage-pill-lime{background:#d5ff4d;border-color:transparent;color:#012620;}
.ddpage-sales .ddpage-pill-peach{background:#fde8ce;border-color:transparent;}
.ddpage-sales .ddpage-pill-on-dark{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.18);color:#fff;}
.ddpage-sales .ddpage-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-weight:700;line-height:1;border-radius:16px;border:1.5px solid transparent;transition:background 140ms ease,color 140ms ease,border-color 140ms ease;white-space:nowrap;text-decoration:none;cursor:pointer;}
.ddpage-sales .ddpage-btn-md{padding:14px 22px;font-size:16px;}
.ddpage-sales .ddpage-btn-lg{padding:20px 28px;font-size:18px;}
.ddpage-sales .ddpage-btn-xl{padding:24px 36px;font-size:20px;}
.ddpage-sales .ddpage-btn-primary{background:#004038;color:#fff;border-color:#004038;}
.ddpage-sales .ddpage-btn-primary:hover{background:#012620;border-color:#012620;}
.ddpage-sales .ddpage-btn-teal{background:#00f5dc;color:#012620;border-color:#00f5dc;}
.ddpage-sales .ddpage-btn-teal:hover{background:#00d9c2;border-color:#00d9c2;}
.ddpage-sales .ddpage-btn-ondark{background:#fff;color:#012620;border-color:#fff;}
.ddpage-sales .ddpage-btn-ondark:hover{background:#00f5dc;color:#012620;border-color:#00f5dc;}
.ddpage-sales .ddpage-btn-ghost-dark{background:transparent;color:#fff;border-color:rgba(255,255,255,0.35);}
.ddpage-sales .ddpage-btn-ghost-dark:hover{background:rgba(255,255,255,0.08);}
`

function Stars({ size = 4, color = '#012620' }: { size?: number; color?: string }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-${size} h-${size}`} style={{ fill: color, color }} strokeWidth={1.5} />
      ))}
    </div>
  )
}

type ReviewProps = {
  initial: string
  bgInitial: string
  name: string
  role: string
  badgeText: string
  badgeClass: string
  body: string
}

function ReviewCard({ initial, bgInitial, name, role, badgeText, badgeClass, body }: ReviewProps) {
  return (
    <article className="rounded-[16px] bg-white p-7 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Stars size={4} />
        <span className={`ddpage-pill ${badgeClass}`} style={{ padding: '4px 10px', fontSize: 12 }}>{badgeText}</span>
      </div>
      <p className="text-[16px] leading-[1.6] break-keep">{body}</p>
      <div className="mt-auto pt-4 border-t border-[rgba(15,22,30,0.08)] flex items-center gap-3">
        <span className="w-10 h-10 rounded-full grid place-items-center font-bold text-[14px] text-[#012620]" style={{ background: bgInitial }}>{initial}</span>
        <div>
          <div className="font-bold text-[15px]">{name}</div>
          <div className="text-[13px] text-[#333942]">{role}</div>
        </div>
      </div>
    </article>
  )
}

type ModuleProps = {
  num: string
  title: string
  meta: string
  tag?: { text: string; cls: string }
  open?: boolean
  lessons?: { title: string; duration: string; free?: boolean }[]
  body?: string
}

function CurriculumModule({ num, title, meta, tag, open, lessons, body }: ModuleProps) {
  return (
    <details className="rounded-[16px] bg-white overflow-hidden" open={open}>
      <summary className="p-6 sm:p-7 flex items-center gap-5">
        <span className="ddpage-num font-extrabold text-[22px] ddpage-tighter text-[#004038] w-12 shrink-0">{num}</span>
        <div className="flex-1 min-w-0">
          <h3 className="text-[20px] sm:text-[22px] font-bold break-keep">{title}</h3>
          <div className="mt-1 text-[14px] text-[#333942] flex flex-wrap gap-x-4 gap-y-1 items-center">
            <span className="ddpage-num">{meta}</span>
            {tag && (
              <span className={`ddpage-pill ${tag.cls}`} style={{ padding: '3px 8px', fontSize: 11 }}>{tag.text}</span>
            )}
          </div>
        </div>
        <ChevronDown className="ddpage-chev w-5 h-5 text-[#333942] shrink-0" strokeWidth={1.5} />
      </summary>
      {lessons && (
        <div className="px-6 sm:px-7 pb-7 -mt-2">
          <ul className="divide-y divide-[rgba(15,22,30,0.06)]">
            {lessons.map((l, i) => (
              <li key={i} className="flex items-center gap-4 py-3.5 text-[15px]">
                {l.free
                  ? <PlayCircle className="w-4 h-4 text-[#004038]" strokeWidth={1.5} />
                  : <Lock className="w-4 h-4 text-[#333942]" strokeWidth={1.5} />}
                <span className="flex-1 break-keep">{l.title}</span>
                <span className="ddpage-num text-[13px] text-[#333942]">{l.duration}</span>
                {l.free && (
                  <span className="ddpage-pill ddpage-pill-teal" style={{ padding: '3px 8px', fontSize: 11 }}>FREE</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {body && !lessons && (
        <div className="px-6 sm:px-7 pb-7 -mt-2 text-[15px] text-[#333942] break-keep">{body}</div>
      )}
    </details>
  )
}

type FaqProps = { q: string; n: string; open?: boolean; children: React.ReactNode }
function Faq({ q, n, open, children }: FaqProps) {
  return (
    <details className="rounded-[16px] bg-white overflow-hidden" open={open}>
      <summary className="p-6 sm:p-7 flex items-center gap-5">
        <span className="ddpage-num font-bold text-[14px] text-[#004038] w-8 shrink-0">{n}</span>
        <h3 className="flex-1 text-[18px] font-bold break-keep">{q}</h3>
        <ChevronDown className="ddpage-chev w-5 h-5 text-[#333942] shrink-0" strokeWidth={1.5} />
      </summary>
      <div className="px-6 sm:px-7 pb-7 pl-[68px] sm:pl-[76px] text-[17px] leading-[1.65] text-[#333942] break-keep">
        {children}
      </div>
    </details>
  )
}

export default function SalesLandingClient() {
  const [countdown, setCountdown] = useState({ d: 0, h: 0, m: 0, s: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NAV_LINKS = [
    ['#why', '왜 필요한가'],
    ['#curriculum', '커리큘럼'],
    ['#reviews', '수강 후기'],
    ['#pricing', '가격'],
    ['#faq', 'FAQ'],
  ] as const

  useEffect(() => {
    const target = new Date('2026-11-28T23:59:59+09:00').getTime()
    const tick = () => {
      let diff = Math.max(0, target - Date.now())
      const d = Math.floor(diff / 86400000); diff -= d * 86400000
      const h = Math.floor(diff / 3600000);  diff -= h * 3600000
      const m = Math.floor(diff / 60000);    diff -= m * 60000
      const s = Math.floor(diff / 1000)
      setCountdown({ d, h, m, s })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <main className="ddpage-sales">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* ============================================================
          1. ALERT BAR + NAV
      ============================================================ */}
      <div className="w-full bg-[#012620] text-white">
        <div className="max-w-[1280px] mx-auto px-6 py-2.5 flex items-center justify-center gap-3 text-[14px] sm:text-[15px] break-keep">
          <Gift className="w-4 h-4 text-[#00f5dc]" strokeWidth={1.5} />
          <span className="font-semibold">11월 28일까지 얼리버드</span>
          <span className="opacity-60">·</span>
          <span><span className="ddpage-num font-bold text-[#d5ff4d]">50% 할인</span> 적용 중</span>
          <span className="opacity-60 hidden sm:inline">·</span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
            남은 시간{' '}
            <span className="ddpage-num font-bold text-white">
              {countdown.d}일 {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </span>
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-md bg-[rgba(255,245,238,0.85)] border-b border-[rgba(15,22,30,0.06)]">
        <div className="max-w-[1280px] mx-auto px-6 h-[68px] flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 no-underline">
            <span className="w-9 h-9 rounded-[12px] bg-[#012620] grid place-items-center text-[#00f5dc]">
              <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <span className="font-bold ddpage-tighter text-[20px]">랭킹메이커</span>
          </a>
          <nav className="hidden md:flex items-center gap-1 text-[15px]">
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} className="px-3 py-2 rounded-[8px] hover:bg-black/5 no-underline">{label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="#pricing" className="ddpage-btn ddpage-btn-md ddpage-btn-primary hidden sm:inline-flex">
              지금 시작하기
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="메뉴 열기"
              className="grid h-10 w-10 place-items-center rounded-[12px] border border-[rgba(15,22,30,0.12)] text-[#012620] md:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col gap-7 bg-[#fff5ee] px-6 pb-8 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-[12px] bg-[#012620] grid place-items-center text-[#00f5dc]">
                  <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <span className="font-bold ddpage-tighter text-[20px]">랭킹메이커</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="메뉴 닫기"
                className="grid h-10 w-10 place-items-center rounded-full text-[#012620] hover:bg-black/5"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-[12px] px-4 py-3.5 text-[18px] font-bold text-[#0f161e] no-underline hover:bg-black/5"
                >
                  {label}
                </a>
              ))}
            </nav>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="ddpage-btn ddpage-btn-lg ddpage-btn-primary mt-auto justify-center"
            >
              지금 시작하기 (50% 할인)
              <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </aside>
        </div>
      )}

      {/* ============================================================
          2. HERO
      ============================================================ */}
      <section className="relative overflow-hidden bg-[#012620] text-white">
        <div className="ddpage-blob" style={{ width: 720, height: 720, top: -220, right: -180 }} />
        <div className="ddpage-blob" style={{ width: 520, height: 520, bottom: -260, left: -160, opacity: 0.35 }} />

        <div className="relative max-w-[1280px] mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">

            {/* Left: Copy */}
            <div className="ddpage-fade-up">
              <div className="flex flex-wrap items-center gap-2 mb-7">
                <span className="ddpage-pill ddpage-pill-teal">
                  <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                  1인 사업자 · 프리랜서 · 부업 시작자
                </span>
                <span className="ddpage-pill ddpage-pill-on-dark">
                  5기 모집 · 한정 200명
                </span>
              </div>

              <h1 className="ddpage-tighter font-extrabold text-white text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.02] break-keep">
                광고비 <span className="ddpage-marker-lime text-white">0원</span>,<br />
                검색 1페이지에<br />
                노출되는 방법.<br />
                <span className="text-[#00f5dc]">30일이면 충분합니다.</span>
              </h1>

              <p className="mt-7 text-[19px] leading-[1.55] text-white/80 max-w-[560px] break-keep">
                누적 1,247명이 검증한 SEO 실행 방법론. 유튜브 없이, 인스타 없이, 광고비 한 푼 없이{' '}
                <strong className="text-white">검색에서 손님이 먼저 찾아오는 구조</strong>를 만듭니다.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#pricing" className="ddpage-btn ddpage-btn-xl ddpage-btn-teal">
                  지금 시작하기 (50% 할인)
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a href="#curriculum" className="ddpage-btn ddpage-btn-xl ddpage-btn-ghost-dark">
                  <Play className="w-4 h-4" strokeWidth={1.5} />
                  커리큘럼 먼저 보기
                </a>
              </div>

              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-white/80">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00f5dc]" strokeWidth={1.5} />평생 소장</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00f5dc]" strokeWidth={1.5} />30일 환불 보장</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00f5dc]" strokeWidth={1.5} />카드 · 계좌이체 · 카카오페이</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#00f5dc]" strokeWidth={1.5} />12개월 무이자 할부</li>
              </ul>

              <div className="mt-9 pt-7 border-t border-white/10 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    <span className="w-9 h-9 rounded-full border-2 border-[#012620] bg-[#fde8ce]" />
                    <span className="w-9 h-9 rounded-full border-2 border-[#012620] bg-[#ffdcbf] -ml-2" />
                    <span className="w-9 h-9 rounded-full border-2 border-[#012620] bg-[#bee9f4] -ml-2" />
                    <span className="w-9 h-9 rounded-full border-2 border-[#012620] bg-[#7edcaf] -ml-2" />
                    <span className="w-9 h-9 rounded-full border-2 border-[#012620] bg-[#00f5dc] -ml-2 grid place-items-center text-[11px] font-bold text-[#012620] ddpage-num">+1.2K</span>
                  </div>
                  <div className="text-[14px]">
                    <div className="font-bold text-white ddpage-num">1,247명</div>
                    <div className="text-white/60">이미 수강 중</div>
                  </div>
                </div>
                <div className="text-[14px]">
                  <div className="flex items-center gap-1 mb-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4" style={{ fill: '#d5ff4d', color: '#d5ff4d' }} strokeWidth={1.5} />
                    ))}
                    <span className="ddpage-num font-bold text-white ml-1">4.9</span>
                  </div>
                  <div className="text-white/60">수강 후기 <span className="ddpage-num">312</span>개</div>
                </div>
              </div>
            </div>

            {/* Right: Video card */}
            <div className="ddpage-fade-up" style={{ animationDelay: '120ms' }}>
              <div className="relative">
                <div className="relative rounded-[20px] overflow-hidden ddpage-glass-edge bg-[#004038]" style={{ aspectRatio: '16 / 10' }}>
                  <div className="absolute inset-0" style={{
                    background:
                      'radial-gradient(circle at 70% 20%, rgba(0,245,220,0.25), transparent 50%),' +
                      'radial-gradient(circle at 20% 80%, rgba(213,255,77,0.18), transparent 50%),' +
                      'linear-gradient(135deg, #013832 0%, #012620 100%)',
                  }} />

                  <div className="absolute left-6 right-6 bottom-6 top-20 rounded-[14px] bg-white/[0.04] border border-white/10 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[13px] text-white/60 font-semibold">검색 순위 추이 · 30일</span>
                      <span className="ddpage-pill ddpage-pill-teal" style={{ padding: '4px 10px', fontSize: 12 }}>▲ 4.8x</span>
                    </div>
                    <svg viewBox="0 0 320 110" className="w-full h-auto">
                      <defs>
                        <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                          <stop offset="0%" stopColor="#00f5dc" />
                          <stop offset="100%" stopColor="#d5ff4d" />
                        </linearGradient>
                        <linearGradient id="fillGrad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#00f5dc" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#00f5dc" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,95 L40,92 L80,85 L120,78 L160,60 L200,42 L240,28 L280,18 L320,10 L320,110 L0,110 Z" fill="url(#fillGrad)" />
                      <path d="M0,95 L40,92 L80,85 L120,78 L160,60 L200,42 L240,28 L280,18 L320,10" fill="none" stroke="url(#lineGrad)" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="320" cy="10" r="5" fill="#d5ff4d" />
                      <circle cx="320" cy="10" r="9" fill="#d5ff4d" opacity="0.25" />
                    </svg>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-[12px]">
                      <div>
                        <div className="text-white/50">노출수</div>
                        <div className="text-white font-bold ddpage-num">12,847</div>
                      </div>
                      <div>
                        <div className="text-white/50">유입</div>
                        <div className="text-white font-bold ddpage-num">2,341</div>
                      </div>
                      <div>
                        <div className="text-white/50">전환 매출</div>
                        <div className="text-[#00f5dc] font-bold ddpage-num">+₩1.2M</div>
                      </div>
                    </div>
                  </div>

                  <button className="absolute inset-0 grid place-items-center group" aria-label="강의 미리보기">
                    <span className="w-20 h-20 rounded-full bg-white grid place-items-center transition-transform group-hover:scale-105">
                      <Play className="w-7 h-7 translate-x-[2px]" style={{ fill: '#012620', color: '#012620' }} strokeWidth={1.5} />
                    </span>
                  </button>

                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="ddpage-pill" style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.2)', color: '#fff', backdropFilter: 'blur(8px)', fontSize: 12 }}>
                      <PlayCircle className="w-3.5 h-3.5 text-[#00f5dc]" strokeWidth={1.5} />
                      3분 미리보기
                    </span>
                  </div>
                </div>

                <div className="hidden lg:block absolute -left-10 top-10 rounded-[16px] bg-white text-[#0f161e] p-4 w-[200px]" style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.04)' }}>
                  <div className="text-[12px] text-[#333942] mb-1">평균 노출 증가</div>
                  <div className="ddpage-num font-extrabold text-[28px] ddpage-tighter leading-none">4.8<span className="text-[16px] font-bold">x</span></div>
                  <div className="text-[11px] text-[#333942] mt-1">수강 30일 기준</div>
                </div>
                <div className="hidden lg:block absolute -right-8 bottom-12 rounded-[16px] bg-[#d5ff4d] text-[#012620] p-4 w-[210px]">
                  <div className="text-[12px] font-bold mb-1 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                    월 매출 추가
                  </div>
                  <div className="ddpage-num font-extrabold text-[26px] ddpage-tighter leading-none">+₩1,180,000</div>
                  <div className="text-[11px] mt-1 opacity-80">3기 수강생 김지원님</div>
                </div>

                {/* Mobile inline stats (lg 이상에선 floating 카드가 대체) */}
                <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
                  <div className="rounded-[16px] bg-white text-[#0f161e] p-4">
                    <div className="text-[11px] text-[#333942] mb-1 break-keep">평균 노출 증가</div>
                    <div className="ddpage-num font-extrabold text-[24px] ddpage-tighter leading-none">4.8<span className="text-[14px] font-bold">x</span></div>
                    <div className="text-[10px] text-[#333942] mt-1 break-keep">수강 30일 기준</div>
                  </div>
                  <div className="rounded-[16px] bg-[#d5ff4d] text-[#012620] p-4">
                    <div className="text-[11px] font-bold mb-1 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" strokeWidth={1.5} />
                      월 매출 추가
                    </div>
                    <div className="ddpage-num font-extrabold text-[22px] ddpage-tighter leading-none">+₩1,180,000</div>
                    <div className="text-[10px] mt-1 opacity-80 break-keep">3기 수강생 김지원님</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-6 py-7 flex flex-wrap items-center justify-between gap-6">
            <span className="text-[13px] uppercase tracking-[0.18em] text-white/45 font-bold">수강생 소속</span>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-3 text-white/55 text-[15px] font-semibold">
              <span>네이버 스마트스토어</span>
              <span>쿠팡 파트너스</span>
              <span>크몽 전문가</span>
              <span>인프런 지식공유자</span>
              <span>1인 출판사</span>
              <span>네일샵 · 미용실</span>
              <span>요가 · 필라테스</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3. PAIN POINTS
      ============================================================ */}
      <section id="why" className="py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-[760px] mb-14">
            <span className="ddpage-pill ddpage-pill-peach">
              <AlertCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
              이런 분이 보고 있어요
            </span>
            <h2 className="mt-5 ddpage-tighter text-[40px] sm:text-[52px] font-extrabold leading-[1.06] break-keep">
              혹시,<br />
              <span className="text-[#333942]">이런 경험 있으세요?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { Icon: X, h: <>광고비 <span className="ddpage-num">30만원</span> 썼는데<br />매출은 그대로</>, p: '블로그 체험단, 인스타 광고, 키워드 광고… 매달 광고비만 빠져나가고 한 달이 지나도 ROAS는 100% 아래.' },
              { Icon: FileX, h: <>블로그 글 <span className="ddpage-num">100개</span> 썼는데<br />검색에 안 나옵니다</>, p: '꾸준히 쓰면 된다길래 매일 새벽에 1시간씩 썼는데, 정작 내 글은 검색해도 어디에도 안 보여요.' },
              { Icon: SearchX, h: <>경쟁사는 잘 되는데<br />나만 안 됩니다</>, p: '같은 키워드인데 비슷한 콘텐츠인 경쟁사는 1페이지, 내 글은 5페이지. 도대체 뭐가 다른 건지 모르겠어요.' },
              { Icon: CircleHelp, h: <>유튜브 SEO 강의 다 봤는데<br />여전히 막막합니다</>, p: '이론은 다 알겠는데, 내 사업에 어디서부터 적용해야 할지 가닥이 잡히지 않아요. 결국 다시 광고.' },
              { Icon: ClockAlert, h: <>시간은 없고<br />해야 할 건 많고</>, p: "본업 끝나고 콘텐츠까지 만들기엔 체력이 안 남아요. '뭘 먼저 해야 하는지'만 알면 좋겠는데." },
            ].map((it, i) => (
              <div key={i} className="rounded-[16px] bg-white p-7 flex flex-col gap-4">
                <span className="w-11 h-11 rounded-[12px] grid place-items-center" style={{ background: '#fce6e1', color: '#c8351c' }}>
                  <it.Icon className="w-6 h-6" strokeWidth={1.5} />
                </span>
                <h3 className="text-[22px] font-bold leading-[1.25] break-keep">{it.h}</h3>
                <p className="text-[16px] text-[#333942] leading-[1.55] break-keep">{it.p}</p>
              </div>
            ))}

            <div className="rounded-[16px] p-7 flex flex-col gap-4 text-white" style={{ background: '#012620' }}>
              <span className="w-11 h-11 rounded-[12px] grid place-items-center" style={{ background: '#00f5dc', color: '#012620' }}>
                <HeartHandshake className="w-6 h-6" strokeWidth={1.5} />
              </span>
              <h3 className="text-[22px] font-bold leading-[1.25] text-white break-keep">다 겪어봤습니다.<br />그래서 만들었어요.</h3>
              <p className="text-[16px] text-white/75 leading-[1.55] break-keep">
                저도 광고비 월 200만원을 태우다 손 털었습니다.
                그 뒤로 5년간 30개 사업체에 적용해 검증한 방법론을 정리했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. SOLUTION INTRO
      ============================================================ */}
      <section className="py-24 lg:py-32 bg-[#fde8ce]">
        <div className="max-w-[1080px] mx-auto px-6 text-center">
          <span className="ddpage-pill" style={{ background: '#fff' }}>
            <span className="w-2 h-2 rounded-full bg-[#004038]" />
            이게 답입니다
          </span>
          <h2 className="mt-6 ddpage-tighter text-[44px] sm:text-[64px] font-extrabold leading-[1.04] break-keep">
            이제 더 이상<br />
            <span className="ddpage-marker">시간 낭비</span>하지 마세요.
          </h2>

          <p className="ddpage-serif italic text-[24px] sm:text-[28px] leading-[1.5] text-[#333942] max-w-[760px] mx-auto mt-10 break-keep">
            "랭킹메이커는, 검증된 SEO 방법론을{' '}
            <strong className="not-italic font-bold text-[#0f161e]">30일 안에</strong>{' '}
            당신 사업에 적용해보는 실행 코스입니다."
          </p>

          <div className="mt-14 grid sm:grid-cols-3 gap-4 text-left">
            {[
              { Icon: BadgeCheck, n: '01', t: '검증된 방법론', p: '30개 사업체에 적용해 평균 노출 4.8배 증가시킨 동일 프레임워크.' },
              { Icon: InfinityIcon, n: '02', t: '평생 소장', p: '한 번 결제로 평생 수강. 알고리즘이 바뀔 때마다 무료 업데이트.' },
              { Icon: MessageCircle, n: '03', t: '실시간 코칭', p: '매주 화요일 1:1 라이브 Q&A. 내 사업 키워드를 직접 들고 오세요.' },
            ].map((it, i) => (
              <div key={i} className="rounded-[16px] bg-white p-7">
                <span className="w-11 h-11 rounded-[12px] grid place-items-center bg-[#012620] text-[#00f5dc]">
                  <it.Icon className="w-6 h-6" strokeWidth={1.5} />
                </span>
                <div className="mt-4 text-[13px] uppercase tracking-[0.12em] font-bold text-[#333942]">{it.n}</div>
                <h3 className="mt-1 text-[22px] font-bold">{it.t}</h3>
                <p className="text-[16px] text-[#333942] mt-2 leading-[1.55] break-keep">{it.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. BEFORE / AFTER
      ============================================================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-[820px] mb-14">
            <span className="ddpage-pill ddpage-pill-lime">
              <ArrowRightLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
              Before · After
            </span>
            <h2 className="mt-5 ddpage-tighter text-[40px] sm:text-[56px] font-extrabold leading-[1.06] break-keep">
              수강 전 vs 수강 후,<br />
              <span className="text-[#333942]">실제로 무엇이 달라지나요?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
            <div className="rounded-[20px] bg-white border border-[rgba(15,22,30,0.08)] p-8">
              <div className="flex items-center gap-3 mb-7">
                <span className="ddpage-pill" style={{ background: '#f4eee7', borderColor: 'transparent', color: '#7a5a52' }}>BEFORE</span>
                <span className="text-[14px] text-[#333942]">수강 전 1인 사업자</span>
              </div>
              <ul className="space-y-4">
                {[
                  <>매달 광고비 <span className="ddpage-num">30~80만원</span> 지출, 의존도 100%</>,
                  <>유기적 검색 유입 <span className="ddpage-num">월 100명</span> 미만</>,
                  <>키워드도, 글감도, 우선순위도 막막함</>,
                  <>검색 노출 순위가 안 잡혀 들쭉날쭉</>,
                  <>'블로그 100개 쓰면 된다'는 막연한 조언만</>,
                  <>잘 되는 경쟁사를 보면 부럽고 막막</>,
                  <>광고가 끊기면 매출도 끊기는 구조</>,
                ].map((t, i) => (
                  <li key={i} className="ddpage-before-item flex gap-3 items-start">
                    <span className="ddpage-before-ico shrink-0 w-7 h-7 rounded-full grid place-items-center mt-0.5">
                      <X className="w-4 h-4" strokeWidth={1.5} />
                    </span>
                    <span className="text-[17px] break-keep">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <span className="w-14 h-14 rounded-full grid place-items-center text-[#012620] ddpage-gradient-bar">
                <ArrowRight className="w-7 h-7" strokeWidth={2} />
              </span>
            </div>

            <div className="rounded-[20px] p-8 text-white relative overflow-hidden" style={{ background: '#012620' }}>
              <div className="ddpage-blob" style={{ width: 380, height: 380, top: -160, right: -120, opacity: 0.35 }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-7">
                  <span className="ddpage-pill ddpage-pill-teal">AFTER</span>
                  <span className="text-[14px] text-white/70">수강 30일 후</span>
                </div>
                <ul className="space-y-4">
                  {[
                    <>광고비 <span className="ddpage-num text-[#d5ff4d] font-bold">80% 절감</span>, 유기적 유입 중심으로 전환</>,
                    <>검색 유입 <span className="ddpage-num text-[#d5ff4d] font-bold">월 2,300명+</span> (평균 4.8배 증가)</>,
                    <>키워드 → 글감 → 발행, 3단계 자동화 루틴</>,
                    <>주요 키워드 검색 1페이지 안정 노출</>,
                    <>월 평균 <span className="ddpage-num text-[#d5ff4d] font-bold">100만원+</span> 추가 매출</>,
                    <>콘텐츠 1개에 들이는 시간 <span className="ddpage-num">3시간 → 45분</span></>,
                    <>광고를 끊어도 매출이 유지되는 자산형 구조</>,
                  ].map((t, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="shrink-0 w-7 h-7 rounded-full grid place-items-center mt-0.5 bg-[#00f5dc] text-[#012620]">
                        <Check className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                      <span className="text-[17px] break-keep">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center text-[14px] text-[#333942] mt-6 break-keep">
            ※ 30개 사업체 표본 기준 평균 수치. 개인 결과는 적용 여부 · 기존 자산에 따라 다를 수 있습니다.
          </p>
        </div>
      </section>

      {/* ============================================================
          6. INSTRUCTOR
      ============================================================ */}
      <section className="py-24 lg:py-32 bg-[#ffdcbf]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[24px] overflow-hidden bg-[#012620] relative" style={{ background: 'linear-gradient(135deg, #022e26 0%, #013832 60%, #014c42 100%)' }}>
                <svg viewBox="0 0 400 500" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <linearGradient id="bg1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#02463c" />
                      <stop offset="100%" stopColor="#012620" />
                    </linearGradient>
                    <radialGradient id="lume" cx="50%" cy="35%" r="55%">
                      <stop offset="0%" stopColor="#00f5dc" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#00f5dc" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <rect width="400" height="500" fill="url(#bg1)" />
                  <ellipse cx="200" cy="180" rx="200" ry="140" fill="url(#lume)" />
                  <path d="M200 180 c -38 0 -65 30 -65 70 c 0 24 12 44 28 56 c -42 14 -75 50 -82 96 c -2 12 -2 36 -2 98 l 242 0 c 0 -62 0 -86 -2 -98 c -7 -46 -40 -82 -82 -96 c 16 -12 28 -32 28 -56 c 0 -40 -27 -70 -65 -70 z" fill="#0a0a0a" opacity="0.7" />
                </svg>
                <span className="absolute top-5 left-5 ddpage-pill ddpage-pill-teal">
                  <User className="w-3.5 h-3.5" strokeWidth={1.5} />
                  강사
                </span>
                <span className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="block text-[12px] uppercase tracking-[0.15em] opacity-60 mb-1">사진 자리</span>
                  <span className="block text-[13px] opacity-70 leading-[1.45]">실제 강사 인물 사진이 들어갈 영역입니다.</span>
                </span>
              </div>

              <div className="absolute -bottom-6 -right-4 rounded-[16px] bg-white p-5 w-[200px]">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4" style={{ fill: '#d5ff4d', color: '#d5ff4d' }} strokeWidth={1.5} />
                  ))}
                </div>
                <div className="ddpage-num text-[24px] font-extrabold ddpage-tighter leading-none">강의 만족도 4.9</div>
                <div className="text-[12px] text-[#333942] mt-1">312개 후기 기준</div>
              </div>
            </div>

            <div>
              <span className="ddpage-pill" style={{ background: '#fff' }}>소개</span>
              <h2 className="mt-5 ddpage-tighter text-[40px] sm:text-[56px] font-extrabold leading-[1.04] break-keep">
                누구한테 배우는 거죠?
              </h2>
              <div className="mt-7 flex items-baseline gap-3">
                <span className="text-[36px] font-extrabold ddpage-tighter">김SEO</span>
                <span className="text-[18px] text-[#333942]">· 1인 사업자 SEO 전문가</span>
              </div>

              <div className="mt-6 space-y-4 text-[18px] leading-[1.65] text-[#0f161e] max-w-[640px] break-keep">
                <p>2018년, 광고비 월 200만원을 태우다 사업을 접을 뻔했습니다. 남은 돈으로 도메인 하나 사서 '광고 없이 검색만으로 손님이 오게' 만든 게 시작이었어요.</p>
                <p>그 뒤 5년간 네일샵·필라테스 스튜디오·1인 출판사·작은 PB 브랜드 등 <strong>30개 사업체에 같은 프레임워크를 적용</strong>해 검증했습니다. 평균 검색 노출 4.8배, 광고비 80% 절감이 나왔습니다.</p>
                <p>대단한 비법이 아닙니다. <span className="ddpage-marker font-bold">'당연한 것들을 빠짐없이, 순서대로'</span> 하는 게 전부예요. 그 순서를 30일짜리 코스로 정리했습니다.</p>
              </div>

              <div className="mt-9 grid sm:grid-cols-2 gap-3">
                {[
                  { Icon: GraduationCap, t: '연세대학교 경영학과 졸업' },
                  { Icon: Briefcase, t: '前 카카오 그로스 마케팅 5년' },
                  { Icon: Users, t: <>누적 수강생 <span className="ddpage-num">1,247명</span></> },
                  { Icon: PlayCircle, t: <>유튜브 '김SEO랩' <span className="ddpage-num">3.2만</span> 구독자</> },
                  { Icon: Award, t: '중소기업청 1인 창업 멘토' },
                  { Icon: PenTool, t: '『검색이 돈이 되는 글쓰기』 저자' },
                ].map((it, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-3.5">
                    <it.Icon className="w-5 h-5 text-[#004038]" strokeWidth={1.5} />
                    <span className="text-[15px] font-semibold break-keep">{it.t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. CORE BENEFITS
      ============================================================ */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-[760px] mb-14">
            <span className="ddpage-pill ddpage-pill-teal">
              <Target className="w-3.5 h-3.5" strokeWidth={1.5} />
              핵심 결과
            </span>
            <h2 className="mt-5 ddpage-tighter text-[40px] sm:text-[56px] font-extrabold leading-[1.06] break-keep">
              이 코스가 끝났을 때,<br />
              당신이 <span className="ddpage-marker-lime">실제로 가질 수 있는 것</span>
            </h2>
            <p className="text-[18px] text-[#333942] mt-4 max-w-[620px] break-keep">
              '강의 시간 10시간'이 아닙니다. 30일 뒤 당신 사업에 남는 결과로 적었습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { Icon: Search, bg: '#bee9f4', h: <>7일 안에<br />내 키워드 지도 완성</>, p: '내 사업에 정확히 맞는 핵심 키워드 30개, 우선순위가 매겨진 상태로. 글감 고민이 사라집니다.' },
              { Icon: FileText, bg: '#fde8ce', h: <>검색 1페이지로<br />가는 글 템플릿</>, p: '제목 · 본문 · 메타 · 이미지 alt까지 표준화된 작성 템플릿. 글당 작성 시간 3시간 → 45분으로 단축.' },
              { Icon: TrendingUp, bg: '#ffdcbf', h: <>월 100만원+<br />유기적 매출 자산화</>, p: '광고를 끄는 순간 매출이 끊기는 구조에서 벗어납니다. 한 번 만든 글이 1년간 손님을 데려와요.' },
              { Icon: Repeat, bg: '#00f5dc', h: <>매주 굴러가는<br />콘텐츠 발행 루틴</>, p: '월요일 키워드, 화요일 작성, 수요일 발행, 목요일 분석. 본업이 있어도 무리 없는 주간 사이클을 잡습니다.' },
              { Icon: BarChart3, bg: '#d5ff4d', h: <>숫자로 보는<br />주간 성과 대시보드</>, p: '노출 · 유입 · 전환을 한 페이지로. 무엇을 더 하고, 무엇을 멈춰야 할지 매주 명확하게 판단됩니다.' },
              { Icon: ShieldCheck, bg: '#7edcaf', h: <>알고리즘 변화에<br />흔들리지 않는 원칙</>, p: "어제 통하던 꼼수가 오늘 막혀도 멀쩡한, '검색의 근본'에 기반한 의사결정 기준을 익힙니다." },
            ].map((it, i) => (
              <div key={i} className="rounded-[16px] bg-white p-8">
                <span className="w-12 h-12 rounded-[12px] grid place-items-center text-[#012620]" style={{ background: it.bg }}>
                  <it.Icon className="w-6 h-6" strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-[24px] font-bold leading-[1.2] break-keep">{it.h}</h3>
                <p className="mt-3 text-[16px] text-[#333942] leading-[1.6] break-keep">{it.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          8. TESTIMONIALS
      ============================================================ */}
      <section id="reviews" className="py-24 lg:py-32 bg-[#bee9f4]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
            <div className="max-w-[680px]">
              <span className="ddpage-pill" style={{ background: '#fff' }}>
                <Quote className="w-3.5 h-3.5" strokeWidth={1.5} />
                실제 후기
              </span>
              <h2 className="mt-5 ddpage-tighter text-[40px] sm:text-[56px] font-extrabold leading-[1.06] break-keep">
                숫자가 바뀐<br />
                <span className="text-[#333942]">실제 수강생들의 결과</span>
              </h2>
            </div>
            <div className="flex items-center gap-5">
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5" style={{ fill: '#012620', color: '#012620' }} strokeWidth={1.5} />
                  ))}
                  <span className="ml-2 ddpage-num font-extrabold text-[28px] ddpage-tighter">4.9</span>
                  <span className="text-[15px] text-[#333942]">/ 5</span>
                </div>
                <div className="text-[14px] text-[#333942] mt-1 ddpage-num">312개 후기 기준</div>
              </div>
            </div>
          </div>

          {/* Featured serif quote */}
          <div className="rounded-[20px] bg-white p-8 sm:p-12 mb-5">
            <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-center">
              <div>
                <Quote className="w-8 h-8 text-[#004038] mb-4" strokeWidth={1.5} />
                <p className="ddpage-serif italic text-[24px] sm:text-[30px] leading-[1.45] text-[#0f161e] break-keep">
                  "광고비 월 60만원을 0원으로 줄이고도 매출이 오히려 늘었습니다.
                  한 달 전엔 상상도 못 한 일이었어요.{' '}
                  <strong className="not-italic font-bold">'키워드 → 글 → 분석'</strong>이 머릿속에 박힌 게 가장 큽니다."
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="w-12 h-12 rounded-full bg-[#ffdcbf] grid place-items-center font-bold text-[#012620]">박</span>
                  <div>
                    <div className="font-bold text-[17px]">박서연 님</div>
                    <div className="text-[14px] text-[#333942]">필라테스 스튜디오 운영 · 2기 수강생</div>
                  </div>
                </div>
              </div>
              <div className="rounded-[16px] bg-[#fde8ce] p-6 lg:w-[260px]">
                <div className="text-[13px] font-bold text-[#333942] uppercase tracking-[0.1em]">결과</div>
                <div className="ddpage-num text-[40px] font-extrabold ddpage-tighter leading-none mt-2">+₩820,000</div>
                <div className="text-[14px] text-[#333942] mt-2 break-keep">수강 30일 후 월 매출 증가분</div>
                <div className="ddpage-hairline my-4" />
                <div className="grid grid-cols-2 gap-2 text-[13px]">
                  <div>
                    <div className="text-[#333942]">광고비</div>
                    <div className="font-bold ddpage-num">↓ 100%</div>
                  </div>
                  <div>
                    <div className="text-[#333942]">유입</div>
                    <div className="font-bold ddpage-num">↑ 5.2x</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <ReviewCard initial="김" bgInitial="#fde8ce" name="김지원 님" role="홈데코 스마트스토어 · 3기" badgeText="매출 +₩1.2M" badgeClass="ddpage-pill-teal" body={'"스마트스토어 노출이 5페이지 → 1페이지로 올라왔습니다. 상품 상세 키워드를 어떻게 잡아야 하는지 강의 3주차에 완전히 이해됐어요."'} />
            <ReviewCard initial="이" bgInitial="#ffdcbf" name="이수민 님" role="동네 네일샵 운영 · 4기" badgeText="광고비 -80%" badgeClass="ddpage-pill-lime" body={'"월 80만원 쓰던 광고를 16만원으로 줄였어요. 그런데 신규 손님은 더 늘었습니다. 블로그 12개 글이 일을 해주는 느낌이에요."'} />
            <ReviewCard initial="정" bgInitial="#7edcaf" name="정민호 님" role="크몽 디자인 전문가 · 2기" badgeText="유입 5.2x" badgeClass="" body={'"키워드 분석 강의 하나 듣고 6주차에 첫 1페이지를 잡았어요. 단순히 \'많이 쓰자\'가 아닌 명확한 우선순위가 생긴 게 핵심이었습니다."'} />
            <ReviewCard initial="최" bgInitial="#00f5dc" name="최예린 님" role="1인 출판사 대표 · 1기" badgeText="매출 +₩2.4M" badgeClass="ddpage-pill-teal" body={'"1인 출판사로 매출 한계를 느꼈는데, 책 한 권당 검색 유입이 들어오기 시작하니 재고가 자동으로 돌기 시작했습니다. 광고에 더 이상 의존 안 합니다."'} />
            <ReviewCard initial="윤" bgInitial="#bee9f4" name="윤하늘 님" role="PT 트레이너 · 3기" badgeText="1페이지 9개" badgeClass="ddpage-pill-lime" body={'"전공도 아닌 저였는데 4주차쯤부터 글이 검색에 잡히기 시작했어요. 숙제 형식이라 도망갈 수 없는 게 좋았습니다. 화요일 라이브 Q&A가 진짜 명품."'} />
            <ReviewCard initial="한" bgInitial="#d5ff4d" name="한지훈 님" role="직장인 부업 · 4기" badgeText="시간 -75%" badgeClass="" body={'"글 한 편 쓰는 데 3시간 걸리던 게 45분이면 끝납니다. 템플릿이 진짜 알짜. 부업이라 시간이 늘 부족했는데 이제 일주일에 3편씩 발행하고 있어요."'} />
            <ReviewCard initial="조" bgInitial="#ffdcbf" name="조유나 님" role="소규모 카페 운영 · 3기" badgeText="매출 +₩650K" badgeClass="ddpage-pill-teal" body={'"체험단 의존을 끊을 수 있게 됐어요. 30일째에 검색만으로 예약 8건이 들어왔습니다. 광고에 매달리던 마음이 한결 가벼워졌습니다."'} />
            <ReviewCard initial="강" bgInitial="#fde8ce" name="강도연 님" role="요가 강사 · 1기" badgeText="노출 6.3x" badgeClass="ddpage-pill-lime" body={'"이전에 SEO 책 3권을 읽었지만 손이 안 움직였어요. 이 강의는 \'오늘 뭐 할지\'가 매일 명확합니다. 그래서 처음으로 끝까지 갔어요."'} />

            <article className="rounded-[16px] p-7 flex flex-col justify-center text-center gap-3 text-white" style={{ background: '#012620' }}>
              <div className="ddpage-num text-[44px] font-extrabold ddpage-tighter leading-none text-[#00f5dc]">+304</div>
              <div className="text-[18px] font-bold">개의 후기가 더 있어요</div>
              <p className="text-[14px] text-white/70 break-keep">수강생 후기 페이지에서 전체를 확인하실 수 있습니다.</p>
              <a href="#" className="ddpage-btn ddpage-btn-md ddpage-btn-ondark mt-2 mx-auto">
                전체 후기 보기
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* ============================================================
          9. CURRICULUM
      ============================================================ */}
      <section id="curriculum" className="py-24 lg:py-32">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="mb-14 max-w-[680px]">
            <span className="ddpage-pill ddpage-pill-peach">
              <BookOpen className="w-3.5 h-3.5" strokeWidth={1.5} />
              커리큘럼
            </span>
            <h2 className="mt-5 ddpage-tighter text-[40px] sm:text-[56px] font-extrabold leading-[1.06] break-keep">
              어떤 내용이<br />들어있나요?
            </h2>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-[#333942]">
              <span className="flex items-center gap-2"><Layers className="w-4 h-4" strokeWidth={1.5} />총 <strong className="ddpage-num text-[#0f161e]">7개</strong> 모듈</span>
              <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4" strokeWidth={1.5} /><strong className="ddpage-num text-[#0f161e]">48개</strong> 강의</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" strokeWidth={1.5} />총 <strong className="ddpage-num text-[#0f161e]">11시간 20분</strong></span>
              <span className="flex items-center gap-2"><FileText className="w-4 h-4" strokeWidth={1.5} />워크북 <strong className="ddpage-num text-[#0f161e]">120p</strong></span>
            </div>
          </div>

          <div className="space-y-3">
            <CurriculumModule
              num="01"
              title="SEO의 본질 — 알고리즘이 아니라 사용자"
              meta="6강 · 1시간 25분 · 워크북 18p"
              tag={{ text: '무료 미리보기 1강', cls: 'ddpage-pill-teal' }}
              open
              lessons={[
                { title: '1.1 우리가 잘못 알고 있던 SEO 5가지', duration: '12:40', free: true },
                { title: "1.2 검색은 결국 '의도'를 맞추는 게임이다", duration: '14:08' },
                { title: '1.3 네이버 · 구글, 두 검색엔진의 결정적 차이', duration: '18:22' },
                { title: '1.4 알고리즘 변화에 흔들리지 않는 5대 원칙', duration: '15:30' },
                { title: '1.5 [실습] 내 사업 검색 진단표 작성하기', duration: '11:55' },
                { title: "1.6 [실습] '검색 가능한 사업'인지 체크리스트", duration: '12:10' },
              ]}
            />
            <CurriculumModule
              num="02"
              title="키워드 분석 — '돈이 되는 단어'만 골라내기"
              meta="8강 · 2시간 10분 · 워크북 22p"
              tag={{ text: '템플릿 12종 제공', cls: 'ddpage-pill-lime' }}
              lessons={[
                { title: '2.1 키워드의 3가지 종류와 우선순위', duration: '15:20' },
                { title: '2.2 무료 도구만으로 키워드 100개 뽑기', duration: '18:45' },
                { title: '2.3 검색량 vs 경쟁도 — 황금 비율 잡는 법', duration: '16:30' },
                { title: '2.4 경쟁사 키워드 3분 만에 훔쳐오기', duration: '14:10' },
                { title: '2.5 [실습] 내 사업 키워드 30개 지도 만들기', duration: '22:15' },
              ]}
            />
            <CurriculumModule num="03" title="검색 1페이지로 가는 글 작성 템플릿" meta="9강 · 2시간 15분 · 워크북 24p" body="제목 · 본문 · 메타 · 이미지 alt · 내부 링크까지 표준화된 작성 템플릿과 글당 45분 안에 끝내는 작성 루틴을 다룹니다." />
            <CurriculumModule num="04" title="테크니컬 SEO — 한 번만 잡으면 평생 가는 기본기" meta="5강 · 1시간 18분 · 체크리스트 32개 항목" />
            <CurriculumModule num="05" title="발행 후 — 측정 · 개선 · 재활용 루틴" meta="7강 · 1시간 50분 · 대시보드 템플릿 포함" />
            <CurriculumModule num="06" title="업종별 실전 사례 — 스마트스토어 · 동네 가게 · 지식 콘텐츠" meta="8강 · 1시간 32분 · 실제 사례 12건" />
            <CurriculumModule num="07" title="[보너스] AI를 SEO에 제대로 쓰는 법 (2025년 최신)" meta="5강 · 50분" tag={{ text: '정식 출시 후 추가', cls: 'ddpage-pill-lime' }} />
          </div>
        </div>
      </section>

      {/* ============================================================
          10. BONUS
      ============================================================ */}
      <section className="py-24 lg:py-32 bg-[#012620] text-white relative overflow-hidden">
        <div className="ddpage-blob" style={{ width: 600, height: 600, top: -200, right: -150, opacity: 0.4 }} />
        <div className="relative max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="ddpage-pill ddpage-pill-lime">
              <Gift className="w-3.5 h-3.5" strokeWidth={1.5} />
              BONUS
            </span>
            <h2 className="mt-5 ddpage-tighter text-[40px] sm:text-[56px] font-extrabold leading-[1.06] text-white break-keep">
              본 코스만으로도 충분합니다.<br />
              <span className="text-[#00f5dc]">그런데, 이걸 다 드립니다.</span>
            </h2>
            <p className="text-[18px] text-white/70 mt-5 max-w-[640px] mx-auto break-keep">
              혼자서는 못 만들 자료들. 5기 수강생 전원에게 코스에 포함해 드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {[
              { Icon: FileSpreadsheet, iconBg: '#00f5dc', n: '01', value: '₩99,000 상당', t: '키워드 데이터팩 (월간 업데이트)', p: <>업종별 황금 키워드 <span className="ddpage-num">5,000개</span>를 검색량 · 경쟁도와 함께 정리한 엑셀. 매월 1일에 업데이트됩니다.</> },
              { Icon: FileText, iconBg: '#d5ff4d', n: '02', value: '₩149,000 상당', t: <>검색 1페이지 글 템플릿 <span className="ddpage-num">22종</span></>, p: '상품 후기 · 서비스 소개 · 비교 글 · 노하우 글 등 22가지 유형별 노션 템플릿. 빈칸 채우기만 해도 1페이지에 잡힌 글이 나옵니다.' },
              { Icon: MessageSquare, iconBg: '#fde8ce', n: '03', value: '₩249,000 상당', t: '매주 화요일 라이브 Q&A · 30일', p: '내 사업 키워드를 들고 오시면 강사 김SEO가 직접 진단해 드립니다. 5기 동안 매주 화요일 21시, 총 4회.' },
              { Icon: BarChart3, iconBg: '#ffdcbf', n: '04', value: '₩89,000 상당', t: '주간 성과 대시보드 (구글시트)', p: '노출 · 유입 · 전환을 한 페이지로. 입력만 하면 그래프와 의사결정 신호가 자동으로 뜨는 시트.' },
            ].map((it, i) => (
              <div key={i} className="rounded-[20px] p-7 sm:p-8 ddpage-glass-edge" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-[12px] text-[#012620] grid place-items-center" style={{ background: it.iconBg }}>
                      <it.Icon className="w-6 h-6" strokeWidth={1.5} />
                    </span>
                    <span className="ddpage-pill ddpage-pill-lime" style={{ padding: '4px 10px', fontSize: 12 }}>BONUS {it.n}</span>
                  </div>
                  <span className="ddpage-num font-bold text-[14px] text-white/60">{it.value}</span>
                </div>
                <h3 className="text-[24px] font-bold text-white break-keep">{it.t}</h3>
                <p className="text-[16px] text-white/70 mt-3 leading-[1.55] break-keep">{it.p}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[20px] p-7 sm:p-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5" style={{ background: '#00f5dc', color: '#012620' }}>
            <div>
              <div className="text-[14px] uppercase tracking-[0.15em] font-bold opacity-70">총 보너스 가치</div>
              <div className="ddpage-num text-[36px] sm:text-[44px] font-extrabold ddpage-tighter leading-none mt-2">₩586,000</div>
              <div className="text-[15px] mt-2 opacity-80 break-keep">전부 본 코스 가격에 포함되어 있습니다.</div>
            </div>
            <a href="#pricing" className="ddpage-btn ddpage-btn-xl ddpage-btn-primary">
              가격 확인하기
              <ArrowDown className="w-5 h-5" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          11. PRICING
      ============================================================ */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="ddpage-pill ddpage-pill-teal">
              <Wallet className="w-3.5 h-3.5" strokeWidth={1.5} />
              가격
            </span>
            <h2 className="mt-5 ddpage-tighter text-[44px] sm:text-[60px] font-extrabold leading-[1.04] break-keep">
              받는 가치에 비해<br />
              <span className="ddpage-marker">너무 싸다</span>는 후기가 가장 많습니다.
            </h2>
          </div>

          <div className="rounded-[24px] overflow-hidden border border-[rgba(15,22,30,0.08)]" style={{ background: '#012620' }}>
            <div className="grid lg:grid-cols-[1.05fr_1fr]">
              <div className="p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="ddpage-blob" style={{ width: 380, height: 380, top: -160, left: -100, opacity: 0.35 }} />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="ddpage-pill ddpage-pill-lime">5기 얼리버드</span>
                    <span className="ddpage-pill ddpage-pill-on-dark">~11/28 마감</span>
                  </div>
                  <h3 className="mt-6 text-[32px] sm:text-[40px] font-extrabold ddpage-tighter text-white leading-[1.05] break-keep">
                    랭킹메이커<br />마스터 클래스
                  </h3>
                  <p className="mt-3 text-[16px] text-white/70 max-w-[440px] break-keep">
                    본 코스 + 보너스 4종 + 평생 소장 + 환불 보장. 5기에 한해 50% 할인.
                  </p>

                  <div className="mt-10">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="ddpage-strike ddpage-num text-[22px] text-white/60">₩799,000</span>
                      <span className="ddpage-pill ddpage-pill-lime" style={{ padding: '4px 10px', fontSize: 12 }}>50% OFF</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="ddpage-num text-[72px] sm:text-[88px] font-extrabold ddpage-tighter leading-none text-white">₩399,000</span>
                    </div>
                    <div className="ddpage-num text-[16px] text-white/70 mt-3">
                      또는 월 <strong className="text-white">₩33,250</strong> × 12개월 무이자
                    </div>
                  </div>

                  <a href="#" className="ddpage-btn ddpage-btn-xl ddpage-btn-teal mt-9 w-full sm:w-auto">
                    지금 시작하기
                    <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                  </a>

                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/60">
                    <span className="flex items-center gap-2"><CreditCard className="w-4 h-4" strokeWidth={1.5} />카드</span>
                    <span className="flex items-center gap-2"><Building className="w-4 h-4" strokeWidth={1.5} />계좌이체</span>
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-[4px] bg-[#ffe600] grid place-items-center text-[10px] font-bold text-black">K</span>
                      카카오페이
                    </span>
                    <span className="flex items-center gap-2"><Smartphone className="w-4 h-4" strokeWidth={1.5} />네이버페이</span>
                  </div>
                </div>
              </div>

              <div className="p-8 sm:p-12 bg-white text-[#0f161e]">
                <div className="text-[14px] uppercase tracking-[0.15em] font-bold text-[#333942] mb-5">포함된 모든 것</div>
                <ul className="space-y-3.5">
                  {[
                    { t: '본 코스 7개 모듈 · 48강 (11시간 20분)', s: '평생 소장 · 모바일/PC 어디서나' },
                    { t: '키워드 데이터팩 5,000개 (월간 업데이트)', s: '매월 1일 갱신, 평생 제공' },
                    { t: '검색 1페이지 글 템플릿 22종 (노션)', s: '빈칸 채우기 방식' },
                    { t: '매주 화요일 라이브 Q&A · 4회', s: '5기 한정. 강사 직접 진행' },
                    { t: '주간 성과 대시보드 (구글시트)', s: '템플릿 + 사용 가이드' },
                    { t: '수강생 전용 슬랙 커뮤니티', s: '동기 + 선배 기수 함께' },
                    { t: '30일 무조건 환불 보장', s: '이유 묻지 않습니다' },
                  ].map((it, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[#012620] text-[#00f5dc] grid place-items-center mt-0.5">
                        <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </span>
                      <div className="break-keep">
                        <span className="font-bold">{it.t}</span>
                        <div className="text-[14px] text-[#333942]">{it.s}</div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="ddpage-hairline my-6" />
                <div className="flex items-center justify-between text-[14px]">
                  <span className="text-[#333942]">총 가치 합계</span>
                  <span className="ddpage-num font-bold ddpage-strike-dark">₩1,385,000</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[13px] text-[#333942] mt-5 break-keep">
            ※ 5기 종료 후 정가 ₩799,000으로 복귀합니다. 다음 할인 시점은 미정입니다.
          </p>
        </div>
      </section>

      {/* ============================================================
          12. GUARANTEE
      ============================================================ */}
      <section className="pb-24 lg:pb-32">
        <div className="max-w-[1080px] mx-auto px-6">
          <div className="rounded-[24px] p-8 sm:p-12 grid sm:grid-cols-[auto_1fr] gap-8 sm:gap-10 items-center" style={{ background: '#bee9f4' }}>
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[20px] bg-white grid place-items-center shrink-0">
              <ShieldCheck className="w-16 h-16 sm:w-20 sm:h-20 text-[#012620]" strokeWidth={1.5} />
            </div>
            <div>
              <span className="ddpage-pill" style={{ background: '#fff' }}>리스크 0</span>
              <h2 className="mt-3 ddpage-tighter text-[36px] sm:text-[48px] font-extrabold leading-[1.05] break-keep">
                <span className="ddpage-num">30일</span>, 만족하지 않으면<br />
                <span className="text-[#012620]">100% 환불해 드립니다.</span>
              </h2>
              <p className="text-[17px] text-[#0f161e]/85 mt-5 leading-[1.6] max-w-[680px] break-keep">
                이유를 묻지 않습니다. 결제 후 30일 안에 이메일 한 통이면 전액 환불.
                제 강의에 자신 있어서가 아니라, 망설이는 그 시간이 너무 아까워서 만든 정책입니다.
              </p>
              <div className="mt-5 text-[13px] text-[#0f161e]/65 leading-[1.6] break-keep">
                ※ 환불 조건: 결제일 기준 30일 이내, 본 코스 영상 시청률 50% 미만.
                보너스 라이브 Q&A 1회 이상 참여 시 비대상.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          13. FAQ
      ============================================================ */}
      <section id="faq" className="py-24 lg:py-32 bg-[#fde8ce]">
        <div className="max-w-[920px] mx-auto px-6">
          <div className="text-center mb-14">
            <span className="ddpage-pill" style={{ background: '#fff' }}>
              <MessageCircleQuestion className="w-3.5 h-3.5" strokeWidth={1.5} />
              자주 묻는 질문
            </span>
            <h2 className="mt-5 ddpage-tighter text-[40px] sm:text-[56px] font-extrabold leading-[1.06] break-keep">
              결제 전에<br />가장 많이 물어보시는 것들
            </h2>
          </div>

          <div className="space-y-3">
            <Faq n="Q1" q="비전공자인데 따라갈 수 있나요?" open>
              네. 수강생의 <strong className="text-[#0f161e] ddpage-num">68%</strong>가 마케팅·IT 비전공자입니다.
              용어 사전부터 시작해서 매주 '오늘 뭐 할지'가 정해져 있어, 따라하기만 하면 됩니다.
              매주 화요일 라이브 Q&A에서 막히는 부분은 직접 풀어드려요.
            </Faq>
            <Faq n="Q2" q="강의 시간은 얼마나 되나요?">
              본 코스 영상은 <strong className="text-[#0f161e] ddpage-num">11시간 20분</strong> (48강)입니다.
              하지만 30일 동안 매일 30분씩만 시간을 내시면 충분합니다.
              영상은 짧게 끊어 만들었고, 1.25/1.5/2배속 시청을 지원합니다.
            </Faq>
            <Faq n="Q3" q="수강 기간 제한이 있나요?">
              본 코스 영상은 <strong className="text-[#0f161e]">평생 소장</strong>입니다.
              알고리즘 변화에 따른 업데이트도 평생 무료로 제공됩니다.
              단, 라이브 Q&A는 5기 기간(30일) 동안만 진행됩니다.
            </Faq>
            <Faq n="Q4" q="환불은 어떻게 받나요?">
              결제일 기준 30일 이내 <a href="mailto:hello@rankingmaker.kr" className="font-bold underline">hello@rankingmaker.kr</a>로 이메일 한 통이면 끝납니다.
              이유는 묻지 않습니다. 영업일 기준 3일 이내 결제 수단으로 전액 환불됩니다.
            </Faq>
            <Faq n="Q5" q="결제 후 바로 시청 가능한가요?">
              네. 결제 즉시 등록한 이메일로 수강 안내가 발송되고, 바로 시청하실 수 있습니다.
              보너스 자료(키워드 데이터팩, 글 템플릿 등)도 함께 받으십니다.
            </Faq>
            <Faq n="Q6" q="결제 후 추가 비용이 발생하나요?">
              <strong className="text-[#0f161e]">전혀 없습니다.</strong> 강의에서 사용하는 모든 도구는 무료 도구입니다.
              유료 SEO 툴 결제를 요구하지 않습니다.
            </Faq>
            <Faq n="Q7" q="기업/단체 수강 가능한가요?">
              5인 이상 단체 수강은 별도 할인 + 세금계산서 발행이 가능합니다.
              <a href="mailto:b2b@rankingmaker.kr" className="font-bold underline ml-1">b2b@rankingmaker.kr</a>로 인원과 업종을 알려주시면 견적을 보내드립니다.
            </Faq>
            <Faq n="Q8" q="이 강의가 안 맞는 분도 있나요?">
              있습니다. ① <strong>오늘 결제하고 내일 매출이 나길 바라시는 분</strong> — 30일 누적 효과 코스입니다.
              ② <strong>이미 SEO 전문가</strong>인 분 — 1인 사업자 기준 입문~중급 코스입니다.
              ③ <strong>아예 사업/콘텐츠가 없는 분</strong> — 적용할 대상이 있어야 합니다.
            </Faq>
          </div>
        </div>
      </section>

      {/* ============================================================
          14. FINAL CTA — CLOSER
      ============================================================ */}
      <section className="py-24 lg:py-32 bg-[#012620] text-white relative overflow-hidden">
        <div className="ddpage-blob" style={{ width: 700, height: 700, top: -250, left: -200, opacity: 0.4 }} />
        <div className="ddpage-blob" style={{ width: 500, height: 500, bottom: -200, right: -150, opacity: 0.3 }} />
        <div className="relative max-w-[920px] mx-auto px-6 text-center">
          <span className="ddpage-pill ddpage-pill-lime">
            <AlarmClock className="w-3.5 h-3.5" strokeWidth={1.5} />
            마지막 안내
          </span>
          <h2 className="mt-6 ddpage-tighter text-[44px] sm:text-[64px] lg:text-[80px] font-extrabold leading-[0.98] text-white break-keep">
            지금 결정하지 않으면,<br />
            <span className="text-[#00f5dc]">또 1년이 그렇게 갑니다.</span>
          </h2>
          <p className="text-[19px] text-white/75 mt-7 max-w-[640px] mx-auto leading-[1.55] break-keep">
            광고비로 한 달에 30만원씩만 더 쓰셔도 1년이면 360만원입니다.
            그 시간에 검색 자산을 쌓았다면 어땠을까요.
          </p>

          <div className="mt-12 grid sm:grid-cols-2 gap-3 max-w-[720px] mx-auto">
            <div className="rounded-[16px] p-6 ddpage-glass-edge text-left" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 text-[13px] uppercase tracking-[0.15em] font-bold text-[#00f5dc]">
                <AlarmClock className="w-4 h-4" strokeWidth={1.5} />
                5기 마감까지
              </div>
              <div className="ddpage-num text-[40px] sm:text-[48px] font-extrabold ddpage-tighter mt-2 leading-none text-white">
                {countdown.d}일 {pad(countdown.h)}시 {pad(countdown.m)}분
              </div>
              <div className="text-[14px] text-white/60 mt-2">11/28 23:59 마감</div>
            </div>
            <div className="rounded-[16px] p-6 ddpage-glass-edge text-left" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 text-[13px] uppercase tracking-[0.15em] font-bold text-[#d5ff4d]">
                <Users className="w-4 h-4" strokeWidth={1.5} />
                남은 자리
              </div>
              <div className="ddpage-num text-[40px] sm:text-[48px] font-extrabold ddpage-tighter mt-2 leading-none text-white">
                <span className="text-[#d5ff4d]">37</span> <span className="text-white/40 text-[28px] sm:text-[32px]">/ 200</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full ddpage-gradient-bar" style={{ width: '81.5%' }} />
              </div>
            </div>
          </div>

          <a href="#" className="ddpage-btn ddpage-btn-xl ddpage-btn-teal mt-12 w-full sm:w-auto">
            지금 신청하기 (50% 할인)
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
          </a>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] text-white/65">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[#00f5dc]" strokeWidth={1.5} />30일 환불 보장</span>
            <span className="flex items-center gap-1.5"><InfinityIcon className="w-4 h-4 text-[#00f5dc]" strokeWidth={1.5} />평생 소장</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-[#00f5dc]" strokeWidth={1.5} />결제 즉시 시청 가능</span>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
      ============================================================ */}
      <footer className="bg-[#fff5ee] border-t border-[rgba(15,22,30,0.08)]">
        <div className="max-w-[1280px] mx-auto px-6 py-14">
          <div className="grid md:grid-cols-[1.2fr_1fr_1fr_1fr] gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-9 h-9 rounded-[12px] bg-[#012620] grid place-items-center text-[#00f5dc]">
                  <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
                </span>
                <span className="font-bold ddpage-tighter text-[20px]">랭킹메이커</span>
              </div>
              <p className="text-[14px] text-[#333942] leading-[1.6] max-w-[320px] break-keep">
                1인 사업자를 위한 SEO 마스터 클래스.
                광고비 없이 검색에서 손님이 먼저 찾아오는 구조를 만들어 드립니다.
              </p>
            </div>
            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#333942] mb-4">코스</h4>
              <ul className="space-y-2.5 text-[15px]">
                <li><a href="#curriculum" className="no-underline hover:underline">커리큘럼</a></li>
                <li><a href="#reviews" className="no-underline hover:underline">수강 후기</a></li>
                <li><a href="#pricing" className="no-underline hover:underline">가격</a></li>
                <li><a href="#faq" className="no-underline hover:underline">자주 묻는 질문</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#333942] mb-4">문의</h4>
              <ul className="space-y-2.5 text-[15px]">
                <li><a href="mailto:hello@rankingmaker.kr" className="no-underline hover:underline">hello@rankingmaker.kr</a></li>
                <li><a href="mailto:b2b@rankingmaker.kr" className="no-underline hover:underline">기업 단체 수강 · B2B</a></li>
                <li><span className="text-[#333942]">평일 10:00 ~ 18:00</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-[0.12em] text-[#333942] mb-4">정책</h4>
              <ul className="space-y-2.5 text-[15px]">
                <li><a href="#" className="no-underline hover:underline">이용약관</a></li>
                <li><a href="#" className="no-underline hover:underline">개인정보 처리방침</a></li>
                <li><a href="#" className="no-underline hover:underline">환불 정책</a></li>
              </ul>
            </div>
          </div>

          <div className="ddpage-hairline my-10" />

          <div className="flex flex-wrap items-start justify-between gap-6 text-[13px] text-[#333942]">
            <div className="space-y-1 leading-[1.7]">
              <div>(주)랭킹메이커 · 대표 김SEO · 사업자등록번호 123-45-67890</div>
              <div>통신판매업 신고번호 제2024-서울강남-1234호</div>
              <div>서울특별시 강남구 테헤란로 123 · 045-123-4567</div>
            </div>
            <div className="text-right space-y-2">
              <Link href="/portfolio" className="hover:underline">
                ← 다른 포트폴리오 보기
              </Link>
              <p className="text-[12px] text-[#333942]/70 mt-2">
                포트폴리오용 샘플 작업입니다 · © 2025 RankingMaker
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================
          STICKY MOBILE CTA
      ============================================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden p-3 bg-[rgba(255,245,238,0.95)] backdrop-blur-md border-t border-[rgba(15,22,30,0.08)]">
        <a href="#pricing" className="ddpage-btn ddpage-btn-lg ddpage-btn-primary w-full">
          지금 시작하기 (50% 할인)
          <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
        </a>
      </div>
    </main>
  )
}
