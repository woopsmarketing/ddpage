'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  MessageCircle,
  Phone,
  Mail,
  Check,
  Star,
  ArrowRight,
  Plus,
  Calendar,
  Wallet,
  TrendingUp,
  Building2,
  Menu,
  X,
} from 'lucide-react'

const SCOPED_CSS = `
.ddpage-inquiry { word-break: keep-all; }
.ddpage-inquiry * { word-break: keep-all; }

.ddpage-inquiry .ddpage-inquiry-shadow-float {
  box-shadow:
    rgba(0,0,0,0.02) 0 0 0 1px,
    rgba(0,0,0,0.04) 0 2px 6px 0,
    rgba(0,0,0,0.10) 0 4px 8px 0;
}
.ddpage-inquiry .ddpage-inquiry-hover-float { transition: box-shadow .15s ease; }
.ddpage-inquiry .ddpage-inquiry-hover-float:hover {
  box-shadow:
    rgba(0,0,0,0.02) 0 0 0 1px,
    rgba(0,0,0,0.04) 0 2px 6px 0,
    rgba(0,0,0,0.10) 0 4px 8px 0;
}

.ddpage-inquiry .ddpage-inquiry-hero-headline {
  font-size: clamp(38px, 5vw, 56px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -1.2px;
}
.ddpage-inquiry .ddpage-inquiry-stat-num {
  font-size: clamp(40px, 4vw, 56px);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1.2px;
}

.ddpage-inquiry .ddpage-inquiry-field:focus {
  outline: none;
  border-color: #222222;
  border-width: 2px;
}

.ddpage-inquiry details > summary { list-style: none; }
.ddpage-inquiry details > summary::-webkit-details-marker { display: none; }
.ddpage-inquiry details[open] .ddpage-inquiry-faq-icon { transform: rotate(45deg); }
.ddpage-inquiry .ddpage-inquiry-faq-icon { transition: transform .2s ease; }
`

const STATS = [
  { num: '1,247+', label: '누적 상담 건수', caption: '12년간 직접 응대' },
  { num: '12 년', label: '업계 경력', caption: '대형 회계법인 출신' },
  { num: '98%', label: '재의뢰율', caption: '한 번 맡기면 계속' },
  { num: '232 만원', label: '평균 절세액', caption: '1인 사업자 기준' },
]

const CERTS = [
  '한국세무사회 정회원',
  '국세청 등록 N0. 2013-0824',
  '중소벤처기업부 전문가 풀',
  'AICPA 자격',
]

const SERVICES = [
  {
    icon: Calendar,
    title: '종합소득세 신고',
    desc: '5월 종소세, 놓친 공제 없이 깔끔하게 마무리합니다. 카드내역·경비 분류 포함.',
    price: '5',
    unit: '만원~',
  },
  {
    icon: Wallet,
    title: '월 기장 대행',
    desc: '매출·매입·인건비까지 매달 정리해 드립니다. 카톡으로 영수증만 보내주세요.',
    price: '9',
    unit: '만원/월',
  },
  {
    icon: TrendingUp,
    title: '절세 시뮬레이션',
    desc: '법인 전환이 유리한지, 비용 처리 방식을 어떻게 짤지 — 숫자로 보여드립니다.',
    price: '15',
    unit: '만원',
  },
  {
    icon: Building2,
    title: '법인 전환 컨설팅',
    desc: '언제 전환해야 절세에 유리할까. 시점부터 설립·이전 절차까지 한 번에.',
    price: '35',
    unit: '만원~',
  },
]

