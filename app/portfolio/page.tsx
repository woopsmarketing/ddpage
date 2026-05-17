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
    slug: "product",
    title: "상품/서비스 소개형",
    description: "SaaS·앱·서비스 가치를 전달하고 가입·데모로 전환",
    designTone: "Contractbook 디자인 시스템",
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
