import Link from "next/link";

type PortfolioCard = {
  slug: string;
  title: string;
  description: string;
  designTone: string;
};

const PORTFOLIO_CARDS: PortfolioCard[] = [
  {
    slug: "lead",
    title: "리드/DB 수집형",
    description: "이메일 한 줄로 사전예약·뉴스레터 가입을 받는 단일 액션 랜딩",
    designTone: "Dark Hero + Pastel Section (Toss/LearnOn 톤)",
  },
  {
    slug: "inquiry",
    title: "상담 문의형",
    description: "전문가 서비스의 신뢰를 쌓고 카톡·전화·폼으로 상담 문의를 받는 랜딩",
    designTone: "Airbnb-ish 미니멀 (화이트 + 코럴 포인트)",
  },
  {
    slug: "product",
    title: "상품/서비스 소개형",
    description: "SaaS·앱·서비스 가치를 전달하고 가입·데모로 전환",
    designTone: "Contractbook 디자인 시스템",
  },
  {
    slug: "brand",
    title: "브랜드/포트폴리오형",
    description: "개인·스튜디오의 정체성과 작업을 보여주고 의뢰로 연결하는 다크 무드 랜딩",
    designTone: "Dark Cosmic + Violet Accent (스튜디오 톤)",
  },
  {
    slug: "event",
    title: "이벤트/예약형",
    description: "컨퍼런스·세미나·클래스 신청 받기",
    designTone: "Apple-ish 미니멀 (화이트 + 애저 블루)",
  },
  {
    slug: "sales",
    title: "세일즈/구매 전환형",
    description: "롱폼 스토리텔링으로 정보성 상품·온라인 강의의 구매 전환을 끌어내는 랜딩",
    designTone: "Peach + Teal/Lime Accent (인프런/클래스101 톤)",
  },
  {
    slug: "teaser",
    title: "사전예약/티저형",
    description: "신규 브랜드·라이프스타일 제품의 런칭 전 기대감을 만들고 이메일 사전예약을 받는 Coming Soon 랜딩",
    designTone: "Deep Indigo + Pastel Accent (절제된 미스터리 톤)",
  },
];

export default function PortfolioListPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
      <header className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Portfolio</h1>
        <p className="mt-3 text-sm sm:text-base text-neutral-600">
          뚝딱페이지에서 제공하는 랜딩페이지 유형 샘플입니다.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PORTFOLIO_CARDS.map((card) => (
          <Link
            key={card.slug}
            href={`/portfolio/${card.slug}`}
            className="group rounded-2xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-900"
          >
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {card.slug}
            </div>
            <h2 className="mt-3 text-xl font-semibold leading-tight">{card.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">{card.description}</p>
            <div className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-neutral-500">
              <span>디자인 톤:</span>
              <span className="text-neutral-900">{card.designTone}</span>
            </div>
            <div className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 group-hover:text-blue-700">
              살펴보기 →
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