const DIFFS = [
  {
    no: '01 — 전문성',
    title: '매출 1억 미만, 1인 사업자만 보는 12년',
    body: '간이과세부터 종합소득세, 부가세, 4대 보험까지 — 1인 사업자의 세금 흐름을 통째로 이해하고 있습니다. 다른 회계법인 출신 컨설턴트들이 놓치는 작은 공제 항목들이 결국 절세의 차이를 만듭니다.',
    bad: { tag: '일반 회계법인', text: '법인 고객 위주, 1인 사업자는 후순위' },
    good: { tag: '택스메이트', text: '1인 사업자 1,247명, 그게 전부' },
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
    flip: false,
  },
  {
    no: '02 — 응대 속도',
    title: '카톡 상시 응대. 평일 9시–22시 평균 3분 답변',
    body: '세금 질문은 "지금" 답을 알아야 의미가 있죠. 거래 직전에 떠오른 의문도, 영수증 처리 방법도 — 카톡으로 즉시 답이 옵니다. 사무소에 전화 걸어 며칠 기다리지 않으셔도 됩니다.',
    bad: { tag: '일반 세무사무소', text: '전화 / 이메일, 평균 1~3일' },
    good: { tag: '택스메이트', text: '카톡 평균 3분, 본인이 직접' },
    img: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80',
    flip: true,
  },
  {
    no: '03 — 결과 가시화',
    title: '절세 시뮬레이션으로 숫자를 먼저 보여드립니다',
    body: '"법인 전환하시면 좋아요" 같은 말 대신, 매출·비용·세율을 그대로 넣어 3년치 예상 세금 차이를 보여드립니다. 결정은 숫자를 보신 후에 직접 하세요.',
    bad: { tag: '일반 컨설팅', text: '"전환하시면 절세돼요" 추상적 권유' },
    good: { tag: '택스메이트', text: '3년치 시뮬레이션 PDF 제공' },
    img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1000&q=80',
    flip: false,
  },
]

