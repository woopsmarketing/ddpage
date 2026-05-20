import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import { loadClient } from "@/lib/seo/loader";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { getPortfolio } from "@/lib/portfolios";
import SalesLandingClient from "./SalesLandingClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/portfolio/sales",
    fallback: {
      title: "세일즈/구매 전환형",
      description:
        "롱폼 스토리텔링으로 정보성 상품·온라인 강의의 구매 전환을 끌어내는 랜딩 샘플.",
    },
  });
}

export default async function Page() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const config = await loadClient("ddpage");
  const entry = getPortfolio("sales");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "포트폴리오", pathname: "/portfolio" },
            { name: entry?.title ?? "세일즈/구매 전환형", pathname: "/portfolio/sales" },
          ]),
          faqSchema(config),
        ].filter(Boolean)}
      />
      <SalesLandingClient />
    </>
  );
}
