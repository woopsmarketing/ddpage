"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./styles.css";

/**
 * testclient — 뚝딱페이지 메인 랜딩 (client-conversion 결과물)
 * Source: mainpage1/preview.html (Claude Design)
 * 12 sections: Nav → Hero → Pain → Market shift → Compare → Portfolio
 *  → Value cards → Form preview → Pricing → FAQ → End CTA → Footer
 *
 * 모든 마크업은 `.ddpage-testclient` 루트 아래로 스코프됨 (styles.css 참조).
 */

type FaqEntry = { q: string; a: string };

const FAQ_ENTRIES: ReadonlyArray<FaqEntry> = [
  {
    q: "정말 14,900원에 다 되나요?",
    a: "네. 사이트 제작, 호스팅, SSL 인증서, 검색 노출 최적화, 서브도메인까지 모두 포함된 가격입니다. 추가 비용은 없습니다.",
  },
  {
    q: "사이트 만들기 얼마나 걸리나요?",
    a: "올인원 패키지 기준 신청 후 1~2시간 안에 시안을 받아보실 수 있습니다. 수정 요청 후 최종 배포까지 통상 1~3일 내 완료됩니다.",
  },
  {
    q: "도메인은 어떻게 되나요?",
    a: "기본형은 서브도메인(yourname.ddpage.kr)이 무료 제공됩니다. 원하시는 커스텀 도메인(예: yourname.com)도 본인 명의로 구매하신 후 무료로 연결 지원해드립니다.",
  },
  {
    q: "수정은 몇 번까지 가능한가요?",
    a: "1회의 무료 수정이 포함됩니다 (텍스트·이미지 5개 이내). 추가 수정은 건당 5,000원, 새 페이지 추가는 별도 견적입니다.",
  },
  {
    q: "구독 해지 후에는 어떻게 되나요?",
    a: "해지 시점 즉시 사이트가 비공개 처리되며, 30일 후 완전 폐기됩니다. 콘텐츠 원본은 고객님 소유이므로 해지 전 요청 시 백업해드립니다.",
  },
  {
    q: "검색 노출도 정말 다 해주나요?",
    a: "네. 구글·네이버 검색 최적화, 챗지피티·클로드 같은 AI 답변엔진 노출 최적화, 모바일 성능 최적화까지 모두 자동 적용됩니다. 일반 제작 업체에서 별도 30만원 이상 받는 작업입니다.",
  },
  {
    q: "결제는 어떻게 하나요?",
    a: "현재 MVP 단계로, 크몽 플랫폼을 통해 결제와 운영이 진행됩니다. 자체 결제 시스템과 정기 결제는 이후 도입 예정입니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "제작 시작 전 24시간 이내 100% 환불, 시안 전달 전 50% 환불이 가능합니다. 시안 전달 후에는 디지털 콘텐츠 특성상 환불이 어렵습니다. 서비스 이용료의 환불·해지 절차는 크몽 플랫폼 정책을 따릅니다.",
  },
];

type PortfolioCard = {
  img: string;
  alt: string;
  type: string;
  tag: string;
  name: string;
  for_: string;
};

