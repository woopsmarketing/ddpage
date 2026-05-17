'use client';

/**
 * Flowra — 사용자 여정 자동화 플랫폼
 * 포트폴리오 #03 (상품/서비스 소개형)
 *
 * Contractbook 디자인 시스템 기반:
 *   - Energy Gold (#ffba09) primary CTA
 *   - Royal Blue (#1009f6) statement
 *   - Washed Black (#1a1a1a) text
 *   - Pearl (#f7f7f3) / Beige (#f0f0ec) alternating surfaces
 *   - Radii: 24 (cards) · 40 (images) · 999 (pills)
 */

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRight, Check, ChevronDown,
  Bell, Trophy, BarChart3, Code2, Layers, Boxes,
  Mail, MousePointerClick, MessageSquare,
} from 'lucide-react';

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-[#1a1a1a] font-sans antialiased">
      <Nav />
      <Hero />
      <TabsSection />
      <FeaturesGrid />
      <Connections />
      <UseCases />
      <CTABanner />
      <FAQ />
      <Footer />
    </main>
  );
}

function Logo({ className = '' }: { className?: string }) {
  return (
    <a href="#" className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#1009f6] text-white text-[15px] font-bold whitespace-nowrap"
      >
        F
      </span>
      <span className="text-[18px] font-bold tracking-tight whitespace-nowrap">Flowra</span>
    </a>
  );
}

