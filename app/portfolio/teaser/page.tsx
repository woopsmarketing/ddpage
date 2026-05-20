import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getPortfolio } from "@/lib/portfolios";
import TeaserLandingClient from "./TeaserLandingClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/portfolio/teaser",
    fallback: {
      title: "사전예약/티저형",
      description:
        "신규 브랜드·라이프스타일 제품의 런칭 전 기대감을 만들고 이메일 사전예약을 받는 Coming Soon 랜딩 샘플.",
    },
  });
}

export default async function Page() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const entry = getPortfolio("teaser");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "포트폴리오", pathname: "/portfolio" },
            { name: entry?.title ?? "사전예약/티저형", pathname: "/portfolio/teaser" },
          ]),
        ]}
      />
      <TeaserLandingClient />
    </>
  );
}