const PORTFOLIO_CARDS: ReadonlyArray<PortfolioCard> = [
  { img: "/clients/testclient/lead.png",    alt: "리드 수집형 샘플 — 강의·컨설팅",         type: "TYPE 01", tag: "Lead",    name: "리드 수집형",         for_: "강의, 컨설팅 · 이메일·연락처 수집" },
  { img: "/clients/testclient/inquiry.png", alt: "상담 문의형 샘플 — 헬스, 요가, 코칭",     type: "TYPE 02", tag: "Inquiry", name: "상담 문의형",         for_: "헬스·요가, 1:1 코칭 · 카톡 상담" },
  { img: "/clients/testclient/product.png", alt: "상품 소개형 샘플 — SaaS, 디지털 상품",    type: "TYPE 03", tag: "Product", name: "상품 소개형",         for_: "SaaS, 디지털 상품 · 가격 + 기능" },
  { img: "/clients/testclient/brand.png",   alt: "브랜드 포트폴리오 샘플 — 작가, 디자이너", type: "TYPE 04", tag: "Brand",   name: "브랜드 · 포트폴리오", for_: "작가, 디자이너 · 작품 갤러리" },
  { img: "/clients/testclient/event.png",   alt: "이벤트 예약형 샘플 — 컨퍼런스, 워크숍",   type: "TYPE 05", tag: "Event",   name: "이벤트 · 예약형",     for_: "컨퍼런스, 워크숍 · 예약 + 카운트다운" },
  { img: "/clients/testclient/sales.png",   alt: "세일즈 롱폼 샘플 — 강의, 고가 상품",       type: "TYPE 06", tag: "Sales",   name: "세일즈 롱폼",         for_: "강의, 고가 상품 · 전환 위주" },
  { img: "/clients/testclient/teaser.png",  alt: "사전예약 티저 샘플 — 신제품 런칭",         type: "TYPE 07", tag: "Teaser",  name: "사전예약 · 티저",     for_: "신제품 런칭 · 이메일 캡처" },
  { img: "/clients/testclient/profile.png", alt: "1인 프로필 샘플 — 작가, 크리에이터",       type: "TYPE 08", tag: "Profile", name: "1인 프로필",          for_: "작가, 크리에이터 · Link in Bio" },
];

