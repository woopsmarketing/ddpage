import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import { loadClient } from "@/lib/seo/loader";
import { PORTFOLIOS } from "@/lib/portfolios";
import JsonLd from "@/components/JsonLd";
import {
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
} from "@/lib/seo/schemas";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/portfolio",
    fallback: {
      title: "포트폴리오",
      description:
        "뚝딱페이지에서 제공하는 8가지 랜딩페이지 유형 샘플 — 리드 수집, 상담 문의, 상품 소개, 브랜드, 이벤트, 세일즈, 티저, 1인 프로필.",
    },
  });
}

export default async function PortfolioListPage() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const config = await loadClient("ddpage");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "포트폴리오", pathname: "/portfolio" },
          ]),
          itemListSchema(config, host),
          faqSchema(config),
        ].filter(Boolean)}
      />
      <main className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Portfolio</h1>
          <p className="mt-3 text-sm sm:text-base text-neutral-600">
            뚝딱페이지에서 제공하는 랜딩페이지 유형 샘플입니다.
          </p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTFOLIOS.map((card) => (
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
    </>
  );
}
