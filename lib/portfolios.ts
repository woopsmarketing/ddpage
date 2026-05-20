/**
 * Portfolio entries — single source of truth (D-01).
 *
 * 뚝딱페이지가 보여주는 8개 랜딩페이지 유형 샘플의 메타데이터.
 * `app/portfolio/page.tsx` (카탈로그) 및 SEO 메타 빌더가 이 모듈에서 import.
 */

export type PortfolioEntry = {
  slug: string;
  title: string;
  description: string;
  designTone: string;
};

export const PORTFOLIOS: readonly PortfolioEntry[] = [
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
    description:
      "롱폼 스토리텔링으로 정보성 상품·온라인 강의의 구매 전환을 끌어내는 랜딩",
    designTone: "Peach + Teal/Lime Accent (인프런/클래스101 톤)",
  },
  {
    slug: "teaser",
    title: "사전예약/티저형",
    description:
      "신규 브랜드·라이프스타일 제품의 런칭 전 기대감을 만들고 이메일 사전예약을 받는 Coming Soon 랜딩",
    designTone: "Deep Indigo + Pastel Accent (절제된 미스터리 톤)",
  },
  {
    slug: "profile",
    title: "1인 프로필형",
    description:
      "작가·크리에이터·강연자의 소개와 채널 링크를 한 페이지에 모은 Link-in-Bio 대체 프로필 카드",
    designTone: "Dot-grid Canvas + Fire Orange Accent (Firecrawl 화이트보드 톤)",
  },
];

export function getPortfolio(slug: string): PortfolioEntry | undefined {
  return PORTFOLIOS.find((p) => p.slug === slug);
}
