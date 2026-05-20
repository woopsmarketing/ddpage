import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import { loadClient } from "@/lib/seo/loader";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schemas";
import { getPortfolio } from "@/lib/portfolios";
import BrandLandingClient from "./BrandLandingClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/portfolio/brand",
    fallback: {
      title: "브랜드/포트폴리오형",
      description:
        "개인·스튜디오의 정체성과 작업을 보여주고 의뢰로 연결하는 다크 무드 랜딩 샘플.",
    },
  });
}

export default async function Page() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const config = await loadClient("ddpage");
  const entry = getPortfolio("brand");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "포트폴리오", pathname: "/portfolio" },
            { name: entry?.title ?? "브랜드/포트폴리오형", pathname: "/portfolio/brand" },
          ]),
          faqSchema(config),
        ].filter(Boolean)}
      />
      <BrandLandingClient />
    </>
  );
}
