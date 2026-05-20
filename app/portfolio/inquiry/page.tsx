import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getPortfolio } from "@/lib/portfolios";
import InquiryLandingClient from "./InquiryLandingClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/portfolio/inquiry",
    fallback: {
      title: "상담 문의형",
      description:
        "전문가 서비스의 신뢰를 쌓고 카톡·전화·폼으로 상담 문의를 받는 랜딩 샘플.",
    },
  });
}

export default async function Page() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const entry = getPortfolio("inquiry");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "포트폴리오", pathname: "/portfolio" },
            { name: entry?.title ?? "상담 문의형", pathname: "/portfolio/inquiry" },
          ]),
        ]}
      />
      <InquiryLandingClient />
    </>
  );
}