const REVIEWS = [
  {
    text: '"5월 종소세에서 187만원 환급받았어요. 카드내역에서 놓치고 있던 경비를 그렇게 많이 빼주실 줄 몰랐습니다."',
    meta: '종합소득세 신고 · 2025년 5월',
    name: '이*은',
    role: '디자인 프리랜서',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
  },
  {
    text: '"법인 전환하라고 옆에서 다 떠밀던데, 시뮬레이션 돌려보고 \'아직 개인사업자가 유리합니다\' 라고 솔직히 말씀해주셨어요."',
    meta: '절세 시뮬레이션 · 2025년 3월',
    name: '박*호',
    role: '스마트스토어 운영',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
  {
    text: '"카톡으로 영수증 사진만 보내면 끝이라 너무 편해요. 매달 신경 쓸 일이 사라졌어요."',
    meta: '월 기장 대행 · 진행 8개월차',
    name: '최*진',
    role: '1인 카페 운영',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
  },
  {
    text: '"개업한 지 3개월이라 뭘 모르는지도 모르겠던 상태였는데, 처음부터 같이 짚어주셔서 안심됐어요."',
    meta: '초기 상담 + 기장 · 2024년 12월',
    name: '정*아',
    role: '온라인 강사',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80',
  },
  {
    text: '"개인사업자 → 법인 전환을 3년치 시뮬레이션으로 비교해주셔서, 가족 회의에서 그 PDF 한 장으로 결정됐습니다."',
    meta: '법인 전환 컨설팅 · 2025년 2월',
    name: '윤*수',
    role: '개발 외주 · 매출 9천만원',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
  {
    text: '"부산이라 비대면 가능할까 걱정했는데, 화상 한 번이면 충분했어요. 전국 어디서나 똑같이 응대받는 느낌."',
    meta: '비대면 상담 · 2025년 4월',
    name: '강*린',
    role: '번역 프리랜서 · 부산',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
  },
]

const STEPS = [
  { n: 1, title: '카톡 문의', body: '"어떤 상황인지" 한두 줄만 적어 보내주세요. 평일 평균 3분 안에 답변드립니다.', duration: '소요: 즉시', dark: false },
  { n: 2, title: '무료 상담', body: '30분 화상 또는 대면 미팅. 현재 세금 상황을 함께 점검합니다. 비용 없음, 결정 강요 없음.', duration: '소요: 30분', dark: false },
  { n: 3, title: '견적 + 제안서', body: '진행할 항목과 정확한 금액, 예상 절세액을 PDF로 보내드립니다. 비교 후 결정하세요.', duration: '소요: 1–2일', dark: false },
  { n: 4, title: '본 계약 + 작업', body: '동의하시면 그때부터 진행. 만족하지 못하시면 첫 달 환불 보장.', duration: '소요: 일정 협의', dark: true },
]

const FAQ = [
  { q: '상담만 받고 결정해도 되나요?', a: '네, 그러셔도 됩니다. 첫 30분 상담은 무료이고 계약 의무가 없습니다. 1,247건 중 약 30%는 그 자리에서 결정하지 않으셨고, 그분들께도 동일하게 응대해 드립니다.' },
  { q: '비용이 부담스러운데요', a: '매출 규모에 맞춰 시작 금액을 5만원부터 잡았습니다. 절세 시뮬레이션을 먼저 받아보시고, 예상 절세액이 비용보다 크지 않으면 진행하지 않으셔도 됩니다.' },
  { q: '지방 사업자도 가능한가요?', a: '전국 어디든 가능합니다. 상담은 화상으로, 서류는 카톡·이메일로 받습니다. 현재 고객의 약 40%가 서울 외 지역입니다.' },
  { q: '처음이라 뭘 준비해야 할지 모르겠어요', a: '아무것도 준비하지 않으셔도 됩니다. 사업자등록증과 최근 카드내역 정도만 있으면 첫 상담은 충분합니다. 나머지는 필요한 시점에 카톡으로 안내드립니다.' },
  { q: '다른 세무사와 뭐가 다른가요?', a: '고객 100%가 1인 사업자·프리랜서입니다. 법인 위주 사무소가 놓치는 공제 항목과 절세 패턴을 12년간 누적해 왔습니다. 또한 카톡 응대는 사무 직원이 아닌 김택스 본인이 직접 합니다.' },
  { q: '환불 정책은 어떻게 되나요?', a: '월 기장 대행과 종소세 신고는 첫 달 / 첫 신고 완료 후 만족하지 못하시면 전액 환불해 드립니다. 자세한 조건은 계약 시 명시합니다.' },
]

function BrandMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3.5c-2 5.4-6.5 9-6.5 13.4a6.5 6.5 0 0 0 13 0c0-4.4-4.5-8-6.5-13.4z" fill="#ff385c" />
    </svg>
  )
}