export default function TestclientClient() {
  // FAQ accordion — preview.html 스크립트에서 첫 번째 항목 is-open 기본값.
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (i: number) => setOpenFaq((cur) => (cur === i ? null : i));

  return (
    <div className="ddpage-testclient">
      {/* ============================================================
           Nav
           ============================================================ */}
      <header className="nav">
        <div className="nav__inner">
          <a href="#" className="nav__brand">
            <span className="nav__brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32" width="26" height="26">
                <rect x="3" y="3" width="26" height="26" rx="8" fill="#592eff" />
                <path d="M10 13 L16 9 L22 13 L22 22 L10 22 Z" fill="#dfff9d" />
                <circle cx="16" cy="17" r="2.4" fill="#21164c" />
              </svg>
            </span>
            뚝딱페이지
          </a>
          <nav className="nav__links">
            <a className="nav__link" href="#portfolio">포트폴리오</a>
            <a className="nav__link" href="#why">차별화</a>
            <a className="nav__link" href="#pricing">가격</a>
            <a className="nav__link" href="#faq">FAQ</a>
          </nav>
          <div className="nav__cta">
            <span className="nav__price break-keep">
              출시 기념 <b>14,900원</b>
            </span>
            <Link className="btn btn--primary btn--sm" href="/order">
              14,900원에 시작하기
            </Link>
          </div>
        </div>
      </header>

      {/* ============================================================
           1. Hero
           ============================================================ */}
      <section className="hero">
        <div className="hero__deco-1" />
        <div className="hero__deco-2" />
        <div className="hero__inner">
          <div className="hero__col-left">
            <div className="hero__price-row">
              <span className="label">출시 기념가</span>
              <span className="price">
                14,900<b>원</b>
              </span>
            </div>
            <h1 className="display-xl hero__title break-keep">
              구글에 노출되고,
              <br />
              <span className="accent">챗지피티가 추천</span>하는 사이트.
            </h1>
            <p className="hero__sub break-keep">
              검색에서도, AI 답변에서도 노출되는 사이트.
              <br />
              랜딩페이지 한 장으로 사업의 매출 동선을 만듭니다.
            </p>
            <div className="hero__cta">
              <Link className="btn btn--primary btn--lg" href="/order">
                14,900원에 시작하기
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <a className="btn btn--ghost btn--lg" href="#portfolio">
                포트폴리오 보기
              </a>
            </div>
            <div className="hero__trust">
              <span>8가지 사업 유형</span>
              <span>구글·챗지피티 노출 최적화 작업</span>
              <span>1~2시간 안에 시안</span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hero__visual" aria-hidden="true">
            <div className="hero__chrome">
              <i />
              <i />
              <i />
            </div>
            <div className="hero__shot-stack">
              <span className="hero__shot-label">yourname.ddpage.kr</span>
              <div className="hero__shot-title">
                한 페이지로
                <br />
                충분합니다.
              </div>
              <div className="hero__shot-pill">
                <span className="dot">G</span>
                <span>구글 검색 1페이지 노출</span>
              </div>
            </div>
            <div className="hero__metric-card">
              <div className="row1">
                <span>이 달의 검색 유입</span>
                <span className="delta">+312%</span>
              </div>
              <div className="big">
                1,247
                <span style={{ fontSize: 18, color: "var(--fg-3)", fontWeight: 600 }}>
                  명
                </span>
              </div>
              <div className="bar" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           2. Pain points
           ============================================================ */}
      <section className="section">
        <div className="section__head">
          <span className="eyebrow">혹시 이런 거 겪고 계세요?</span>
          <h2 className="display-lg break-keep">
            사이트는 있는데,
            <br />
            찾아오는 사람이 없습니다.
          </h2>
        </div>

        <div className="pain-grid">
          <article className="pain-card">
            <div className="pain-card__icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4.35-4.35" />
              </svg>
            </div>
            <div className="pain-card__num">01</div>
            <h3 className="break-keep">
              사이트는 있는데<br />검색에 안 잡힘
            </h3>
            <p className="break-keep">
              수십만원 들여 사이트 만들었는데, 검색해도 안 나옵니다. 결국 광고비만 계속 쓰게 되죠.
            </p>
          </article>

          <article className="pain-card">
            <div className="pain-card__icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <div className="pain-card__num">02</div>
            <h3 className="break-keep">
              SEO 알아서 하라는데<br />막막함
            </h3>
            <p className="break-keep">
              사이트 만들어주는 곳은 &ldquo;SEO는 따로 받으라&rdquo;고 합니다. 견적 받으면 매달 30만원+ 받겠다고 하고요.
            </p>
          </article>

          <article className="pain-card">
            <div className="pain-card__icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2v20M5 9l7-7 7 7M5 15l7 7 7-7" />
              </svg>
            </div>
            <div className="pain-card__num">03</div>
            <h3 className="break-keep">
              비용은 줄이고<br />효과는 키우고 싶음
            </h3>
            <p className="break-keep">
              광고비, 호스팅비, 도메인비, SEO 비용. 합치면 매달 13만원+. 이게 맞나 싶죠.
            </p>
          </article>
        </div>
      </section>

      {/* ============================================================
           2.5 Market shift
           ============================================================ */}
      <section className="section">
        <div className="section__head section__head--center">
          <span className="eyebrow">검색이 바뀌었습니다</span>
          <h2 className="display-lg break-keep" style={{ textAlign: "center" }}>
            이제 사람들은,
            <br />
            구글과 <span className="violet-pop">챗지피티를 같이</span> 봅니다.
          </h2>
          <p className="break-keep" style={{ textAlign: "center", maxWidth: 680 }}>
            검색 결과 1페이지로 끝나는 시대가 아닙니다. &ldquo;이거 추천드려요&rdquo;라는 AI의 한 줄이 새로운 매출 동선을 만듭니다.
          </p>
        </div>

        <div className="shift-wrap">
          <div className="shift-col shift-col--old">
            <span className="shift-tag">예전엔</span>
            <h3 className="break-keep">
              <s>검색 → 광고 → 클릭</s>
            </h3>
            <p className="break-keep">
              광고비를 더 쓰는 사람이 이겼습니다. 매달 늘어나는 광고비, 광고를 멈추면 매출도 함께 멈춥니다.
            </p>
            <div className="shift-viz">
              <div className="row">
                <span className="ad-tag">AD</span>
                <span style={{ fontSize: 12, color: "var(--fg-3)" }}>
                  광고비로 자리 매기기
                </span>
              </div>
              <div className="meter-row">
                <span>광고 ON</span>
                <span style={{ color: "var(--fg-3)", fontWeight: 700 }}>매출 ↑</span>
              </div>
              <div className="meter meter--old" />
              <div className="meter-row">
                <span>광고 OFF</span>
                <span style={{ color: "#c64a4a", fontWeight: 700 }}>매출 ↓</span>
              </div>
            </div>
          </div>

          <div className="shift-arrow" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </div>

          <div className="shift-col shift-col--new">
            <span className="shift-tag">지금은</span>
            <h3 className="break-keep">
              물어보기 → <span className="violet-pop">AI 추천</span> → 클릭
            </h3>
            <p className="break-keep">
              광고비 없이도 AI 답변에 인용되면 매출이 따라옵니다. 검색이든 챗지피티든, &ldquo;보여야&rdquo; 사는 시대입니다.
            </p>
            <div className="shift-viz">
              <div className="row">
                <span className="ai-tag">AI</span>
                <span className="quote">&ldquo;이 사이트를 추천드려요&rdquo;</span>
              </div>
              <div className="meter-row">
                <span>AI 인용 시</span>
                <span style={{ color: "#18a458", fontWeight: 700 }}>클릭률 ↑</span>
              </div>
              <div className="meter meter--new" />
              <div className="meter-row">
                <span>광고비 없이도</span>
                <span style={{ color: "var(--color-action-violet)", fontWeight: 700 }}>
                  매출 ↑
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="shift-outcome">
          <p className="break-keep">
            랜딩페이지 한 장으로,
            <br />
            구글과 챗지피티 <b>두 곳 모두에서 보이게</b> 만듭니다.
          </p>
        </div>
      </section>

      {/* ============================================================
           3. Solution + Comparison
           ============================================================ */}
      <section className="section section--alt" id="why">
        <div className="section__inner">
          <div className="section__head">
            <span className="eyebrow">우리가 다른 이유</span>
            <h2 className="display-lg break-keep">
              제작만 해주는 곳은 많습니다.
              <br />
              <span className="violet-pop">검색에서 찾아오게 만드는 곳은</span> 뚝딱페이지뿐입니다.
            </h2>
          </div>

          <div className="compare">
            <div className="compare__col compare__col--head">
              <div className="compare__title">항목</div>
              <div className="compare__subtitle">매달 들어가는 비용</div>
            </div>
            <div className="compare__col compare__col--head compare__col--mid">
              <div className="compare__title">기존 솔루션</div>
              <div className="compare__subtitle">일반 제작 업체 평균</div>
            </div>
            <div className="compare__col compare__col--head compare__col--us">
              <div className="compare__title">뚝딱페이지</div>
              <div className="compare__subtitle">한 번에 전부 포함</div>
            </div>

            <div className="compare__row">
              <div className="compare__row--label">사이트 제작</div>
              <div className="mid">1회 30만원~</div>
              <div className="us">포함</div>
            </div>
            <div className="compare__row">
              <div className="compare__row--label">호스팅 · SSL</div>
              <div className="mid">1만원~</div>
              <div className="us">포함</div>
            </div>
            <div className="compare__row">
              <div className="compare__row--label">도메인 연결</div>
              <div className="mid">별도</div>
              <div className="us">포함</div>
            </div>
            <div className="compare__row">
              <div className="compare__row--label">구글·네이버 검색 노출</div>
              <div className="mid">별도 30만원+</div>
              <div className="us">노출 최적화 작업</div>
            </div>
            <div className="compare__row">
              <div className="compare__row--label">AI 추천 노출</div>
              <div className="mid">별도</div>
              <div className="us">노출 최적화 작업</div>
            </div>
            <div className="compare__row">
              <div className="compare__row--label">모바일 · 카톡 공유 최적화</div>
              <div className="mid">별도</div>
              <div className="us">노출 최적화 작업</div>
            </div>
            <div className="compare__row is-total">
              <div className="compare__row--label">총 비용</div>
              <div className="mid">13만원~</div>
              <div className="us">
                14,900<span className="won">원</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           4. Portfolio 2×4 grid
           ============================================================ */}
      <section className="portfolio" id="portfolio">
        <div className="portfolio__inner">
          <div className="portfolio__head">
            <div className="portfolio__title">
              <span className="eyebrow">8가지 포트폴리오 유형</span>
              <h2 className="display-lg break-keep">
                당신 사업에 딱 맞는<br />샘플이 이미 있습니다.
              </h2>
              <p className="break-keep">
                샘플 페이지를 그대로 가져다 쓰거나, 맞춤 커스텀도 가능합니다. 카드는 각 페이지의 첫 화면(Hero)을 보여줍니다.
              </p>
            </div>
            <div className="portfolio__meta">
              <div>
                <b>8</b>
                <span>사업 유형</span>
              </div>
              <div>
                <b>1~2시간</b>
                <span>시안 전달</span>
              </div>
              <div>
                <b>1주</b>
                <span>최종 배포</span>
              </div>
            </div>
          </div>

          <div className="pgrid">
            {PORTFOLIO_CARDS.map((card) => (
              <article key={card.tag} className="pcard">
                <div className="pcard__preview">
                  <Image
                    src={card.img}
                    alt={card.alt}
                    width={1000}
                    height={750}
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 320px"
                    loading="lazy"
                  />
                  <span className="pcard__badge">
                    <i />
                    {card.type}
                  </span>
                  <span className="pcard__tag">{card.tag}</span>
                </div>
                <div className="pcard__body">
                  <h3 className="pcard__name">{card.name}</h3>
                  <p className="pcard__for">{card.for_}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="portfolio__cta">
            <a className="btn btn--primary" href="#pricing">
              내 사업에 맞는 유형 선택하기
            </a>
            <span>· 시안은 1~2시간 안에 카톡으로 전달됩니다</span>
          </div>
        </div>
      </section>

      {/* ============================================================
           5. Value cards 2×2
           ============================================================ */}
      <section className="section">
        <div className="section__head">
          <span className="eyebrow">노출되면 일어나는 일</span>
          <h2 className="display-lg break-keep">
            단순한 사이트 하나가,<br />
            <span className="violet-pop">광고비 없는 매출 동선</span>이 됩니다.
          </h2>
        </div>

        <div className="value-grid">
          <article className="value-card value-card--air">
            <div className="value-card__num">01</div>
            <h3 className="break-keep">
              구글·네이버에서<br />먼저 보이게
            </h3>
            <p className="break-keep">
              광고비를 더 쓴다고 보이는 게 아닙니다. 메타·사이트맵·구조화 정보까지 자동 적용, 더 높은 자리에 올라갑니다.
            </p>
            <div className="value-card__viz">
              <svg width="160" height="60" viewBox="0 0 160 60" fill="none">
                <rect x="6" y="14" width="148" height="32" rx="16" fill="#fff" />
                <circle cx="22" cy="30" r="7" stroke="#21164c" strokeWidth="2" fill="none" />
                <path d="M27 35l5 5" stroke="#21164c" strokeWidth="2" strokeLinecap="round" />
                <rect x="40" y="26" width="80" height="8" rx="4" fill="#e0e0db" />
                <text x="130" y="34" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" fill="#592eff">
                  #1
                </text>
              </svg>
            </div>
          </article>

          <article className="value-card value-card--violet">
            <div className="value-card__num">02</div>
            <h3 className="break-keep">
              챗지피티가<br />&ldquo;이 사이트 추천해요&rdquo;
            </h3>
            <p className="break-keep">
              사람들이 AI에게 물어볼 때, 당신 사이트가 인용되도록 구조화. 광고비 없이도 클릭이 이어집니다.
            </p>
            <div className="value-card__viz">
              <svg width="160" height="60" viewBox="0 0 160 60" fill="none">
                <rect
                  x="6"
                  y="10"
                  width="120"
                  height="40"
                  rx="20"
                  fill="rgba(255,255,255,.12)"
                  stroke="rgba(255,255,255,.4)"
                  strokeWidth="1"
                />
                <circle cx="24" cy="30" r="10" fill="#a2ea13" />
                <text x="20" y="34" fontFamily="Montserrat" fontSize="13" fontWeight="800" fill="#21164c">
                  AI
                </text>
                <rect x="40" y="22" width="78" height="6" rx="3" fill="rgba(255,255,255,.4)" />
                <rect x="40" y="32" width="60" height="6" rx="3" fill="rgba(255,255,255,.2)" />
                <text x="132" y="34" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" fill="#a2ea13">
                  cited
                </text>
              </svg>
            </div>
          </article>

          <article className="value-card value-card--pink">
            <div className="value-card__num">03</div>
            <h3 className="break-keep">
              0.8초 안에<br />뜨는 페이지
            </h3>
            <p className="break-keep">
              떨어지는 이탈률을 막아주는 첨 인상. 모바일이 먼저인 사용자는 속도가 전부입니다.
            </p>
            <div className="value-card__viz">
              <svg width="160" height="60" viewBox="0 0 160 60" fill="none">
                <rect x="56" y="6" width="48" height="48" rx="9" fill="#fff" stroke="#21164c" strokeWidth="1.5" />
                <rect x="62" y="14" width="36" height="6" rx="3" fill="#21164c" opacity=".18" />
                <text x="68" y="42" fontFamily="Montserrat" fontSize="14" fontWeight="800" fill="#21164c">
                  0.8s
                </text>
              </svg>
            </div>
          </article>

          <article className="value-card value-card--green">
            <div className="value-card__num">04</div>
            <h3 className="break-keep">
              카카오톡에<br />올린 링크도 예쁘게
            </h3>
            <p className="break-keep">
              입소문이 일어나는 곳은 구글이 아니라 카톡입니다. 공유 시 미리보기 카드가 자동으로 예쁘게.
            </p>
            <div className="value-card__viz">
              <svg width="170" height="60" viewBox="0 0 170 60" fill="none">
                <rect x="6" y="10" width="158" height="42" rx="14" fill="#fff" stroke="#21164c" strokeWidth="1" />
                <rect x="14" y="18" width="36" height="26" rx="6" fill="#21164c" opacity=".12" />
                <rect x="58" y="22" width="78" height="6" rx="3" fill="#21164c" />
                <rect x="58" y="34" width="56" height="5" rx="2.5" fill="#21164c" opacity=".4" />
              </svg>
            </div>
          </article>
        </div>
      </section>

      {/* ============================================================
           6. Form preview (3 steps)
           ============================================================ */}
      <section className="section section--alt">
        <div className="section__inner">
          <div className="section__head section__head--center">
            <span className="eyebrow">제작 양식 미리보기</span>
            <h2 className="display-lg break-keep" style={{ textAlign: "center" }}>
              복잡한 미팅 없이,<br />양식 하나로 끝.
            </h2>
            <p className="break-keep" style={{ textAlign: "center" }}>
              아래 3단계가 전부입니다. 평균 30초면 신청이 끝나고, 시안은 1~2시간 안에 도착합니다.
            </p>
          </div>

          <div className="form-preview">
            <article className="form-step">
              <span className="form-step__num">STEP 01</span>
              <h3 className="break-keep">톤 &amp; 분위기 선택</h3>
              <p className="break-keep">
                차분함, 친근함, 프리미엄, 미니멀 등. 가장 어울리는 한 가지만 고르면 끝.
              </p>
              <div className="form-step__mock">
                <div className="tone-chips">
                  <span className="tone-chip tone-chip--on">차분함</span>
                  <span className="tone-chip">친근함</span>
                  <span className="tone-chip">프리미엄</span>
                  <span className="tone-chip">미니멀</span>
                </div>
              </div>
            </article>

            <article className="form-step">
              <span className="form-step__num">STEP 02</span>
              <h3 className="break-keep">사업 콘텐츠 + 참고 이미지 전송</h3>
              <p className="break-keep">
                상호, 한 줄 소개, 가격, 사진. 참고하고 싶은 이미지·사이트도 같이 보내주세요.
              </p>
              <div className="form-step__mock">
                <div className="mini-input">
                  <b>상호</b> · 가격 · 한 줄 소개
                </div>
                <div className="mini-input area">사업 설명 · 첨부 이미지 · 참고 링크…</div>
              </div>
            </article>

            <article className="form-step">
              <span className="form-step__num">STEP 03</span>
              <h3 className="break-keep">단 1시간 내로 시안 도착</h3>
              <p className="break-keep">카톡으로 시안 즉시 전달. 수정 한 번 거치면 곧바로 라이브.</p>
              <div className="form-step__mock">
                <div className="form-done">
                  <div className="form-done__check">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </div>
                  <div className="form-done__msg">시안 전달 완료</div>
                  <div className="form-done__sub">신청 후 약 1시간 · 카톡 도착</div>
                </div>
              </div>
            </article>
          </div>

          <div className="form-preview-cta">
            <Link className="btn btn--primary btn--lg" href="/order">
              지금 양식 작성하기
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <span>· 작성 시간 평균 30초</span>
          </div>
        </div>
      </section>

      {/* ============================================================
           7. Pricing
           ============================================================ */}
      <section className="section" id="pricing">
        <div className="section__head section__head--center">
          <span className="eyebrow">가격</span>
          <h2 className="display-lg break-keep" style={{ textAlign: "center" }}>
            간단합니다.<br />
            <span className="violet-pop">두 가지</span> 중에서 고르세요.
          </h2>
          <p className="break-keep" style={{ textAlign: "center" }}>
            대부분의 1인 사업은 올인원 패키지 한 가지면 충분합니다. 더 큰 규모가 필요하면 커스텀으로.
          </p>
        </div>

        <div className="pricing-grid">
          <article className="plan plan--hi">
            <span className="plan__pop">★ 가장 인기</span>
            <div>
              <div className="plan__name">ALL-IN-ONE</div>
              <div className="plan__tier">올인원 패키지</div>
            </div>
            <div className="plan__price">
              <span className="big">14,900</span>
              <span className="per">원~</span>
            </div>
            <ul className="plan__feats">
              <li>랜딩페이지 1장 (모바일·PC 반응형)</li>
              <li>커스텀 도메인 연결 지원</li>
              <li>구글·네이버 검색 노출 최적화 작업</li>
              <li>챗지피티·AI 답변엔진 노출 최적화 작업</li>
              <li>모바일 화면 완벽 최적화</li>
              <li>사이트 속도 대폭 상승 (0.8초 이내 로딩)</li>
              <li>카카오톡 공유 미리보기 최적화</li>
              <li>1회 무료 수정 · 시안 1~2시간</li>
            </ul>
            <div className="plan__btn">
              <Link href="/order" className="btn btn--primary">
                14,900원에 시작하기
              </Link>
            </div>
          </article>

          <article className="plan">
            <div>
              <div className="plan__name">CUSTOM</div>
              <div className="plan__tier">커스텀 패키지</div>
            </div>
            <div className="plan__price">
              <span className="big">30~80</span>
              <span className="per">만원 · 1회성</span>
            </div>
            <ul className="plan__feats">
              <li>완전 맞춤 디자인 (제한 없음)</li>
              <li>페이지 수 자유 (3~10페이지)</li>
              <li>모든 검색·AI 노출 최적화 포함</li>
              <li>속도 최적화 + 모바일 최적화 포함</li>
              <li>전담 디자이너 1:1 배정</li>
              <li>1회성 결제 · 별도 견적 상담</li>
            </ul>
            <div className="plan__btn">
              <Link href="/order" className="btn btn--ghost">
                견적 상담받기
              </Link>
            </div>
          </article>
        </div>

        {/* Early bird */}
        <div className="earlybird">
          <div className="earlybird__icon">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="M7 14l4-4 4 4 5-5" />
              <path d="M17 9h4v4" />
            </svg>
          </div>
          <div className="earlybird__copy">
            <h3 className="break-keep">
              출시 기념 선착순 50명{" "}
              <s style={{ color: "rgba(255,255,255,.4)", fontWeight: 500, marginRight: 6 }}>
                19,900원
              </s>{" "}
              <b>14,900원</b>
            </h3>
            <p className="break-keep">
              지금 신청하시면 정가 19,900원 → 14,900원으로 시작하실 수 있습니다.
            </p>
          </div>
          <div className="earlybird__progress">
            <div className="earlybird__bar" />
            <div className="earlybird__count">
              남은 자리 <b>18</b> / 50
            </div>
          </div>
        </div>

        <p
          className="break-keep"
          style={{
            textAlign: "center",
            color: "var(--fg-3)",
            fontSize: 13,
            margin: "36px auto 0",
            maxWidth: 640,
            lineHeight: 1.6,
          }}
        >
          * 현재 MVP 단계로 결제는 크몽 플랫폼을 통해 진행됩니다. <br />
          * 자세한 결제 방식은 신청 후 카톡으로 안내해 드립니다.
        </p>
      </section>

      {/* ============================================================
           8. FAQ
           ============================================================ */}
      <section className="section section--alt" id="faq">
        <div className="section__inner">
          <div className="section__head section__head--center">
            <span className="eyebrow">FAQ</span>
            <h2 className="display-lg" style={{ textAlign: "center" }}>
              자주 묻는 질문.
            </h2>
          </div>

          <div className="faq">
            {FAQ_ENTRIES.map((entry, i) => {
              const isOpen = openFaq === i;
              const num = String(i + 1).padStart(2, "0");
              return (
                <div key={i} className={`faq__item${isOpen ? " is-open" : ""}`}>
                  <button
                    className="faq__q"
                    onClick={() => toggleFaq(i)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq__q-num">{num}</span>
                    <span className="faq__q-text break-keep">{entry.q}</span>
                    <span className="faq__q-icon">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                  <div className="faq__a">
                    <div>
                      <div className="faq__a-inner break-keep">{entry.a}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
           9. Final CTA
           ============================================================ */}
      <section className="endcta">
        <h2 className="display-lg break-keep">
          1주 안에,<br />
          <b>검색에 잡히는 사이트</b>를 가져보세요.
        </h2>
        <p className="break-keep">새 고객은 오늘도 구글과 챗지피티에 물고 있습니다.</p>
        <div className="endcta__buttons">
          <Link
            className="btn btn--lg"
            href="/order"
            style={{
              background: "var(--color-electric-green)",
              color: "var(--color-rich-violet)",
            }}
          >
            14,900원에 시작하기
          </Link>
          <a
            className="btn btn--lg btn--ghost"
            href="#portfolio"
            style={{
              borderColor: "rgba(255,255,255,.4)",
              color: "#fff",
              background: "transparent",
            }}
          >
            포트폴리오 먼저 보기
          </a>
        </div>
        <div className="endcta__small">
          * 결제는 크몽 플랫폼을 통해 안전하게 진행됩니다.
        </div>
      </section>

      {/* ============================================================
           Footer
           ============================================================ */}
      <footer className="foot">
        <div className="foot__inner">
          <div>
            <div className="foot__brand">
              <span className="foot__brand-mark">뚝</span>
              <span className="foot__brand-name">뚝딱페이지</span>
            </div>
            <div className="foot__meta">
              © 2026 뚝딱페이지. All rights reserved.<br />
              <b>통신판매업 신고</b>: 2025-대구남구-0558<br />
              <b>이메일</b>:{" "}
              <a href="mailto:hello@ddpage.kr">hello@ddpage.kr</a>
            </div>
          </div>
          <div>
            <div className="foot__links">
              <a href="#">환불 정책</a>
              <a href="#">개인정보 처리방침</a>
              <a href="#">이용약관</a>
              <a href="#">사업자 정보</a>
            </div>
          </div>
        </div>
        <div className="foot__bottom">
          <span className="break-keep">
            뚝딱페이지는 1인 사업자와 소상공인을 위한 랜딩페이지 서비스입니다.
          </span>
          <span>Made with Adora design system.</span>
        </div>
      </footer>
    </div>
  );
}
