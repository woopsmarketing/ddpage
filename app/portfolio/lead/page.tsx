import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getPortfolio } from "@/lib/portfolios";
import LeadLandingClient from "./LeadLandingClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/portfolio/lead",
    fallback: {
      title: "리드/DB 수집형",
      description:
        "이메일 한 줄로 사전예약·뉴스레터 가입을 받는 단일 액션 랜딩 샘플.",
    },
  });
}

export default async function Page() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const entry = getPortfolio("lead");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "포트폴리오", pathname: "/portfolio" },
            { name: entry?.title ?? "리드/DB 수집형", pathname: "/portfolio/lead" },
          ]),
        ]}
      />
      <LeadLandingClient />
    </>
  );
}