export default function InquiryLandingClient() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', type: '', msg: '', consent: false })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const NAV_LINKS = [
    ['#services', '서비스'],
    ['#why', '차별점'],
    ['#reviews', '후기'],
    ['#process', '진행 절차'],
    ['#faq', '자주 묻는 질문'],
  ] as const

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('lead-submit', form)
    setSubmitted(true)
  }

  return (
    <main className="ddpage-inquiry bg-white text-[#222222] [font-family:Inter,'Noto_Sans_KR',-apple-system,system-ui,sans-serif] antialiased">
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 h-20 border-b border-[#ebebeb] bg-white">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6 lg:px-10">
          <Link href="#" className="flex items-center gap-2 no-underline">
            <BrandMark />
            <span className="text-[20px] font-semibold tracking-tight text-[#222222]">택스메이트</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map(([href, label]) => (
              <a key={href} href={href} className="rounded-full px-4 py-2 text-[16px] font-semibold text-[#222222] no-underline hover:bg-[#f2f2f2]">
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-[#ff385c] px-3.5 py-2.5 text-[14px] font-medium text-white no-underline transition-colors hover:bg-[#e00b41] sm:px-4">
              <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
              <span className="hidden sm:inline">카톡 상담</span>
              <span className="sm:hidden">상담</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="메뉴 열기"
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#ebebeb] text-[#222222] md:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col gap-6 bg-white px-6 pb-8 pt-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-semibold tracking-tight text-[#222222]">메뉴</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="메뉴 닫기"
                className="grid h-10 w-10 place-items-center rounded-full text-[#222222] hover:bg-[#f2f2f2]"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3.5 text-[17px] font-semibold text-[#222222] no-underline hover:bg-[#f2f2f2]"
                >
                  {label}
                </a>
              ))}
            </nav>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#ff385c] px-5 py-4 text-[16px] font-medium text-white no-underline transition-colors hover:bg-[#e00b41]"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
              카톡으로 상담하기
            </a>
          </aside>
        </div>
      )}

      {/* HERO */}
      <section className="mx-auto max-w-[1280px] px-6 pt-12 pb-16 lg:px-10 lg:pt-20 lg:pb-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dddddd] bg-white px-3.5 py-2 text-[13px] font-medium text-[#3f3f3f]">
              <Check className="h-[18px] w-[18px]" strokeWidth={2} />
              국세청 등록 세무사 · 12년 경력
            </span>
            <h1 className="ddpage-inquiry-hero-headline mt-2 text-[#222222] break-keep">
              1인 사업자를 위한
              <br />
              <span className="text-[#ff385c]">절세 컨설팅</span>
            </h1>
            <p className="mt-6 max-w-[560px] text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">
              혼자 사업하느라 세금까지 챙길 시간 없으셨죠. 매출 1억 미만 1인 사업자와 프리랜서를 위해 12년간 1,247건의 절세 상담을 진행해 왔습니다. 평균 232만원, 더 남기실 수 있습니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-[#ff385c] px-5 py-3.5 text-[16px] font-medium text-white no-underline transition-colors hover:bg-[#e00b41]">
                <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
                카톡 상담하기
                <span className="text-sm opacity-70">· 평균 3분 답변</span>
              </a>
              <a href="tel:0212345678" className="inline-flex items-center gap-2 rounded-xl border border-[#222222] bg-white px-5 py-3.5 text-[16px] font-medium text-[#222222] no-underline transition-colors hover:bg-[#f2f2f2]">
                <Phone className="h-[18px] w-[18px]" strokeWidth={1.8} />
                전화 문의
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-[#6a6a6a]">
              {['초기 상담 무료', '누적 상담 1,247건', '1영업일 내 답변'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-[18px] w-[18px]" strokeWidth={2} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative overflow-hidden rounded-[14px]">
              <img
                className="aspect-[4/5] w-full object-cover"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
                alt="김택스 세무사"
              />
              <div className="ddpage-inquiry-shadow-float absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold">
                <Star className="h-[14px] w-[14px] fill-current" strokeWidth={0} />
                상담 만족도 4.96
              </div>
            </div>
            <div className="ddpage-inquiry-shadow-float absolute -bottom-6 -left-6 hidden rounded-[14px] border border-[#ebebeb] bg-white p-4 pr-6 lg:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2f2f2]">
                  <svg className="h-6 w-6 text-[#ff385c]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-7-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-7 11-7 11h-4z" /></svg>
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-[#222222]">평균 절세액</div>
                  <div className="text-[14px] text-[#6a6a6a]">2025 상반기 기준</div>
                </div>
                <div className="ml-6 text-[21px] font-bold text-[#222222]">
                  232<span className="ml-0.5 text-[14px] font-normal text-[#6a6a6a]"> 만원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS + CREDS */}
      <section className="bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="ddpage-inquiry-stat-num text-[#222222]">
                  {s.num.includes('+') ? <>{s.num.replace('+', '')}<span className="text-[#ff385c]">+</span></>
                    : s.num.includes('%') ? <>{s.num.replace('%', '')}<span className="text-[#ff385c]">%</span></>
                    : s.num.includes(' ') ? <>{s.num.split(' ')[0]}<span className="text-[16px] font-normal text-[#6a6a6a]"> {s.num.split(' ')[1]}</span></>
                    : s.num}
                </div>
                <div className="mt-2 text-[14px] text-[#6a6a6a]">{s.label}</div>
                <div className="mt-1 text-[16px] font-semibold text-[#222222]">{s.caption}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <span className="mr-2 text-[14px] text-[#6a6a6a]">자격 · 인증</span>
            {CERTS.map((c, i) => (
              <span key={c} className="inline-flex items-center gap-2.5 rounded-full border border-[#dddddd] bg-white px-4.5 py-3 text-[14px] font-medium" style={{ padding: '12px 18px' }}>
                <span className="h-2 w-2 rounded-full" style={{ background: i === 0 ? '#ff385c' : '#222222' }}></span>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-12 max-w-[760px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#ff385c]">서비스</span>
          <h2 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.4px] text-[#222222] break-keep">필요한 만큼만, 합리적인 금액으로</h2>
          <p className="mt-4 text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">
            1인 사업자가 실제로 마주치는 4가지 세무 상황에 맞춘 패키지입니다. 가격을 미리 공개하니, 부담 없이 살펴보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const Icon = s.icon
            return (
              <article key={s.title} className="ddpage-inquiry-hover-float rounded-[14px] border border-[#ebebeb] bg-white p-7">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#f2f2f2]">
                  <Icon className="h-6 w-6 text-[#222222]" strokeWidth={1.8} />
                </div>
                <h3 className="text-[20px] font-semibold leading-[1.2] tracking-[-0.18px] text-[#222222] break-keep">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.5] text-[#3f3f3f] break-keep">{s.desc}</p>
                <div className="mt-6 flex items-end justify-between border-t border-[#ebebeb] pt-5">
                  <div>
                    <div className="text-[14px] text-[#6a6a6a]">시작</div>
                    <div className="text-[21px] font-bold text-[#222222]">
                      {s.price}
                      <span className="text-[16px] font-normal text-[#6a6a6a]">{s.unit}</span>
                    </div>
                  </div>
                  <a href="#contact" className="text-[14px] text-[#222222] underline underline-offset-2">상담</a>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {/* WHY ME */}
      <section id="why" className="bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="mb-14 max-w-[760px]">
            <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#ff385c]">차별점</span>
            <h2 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.4px] text-[#222222] break-keep">왜 택스메이트일까요?</h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">
              큰 회계법인이 놓치는 1인 사업자만의 절세 포인트가 있습니다. 작지만 정확하게, 그 자리를 채웁니다.
            </p>
          </div>

          {DIFFS.map((d, i) => (
            <div key={d.no} className={`mb-20 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-16 ${i === DIFFS.length - 1 ? 'mb-0' : ''}`}>
              <div className={`lg:col-span-6 ${d.flip ? 'lg:order-2' : ''}`}>
                <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.4px] text-[#6a6a6a]">{d.no}</div>
                <h3 className="text-[28px] font-bold leading-[1.25] tracking-[-0.4px] text-[#222222] break-keep">{d.title}</h3>
                <p className="mt-4 text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">{d.body}</p>
                <div className="mt-8 grid grid-cols-1 divide-y divide-[#ebebeb] overflow-hidden rounded-[14px] border border-[#ebebeb] sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
                  <div className="bg-[#f2f2f2] p-5 sm:p-6">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.4px] text-[#6a6a6a]">{d.bad.tag}</div>
                    <div className="text-[16px] font-semibold leading-[1.3] text-[#6a6a6a] break-keep">{d.bad.text}</div>
                  </div>
                  <div className="bg-white p-5 sm:p-6">
                    <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.4px] text-[#ff385c]">{d.good.tag}</div>
                    <div className="text-[16px] font-semibold leading-[1.3] text-[#222222] break-keep">{d.good.text}</div>
                  </div>
                </div>
              </div>
              <div className={`lg:col-span-6 ${d.flip ? 'lg:order-1' : ''}`}>
                <img className="w-full rounded-[14px] object-cover" style={{ aspectRatio: '5/4' }} src={d.img} alt="" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-[640px]">
            <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#ff385c]">실제 후기</span>
            <h2 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.4px] text-[#222222] break-keep">맡기신 분들이 직접 남긴 변화</h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">
              1,247건의 상담 중 별점·동의를 받아 공개한 후기입니다. 더 많은 후기는 카톡 상담에서 보실 수 있습니다.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[64px] font-bold leading-none tracking-[-1.5px] text-[#222222]">4.96</div>
            <div>
              <div className="mb-1 flex gap-0.5 text-[#222222]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-[14px] w-[14px] fill-current" strokeWidth={0} />
                ))}
              </div>
              <div className="text-[14px] text-[#6a6a6a]">평균 별점 · 412개 후기 기준</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <article key={r.name + r.meta} className="rounded-[14px] border border-[#ebebeb] bg-white p-7">
              <div className="mb-4 flex gap-0.5 text-[#222222]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-[14px] w-[14px] fill-current" strokeWidth={0} />
                ))}
              </div>
              <p className="text-[20px] font-semibold leading-snug tracking-[-0.18px] text-[#222222] break-keep">{r.text}</p>
              <div className="mt-6 text-[14px] text-[#6a6a6a]">{r.meta}</div>
              <div className="mt-3 flex items-center gap-3 border-t border-[#ebebeb] pt-4">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-[#f2f2f2]">
                  <img className="h-full w-full object-cover" src={r.avatar} alt="" />
                </div>
                <div>
                  <div className="text-[16px] font-semibold text-[#222222]">{r.name}</div>
                  <div className="text-[14px] text-[#6a6a6a]">{r.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="mb-14 max-w-[760px]">
            <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#ff385c]">진행 절차</span>
            <h2 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.4px] text-[#222222] break-keep">상담부터 계약까지, 일주일 안에</h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">
              처음 맡기시는 분이 가장 궁금해하는 흐름입니다. 어느 단계에서든 멈추셔도 비용은 없습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className={`rounded-[14px] border p-7 ${s.dark ? 'border-[#222222] bg-[#222222] text-white' : 'border-[#ebebeb] bg-white'}`}
              >
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-semibold ${s.dark ? 'bg-white text-[#222222]' : 'bg-[#222222] text-white'}`}
                >
                  {s.n}
                </span>
                <h3 className={`mt-5 text-[20px] font-semibold leading-[1.2] tracking-[-0.18px] break-keep ${s.dark ? 'text-white' : 'text-[#222222]'}`}>{s.title}</h3>
                <p className={`mt-2 text-[14px] leading-[1.5] break-keep ${s.dark ? 'text-white/80' : 'text-[#3f3f3f]'}`}>{s.body}</p>
                <div className={`mt-5 text-[14px] ${s.dark ? 'text-white/70' : 'text-[#6a6a6a]'}`}>{s.duration}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 inline-flex items-center gap-3 text-[14px] text-[#6a6a6a]">
            <Check className="h-[18px] w-[18px]" strokeWidth={2} />
            어느 단계에서든 진행을 중단하셔도 비용은 청구되지 않습니다.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#ff385c]">자주 묻는 질문</span>
            <h2 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.4px] text-[#222222] break-keep">
              처음 맡기실 때<br />궁금하실 만한 것들
            </h2>
            <p className="mt-4 text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">
              여기서 답을 찾지 못하시면, 카톡으로 편하게 물어보세요.
            </p>
            <a href="#contact" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#222222] bg-white px-5 py-3.5 text-[16px] font-medium text-[#222222] no-underline transition-colors hover:bg-[#f2f2f2]">
              바로 카톡 문의
            </a>
          </div>

          <div className="lg:col-span-8">
            {FAQ.map((f, i) => (
              <details key={f.q} open={i === 0} className="border-b border-[#ebebeb]">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6">
                  <span className="text-[20px] font-semibold leading-[1.3] tracking-[-0.18px] text-[#222222] break-keep">{f.q}</span>
                  <Plus className="ddpage-inquiry-faq-icon h-5 w-5 flex-shrink-0 text-[#222222]" strokeWidth={1.8} />
                </summary>
                <div className="max-w-[760px] pb-6 text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-bold uppercase tracking-[0.4px] text-[#ff385c]">무료 상담 신청</span>
              <h2 className="mt-3 text-[28px] font-bold leading-[1.25] tracking-[-0.4px] text-[#222222] break-keep">
                지금 보내주시면<br />1영업일 안에 답변드립니다
              </h2>
              <p className="mt-4 text-[16px] leading-[1.6] text-[#3f3f3f] break-keep">
                전화가 어려우시면 카톡으로 먼저 짧게 적어주세요. 어떤 상황이신지 한두 줄만 알려주시면 충분합니다.
              </p>

              <div className="mt-10 space-y-4">
                {[
                  { icon: MessageCircle, label: '카카오톡', value: '@taxmate · 평일 9–22시 평균 3분 답변' },
                  { icon: Phone, label: '전화', value: '02-1234-5678 · 평일 10–18시' },
                  { icon: Mail, label: '이메일', value: 'hello@taxmate.kr' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#ebebeb] bg-white">
                      <Icon className="h-[18px] w-[18px] text-[#222222]" strokeWidth={1.8} />
                    </div>
                    <div>
                      <div className="text-[16px] font-semibold text-[#222222]">{label}</div>
                      <div className="text-[14px] text-[#6a6a6a]">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="rounded-[14px] border border-[#ebebeb] bg-white p-8 lg:p-10">
                <h3 className="mb-1 text-[21px] font-bold leading-[1.3] text-[#222222]">무료 상담 신청서</h3>
                <p className="mb-8 text-[14px] text-[#6a6a6a]">제출하신 내용은 상담 외 용도로 사용되지 않습니다.</p>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-[13px] font-semibold text-[#222222]">이름</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="홍길동"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="ddpage-inquiry-field w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3.5 text-[16px] text-[#222222]"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1.5 block text-[13px] font-semibold text-[#222222]">연락처 (전화 또는 카톡 ID)</label>
                    <input
                      id="phone"
                      type="text"
                      placeholder="010-0000-0000 또는 @kakaoid"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="ddpage-inquiry-field w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3.5 text-[16px] text-[#222222]"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="type" className="mb-1.5 block text-[13px] font-semibold text-[#222222]">사업 형태</label>
                  <select
                    id="type"
                    required
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="ddpage-inquiry-field w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3.5 text-[16px] text-[#222222]"
                  >
                    <option value="">선택해주세요</option>
                    <option>개인사업자</option>
                    <option>법인</option>
                    <option>프리랜서 / 3.3%</option>
                    <option>예비 창업</option>
                    <option>기타</option>
                  </select>
                </div>

                <div className="mt-5">
                  <label htmlFor="msg" className="mb-1.5 block text-[13px] font-semibold text-[#222222]">상담 내용</label>
                  <textarea
                    id="msg"
                    rows={4}
                    placeholder="어떤 부분이 궁금하신지 한두 줄로 적어주세요. 예: 5월 종소세 신고 준비 중인데 작년에 환급을 너무 적게 받아서요."
                    value={form.msg}
                    onChange={(e) => setForm({ ...form, msg: e.target.value })}
                    className="ddpage-inquiry-field w-full resize-y rounded-xl border border-[#dddddd] bg-white px-4 py-3.5 text-[16px] text-[#222222]"
                  />
                </div>

                <label className="mt-6 flex cursor-pointer select-none items-start gap-3 text-[14px] text-[#3f3f3f]">
                  <input
                    type="checkbox"
                    required
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    className="mt-0.5 h-4 w-4 accent-[#ff385c]"
                  />
                  <span className="break-keep">(필수) 개인정보 처리방침에 동의합니다. 수집 항목: 이름, 연락처, 상담 내용 / 보유: 상담 종료 후 1년.</span>
                </label>

                <button
                  type="submit"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff385c] px-5 py-4 text-[17px] font-medium text-white transition-colors hover:bg-[#e00b41]"
                >
                  무료 상담 신청
                  <ArrowRight className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </button>
                <p className="mt-4 text-center text-[14px] text-[#6a6a6a]">1영업일 안에 답변드립니다 · 상담 무료</p>

                {submitted && (
                  <div className="mt-6 rounded-[14px] border border-[#ff385c] bg-[#fff5f6] p-5" role="status">
                    <div className="flex items-center gap-2 text-[16px] font-semibold text-[#ff385c]">
                      <Check className="h-[18px] w-[18px]" strokeWidth={2} />
                      상담 신청이 접수되었습니다
                    </div>
                    <p className="mt-1 text-[14px] text-[#3f3f3f]">곧 카톡 또는 전화로 연락드리겠습니다.</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#ebebeb]">
        <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2">
                <BrandMark size={24} />
                <span className="text-[20px] font-semibold text-[#222222]">택스메이트</span>
              </div>
              <p className="mt-4 max-w-[380px] text-[14px] text-[#6a6a6a] break-keep">
                1인 사업자와 프리랜서를 위한 절세 컨설팅. 1,247건의 상담, 평균 232만원의 차이.
              </p>
            </div>
            <div className="md:col-span-3">
              <div className="mb-3 text-[16px] font-semibold text-[#222222]">사업자 정보</div>
              <ul className="space-y-1.5 text-[14px] text-[#6a6a6a]">
                <li>택스메이트 세무사사무소</li>
                <li>대표 김택스 (세무사 등록 2013-0824)</li>
                <li>사업자 123-45-67890</li>
                <li>통신판매 2024-서울강남-01234</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="mb-3 text-[16px] font-semibold text-[#222222]">연락처</div>
              <ul className="space-y-1.5 text-[14px] text-[#6a6a6a]">
                <li>02-1234-5678</li>
                <li>카톡 @taxmate</li>
                <li>hello@taxmate.kr</li>
              </ul>
            </div>
            <div className="md:col-span-2">
              <div className="mb-3 text-[16px] font-semibold text-[#222222]">정책</div>
              <ul className="space-y-1.5 text-[14px]">
                <li><a href="#" className="text-[#6a6a6a] no-underline hover:underline">이용약관</a></li>
                <li><a href="#" className="text-[#6a6a6a] no-underline hover:underline">개인정보 처리방침</a></li>
                <li><a href="#" className="text-[#6a6a6a] no-underline hover:underline">환불 정책</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-[#ebebeb] pt-6 text-[14px] text-[#6a6a6a]">
            <div>서울특별시 강남구 테헤란로 123, 4층 · © 2026 TaxMate</div>
            <Link href="/portfolio" className="text-[#6a6a6a] no-underline hover:underline">← 다른 포트폴리오 보기</Link>
          </div>
          <p className="mt-4 text-center text-[12px] text-[#929292]">포트폴리오용 샘플 작업입니다</p>
        </div>
      </footer>

      {/* STICKY MOBILE CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#ebebeb] bg-white/95 p-3 backdrop-blur-md md:hidden">
        <a
          href="#contact"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff385c] px-5 py-4 text-[16px] font-medium text-white no-underline transition-colors hover:bg-[#e00b41]"
        >
          <MessageCircle className="h-5 w-5" strokeWidth={1.8} />
          카톡 상담하기 · 평균 3분 답변
        </a>
      </div>
    </main>
  )
}