function Nav() {
  const links = [
    { label: 'Home', href: '#' },
    { label: 'Product', href: '#product' },
    { label: 'How it works', href: '#how' },
    { label: 'Blog', href: '#blog' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#f0f0ec]">
      <div className="mx-auto flex max-w-[1200px] items-center gap-6 px-6 py-3.5 lg:px-8">
        <Logo />
        <nav className="ml-4 hidden md:flex flex-1 items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-[#1a1a1a] hover:text-[#1009f6] transition-colors whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); console.log('Take a tour'); }}
            className="hidden sm:inline-flex items-center rounded-full border border-[#1a1a1a] px-4 py-2 text-sm font-bold hover:bg-[#f0f0ec] transition-colors whitespace-nowrap"
          >
            둘러보기
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); console.log('Book a demo'); }}
            className="inline-flex items-center rounded-full bg-[#ffba09] px-5 py-2.5 text-sm font-bold text-black hover:bg-[#e8a800] active:scale-[0.98] transition whitespace-nowrap"
          >
            데모 신청
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] pt-20 pb-12 lg:pt-28 text-center">
        <h1 className="mx-auto max-w-3xl text-[40px] sm:text-[56px] lg:text-[68px] font-bold leading-[1.05] tracking-[-0.02em]">
          사용자 여정의 모든 순간을
          <br />
          <span className="text-[#1009f6]">자동으로</span> 설계하세요.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-[16px] sm:text-[18px] leading-[1.55] text-[#6d6868]">
          행동 데이터를 분석하고 적시에 메시지를 보내,
          <br className="hidden sm:block" />
          리텐션을 평균 38% 끌어올립니다.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); console.log('Take a tour'); }}
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-[#1a1a1a] px-6 py-3.5 text-sm font-bold hover:bg-[#f0f0ec] transition-colors whitespace-nowrap"
          >
            둘러보기
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); console.log('Book a demo'); }}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full bg-[#ffba09] px-6 py-3.5 text-sm font-bold text-black hover:bg-[#e8a800] active:scale-[0.98] transition whitespace-nowrap"
          >
            데모 신청 <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-14 sm:mt-20">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto max-w-[1080px] rounded-[40px] bg-[#1009f6] p-8 sm:p-14 overflow-hidden">
      <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-[#ffba09]" />
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#e3c7de]/40" />
      <div className="absolute top-10 right-10 h-3 w-3 rounded-full bg-white/60" />

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end">
        <div className="rounded-[24px] bg-white p-5 text-left md:translate-y-6">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1009f6] whitespace-nowrap">
            <Bell className="h-3.5 w-3.5" /> Push 전송
          </div>
          <div className="mt-3 text-[15px] font-bold leading-snug">
            &ldquo;지난주 본 상품, 지금 12% 할인 중이에요&rdquo;
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#6d6868]">
            <span className="h-2 w-2 rounded-full bg-[#304801]" /> <span className="whitespace-nowrap">발송 완료 · 5분 전</span>
          </div>
        </div>

        <div className="mx-auto w-[220px] sm:w-[260px] rounded-[36px] border-[6px] border-black bg-white p-3 shadow-[0_24px_60px_rgba(0,0,0,0.18)]">
          <div className="rounded-[26px] bg-[#f7f7f3] p-4 min-h-[360px] flex flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] text-[#6d6868]">
              <span>9:41</span>
              <span>●●●</span>
            </div>
            <div className="rounded-2xl bg-white p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#1009f6]">새 미션</div>
              <div className="mt-1.5 text-[13px] font-bold">7일 연속 출석 챌린지</div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-[#f0f0ec] overflow-hidden">
                <div className="h-full w-[60%] rounded-full bg-[#ffba09]" />
              </div>
              <div className="mt-2 text-[10px] text-[#6d6868]">5 / 7 일 완료</div>
            </div>
            <div className="rounded-2xl bg-[#ffba09] p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-black">리워드</div>
              <div className="mt-1 text-[13px] font-bold">3,000원 쿠폰 도착!</div>
            </div>
            <div className="mt-auto rounded-2xl bg-white p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#6d6868]">방금 본 상품</div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-[#add3e5]" />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-bold truncate">시그니처 후드</div>
                  <div className="text-[10px] text-[#6d6868]">₩ 64,000 → 56,300</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-5 text-left md:translate-y-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#6d6868]">
            <BarChart3 className="h-3.5 w-3.5" /> 리텐션
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <span className="text-[32px] font-bold leading-none tracking-tight">+38%</span>
            <span className="text-[11px] font-bold text-[#304801] whitespace-nowrap">▲ vs. 전월</span>
          </div>
          <div className="mt-3 flex items-end gap-1 h-12">
            {[40, 55, 48, 62, 70, 58, 78].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-[#1009f6]" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const TAB_DATA = [
  {
    key: 'core',
    label: '핵심 기능',
    kicker: '참여',
    title: '적시에 도착하는 메시지',
    desc: '사용자가 가장 반응할 순간을 자동으로 찾아 알림을 보냅니다.',
    points: [
      '행동 트리거 기반 자동 메시지',
      'A/B 테스트로 카피 자동 최적화',
      '시간대·기기·세그먼트별 발송',
    ],
    visual: 'core',
  },
  {
    key: 'gamify',
    label: '게임화',
    kicker: '리텐션',
    title: '사용자가 다시 돌아오게 만드세요',
    desc: '미션, 배지, 연속 출석으로 습관처럼 쓰는 앱을 만드세요.',
    points: [
      '연속 출석 · 미션 · 배지 시스템',
      '리워드 자동 지급 워크플로',
      '코호트별 게임화 효과 분석',
    ],
    visual: 'gamify',
  },
  {
    key: 'analytics',
    label: '분석',
    kicker: '인사이트',
    title: '숫자로 보는 사용자 행동',
    desc: '퍼널, 코호트, 리텐션을 한 대시보드에서 확인하세요.',
    points: [
      '실시간 퍼널 & 코호트 리포트',
      'SQL 없이 만드는 커스텀 차트',
      'Slack · 이메일로 인사이트 자동 발송',
    ],
    visual: 'analytics',
  },
] as const;

function TabsSection() {
  const [active, setActive] = useState<typeof TAB_DATA[number]['key']>('core');
  const current = TAB_DATA.find((t) => t.key === active) ?? TAB_DATA[0];

  return (
    <section id="product" className="bg-[#f7f7f3] py-20 lg:py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center mb-12 lg:mb-16">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#1009f6]">Platform</div>
          <h2 className="mt-3 text-[32px] sm:text-[44px] font-bold leading-[1.15] tracking-[-0.01em]">
            사용자 여정의 모든 단계에
            <br />필요한 플랫폼
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {TAB_DATA.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors whitespace-nowrap ${
                active === t.key
                  ? 'bg-[#1a1a1a] text-white'
                  : 'bg-white text-[#1a1a1a] border border-[#f0f0ec] hover:bg-[#f0f0ec]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-[24px] bg-white p-6 sm:p-10 lg:p-14 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-wider text-[#1009f6]">
              {current.kicker}
            </div>
            <h3 className="mt-3 text-[28px] sm:text-[34px] font-bold leading-[1.2] tracking-[-0.01em]">
              {current.title}
            </h3>
            <p className="mt-4 text-[15px] leading-[1.6] text-[#6d6868]">{current.desc}</p>
            <ul className="mt-6 space-y-3">
              {current.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#ffba09] whitespace-nowrap">
                    <Check className="h-3 w-3 text-black" strokeWidth={3} />
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <TabVisual kind={current.visual} />
        </div>
      </div>
    </section>
  );
}

function TabVisual({ kind }: { kind: 'core' | 'gamify' | 'analytics' }) {
  if (kind === 'core') {
    return (
      <div className="rounded-[32px] bg-[#add3e5] p-6 sm:p-8 min-h-[360px] flex flex-col gap-3 justify-center">
        {[
          { tag: '09:14', text: '"장바구니에 둔 상품, 곧 품절돼요"', tone: 'gold' },
          { tag: '14:32', text: '"이번 주 추천 코디 도착!"', tone: 'blue' },
          { tag: '20:08', text: '"오늘만 무료 배송이에요"', tone: 'black' },
        ].map((m, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl bg-white p-3 sm:p-4">
            <span className="text-[11px] font-bold text-[#6d6868] w-12 flex-shrink-0">{m.tag}</span>
            <span className="flex-1 text-[13px] sm:text-[14px] font-bold">{m.text}</span>
            <span
              className={`h-2 w-2 flex-shrink-0 rounded-full ${
                m.tone === 'gold' ? 'bg-[#ffba09]' : m.tone === 'blue' ? 'bg-[#1009f6]' : 'bg-[#1a1a1a]'
              }`}
            />
          </div>
        ))}
        <div className="mt-2 rounded-2xl bg-[#1009f6] p-4 text-white">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#ffba09]">자동 발송</div>
          <div className="mt-1 text-[14px]">행동 트리거가 감지되면 1초 안에 도착합니다.</div>
        </div>
      </div>
    );
  }
  if (kind === 'gamify') {
    return (
      <div className="rounded-[32px] bg-[#e3c7de] p-6 sm:p-8 min-h-[360px] flex flex-col gap-4 justify-center">
        <div className="rounded-2xl bg-white p-5">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1009f6]">
            <Trophy className="h-3.5 w-3.5" /> 7일 연속 출석
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <div
                key={d}
                className={`h-9 flex-1 rounded-lg flex items-center justify-center text-[12px] font-bold ${
                  d <= 5
                    ? 'bg-[#ffba09] text-black'
                    : 'bg-[#f0f0ec] text-[#b3b3b3]'
                }`}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="mt-3 text-[12px] text-[#6d6868]">5일 완료 · 2일 남음</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { c: '#ffba09', label: '첫 구매' },
            { c: '#1009f6', label: '리뷰 작성' },
            { c: '#304801', label: '친구 초대' },
          ].map((b, i) => (
            <div key={i} className="rounded-2xl bg-white p-3 text-center">
              <div className="mx-auto h-10 w-10 rounded-full" style={{ background: b.c }} />
              <div className="mt-2 text-[11px] font-bold">{b.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-[32px] bg-[#f0f0ec] p-6 sm:p-8 min-h-[360px] flex flex-col gap-4 justify-center">
      <div className="rounded-2xl bg-white p-5">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#6d6868]">D7 리텐션</div>
          <div className="text-[11px] font-bold text-[#304801]">▲ 38%</div>
        </div>
        <div className="mt-4 flex items-end gap-1.5 h-24">
          {[35, 48, 42, 58, 64, 56, 72, 80, 76, 90, 84, 96].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{ height: `${h}%`, background: i > 8 ? '#1009f6' : '#1a1a1a' }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { k: 'DAU',  v: '12.4K', d: '+8%' },
          { k: '전환', v: '4.2%',  d: '+1.1%p' },
          { k: 'LTV',  v: '₩ 48K', d: '+12%' },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl bg-white p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#6d6868]">{s.k}</div>
            <div className="mt-1 text-[20px] font-bold">{s.v}</div>
            <div className="text-[11px] font-bold text-[#304801]">{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesGrid() {
  const items = [
    {
      icon: <Code2 className="h-5 w-5" />,
      title: 'APIs',
      desc: '가벼운 REST API로 복잡한 연동을 단 몇 줄로 끝내세요.',
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: 'UI SDKs',
      desc: '바로 쓰는 UI 컴포넌트로 빠르게 출시하세요.',
    },
    {
      icon: <Boxes className="h-5 w-5" />,
      title: 'Headless SDKs',
      desc: '브랜드에 맞춘 자유로운 커스터마이징을 제공합니다.',
    },
  ];

  return (
    <section id="how" className="py-20 lg:py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="max-w-2xl">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#1009f6]">Integration</div>
          <h2 className="mt-3 text-[32px] sm:text-[44px] font-bold leading-[1.15] tracking-[-0.01em]">
            빠르고, 직관적인 SDK
          </h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-[#6d6868]">
            API와 SDK를 15분 안에 설치하고, 대시보드에서 의미 있는 데이터를 바로 확인하세요.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((it) => (
            <article
              key={it.title}
              className="rounded-[24px] border border-[#f0f0ec] bg-white p-7 hover:border-[#1a1a1a] transition-colors"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0f0ec] whitespace-nowrap">
                {it.icon}
              </div>
              <h3 className="mt-5 text-[20px] font-bold tracking-[-0.01em]">{it.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-[#6d6868]">{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Connections() {
  const logos = [
    { c: '#1009f6', t: 'Sf' },
    { c: '#1a1a1a', t: 'Hs' },
    { c: '#304801', t: 'Sl' },
    { c: '#ffba09', t: 'Sg' },
    { c: '#add3e5', t: 'Mx' },
    { c: '#e3c7de', t: 'Am' },
    { c: '#6d6868', t: 'Bq' },
    { c: '#1009f6', t: 'Zn' },
  ];

  return (
    <section className="bg-[#f7f7f3] py-20 lg:py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] text-center">
        <div className="text-[12px] font-bold uppercase tracking-wider text-[#1009f6]">Connections</div>
        <h2 className="mt-3 text-[32px] sm:text-[44px] font-bold leading-[1.15] tracking-[-0.01em]">
          자주 쓰는 도구와 연결하세요
        </h2>
        <p className="mt-4 mx-auto max-w-xl text-[16px] leading-[1.6] text-[#6d6868]">
          모든 사용자 데이터를 한 곳에 모아, Flowra에서 흐름을 자동화하세요.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {logos.map((l, i) => (
            <div
              key={i}
              className="h-16 w-16 sm:h-18 sm:w-18 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: l.c,
                color: l.c === '#ffba09' || l.c === '#add3e5' || l.c === '#e3c7de' ? '#1a1a1a' : '#ffffff',
              }}
              aria-label={`Integration ${l.t}`}
            >
              {l.t}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const cases = [
    {
      tag: '온보딩',
      title: '온보딩 친화적 경험',
      desc: '신규 사용자가 첫 7일 안에 핵심 기능을 발견하도록 도와주세요.',
      tint: '#add3e5',
      icon: <MousePointerClick className="h-5 w-5" />,
    },
    {
      tag: '참여 & 전환',
      title: '습관처럼 돌아오는 앱',
      desc: '게임화와 적시 알림으로 리텐션과 구매 전환을 동시에 높이세요.',
      tint: '#ffba09',
      icon: <Bell className="h-5 w-5" />,
    },
    {
      tag: '인사이트 & 피드백',
      title: '데이터로 의사결정',
      desc: '실제 사용자 피드백을 수집하고, 다음 릴리스의 우선순위를 정하세요.',
      tint: '#e3c7de',
      icon: <MessageSquare className="h-5 w-5" />,
    },
  ];

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#1009f6]">Use Cases</div>
          <h2 className="mt-3 text-[32px] sm:text-[44px] font-bold leading-[1.15] tracking-[-0.01em]">
            실제 사례로 살펴보세요
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-[16px] leading-[1.6] text-[#6d6868]">
            빠르게 성장 중인 팀들이 Flowra로 사용자 여정을 어떻게 다듬는지.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {cases.map((c) => (
            <article
              key={c.tag}
              className="rounded-[24px] bg-white border border-[#f0f0ec] overflow-hidden flex flex-col hover:border-[#1a1a1a] transition-colors"
            >
              <div className="aspect-[16/10] flex items-center justify-center" style={{ background: c.tint }}>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white whitespace-nowrap">
                  {c.icon}
                </div>
              </div>
              <div className="p-6 flex flex-col gap-2 flex-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#6d6868]">{c.tag}</div>
                <h3 className="text-[20px] font-bold leading-[1.25] tracking-[-0.01em]">{c.title}</h3>
                <p className="text-[14px] leading-[1.55] text-[#6d6868] flex-1">{c.desc}</p>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); console.log('Learn more', c.tag); }}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#1a1a1a] hover:text-[#1009f6] transition-colors whitespace-nowrap"
                >
                  <span className="whitespace-nowrap">자세히 보기</span> <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner() {
  return (
    <section className="px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-[40px] bg-[#ffba09] px-8 sm:px-14 py-14 sm:py-20 text-center">
          <h2 className="mx-auto max-w-2xl text-[32px] sm:text-[44px] font-bold leading-[1.15] tracking-[-0.01em] text-black">
            잊지 못할 마지막 한 번의 푸시를,
            <br />
            지금 시작하세요.
          </h2>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); console.log('Book a demo'); }}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-full bg-black px-7 py-3.5 text-sm font-bold text-white hover:bg-[#1a1a1a] active:scale-[0.98] transition whitespace-nowrap"
            >
              데모 신청 <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); console.log('Free trial'); }}
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-black px-7 py-3.5 text-sm font-bold text-black hover:bg-black hover:text-white transition-colors whitespace-nowrap"
            >
              무료로 시작하기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  {
    q: '어떤 회사들이 Flowra를 사용하나요?',
    a: '커머스, 핀테크, 헬스케어, 미디어 등 사용자 리텐션이 매출에 직결되는 모든 디지털 제품 팀이 사용합니다. 스타트업부터 대기업까지 규모와 상관없이 적용할 수 있습니다.',
  },
  {
    q: '캠페인을 시작하기까지 얼마나 걸리나요?',
    a: 'SDK 설치 후 평균 15분 안에 첫 캠페인을 시작할 수 있습니다. 기존 데이터 파이프라인이 있다면 더 빠릅니다.',
  },
  {
    q: '기술 지식이 꼭 필요한가요?',
    a: '초기 SDK 설치는 개발자가 필요하지만, 그 이후 캠페인 설계와 발송, 분석은 노코드 대시보드에서 모두 가능합니다.',
  },
  {
    q: '가격은 어떻게 책정되나요?',
    a: '월간 활성 사용자(MAU)와 사용하는 기능 모듈에 따라 결정됩니다. 자세한 견적은 영업팀과 상담해 주세요.',
  },
  {
    q: '연동에는 얼마나 걸리나요?',
    a: '대표 도구(Slack, Amplitude, BigQuery 등)는 클릭 한 번이면 됩니다. 자체 시스템은 평균 1~3일 안에 연결됩니다.',
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 lg:py-28 px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#1009f6]">Support</div>
          <h2 className="mt-3 text-[32px] sm:text-[44px] font-bold leading-[1.15] tracking-[-0.01em]">FAQs</h2>
          <p className="mt-4 text-[15px] leading-[1.6] text-[#6d6868] max-w-sm">
            궁금한 게 남았다면 편하게 연락해 주세요. 영업팀이 24시간 안에 답변드립니다.
          </p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); console.log('Get in touch'); }}
            className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[#1a1a1a] px-5 py-2.5 text-sm font-bold hover:bg-[#f0f0ec] transition-colors whitespace-nowrap"
          >
            <Mail className="h-4 w-4" /> 문의하기
          </a>
        </div>

        <div className="divide-y divide-[#f0f0ec] border-t border-b border-[#f0f0ec]">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] sm:text-[17px] font-bold">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-[#1a1a1a] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ${
                    isOpen ? 'max-h-60 opacity-100 pb-5' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="text-[15px] leading-[1.6] text-[#6d6868] pr-8">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const cols = [
    { title: 'Company',   items: ['소개', '블로그', '채용', '연락처'] },
    { title: 'Use Cases', items: ['온보딩', '참여 & 전환', '인사이트 & 피드백', '수익화'] },
    { title: 'Features',  items: ['게임화', '푸시 & 인앱', '분석', '실험'] },
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(3,1fr)] gap-10">
          <div>
            <Logo className="text-white [&_span:last-child]:text-white" />
            <p className="mt-4 text-[14px] leading-[1.6] text-[#b3b3b3] max-w-xs">
              사용자 여정의 모든 순간을 자동으로 설계하는 플랫폼.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-[12px] font-bold uppercase tracking-wider text-[#ffba09]">{c.title}</div>
              <ul className="mt-4 space-y-2.5">
                {c.items.map((it) => (
                  <li key={it}>
                    <a href="#" className="text-[14px] text-white hover:text-[#ffba09] transition-colors">
                      {it}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-[#b3b3b3]">
          <div>© 2026 Flowra. All rights reserved.</div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">이용약관</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">개인정보 처리방침</a>
            <a href="#" className="hover:text-white transition-colors whitespace-nowrap">쿠키 정책</a>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-[#6d6868]">
          <div>포트폴리오용 샘플 작업입니다.</div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1 text-[#b3b3b3] hover:text-[#ffba09] transition-colors whitespace-nowrap"
          >
            ← 다른 포트폴리오 보기
          </Link>
        </div>
      </div>
    </footer>
  );
}
