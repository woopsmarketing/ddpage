import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getPortfolio } from "@/lib/portfolios";
import EventLandingClient from "./EventLandingClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/portfolio/event",
    fallback: {
      title: "이벤트/예약형",
      description:
        "컨퍼런스·세미나·클래스 신청을 받는 이벤트형 랜딩 샘플.",
    },
  });
}

export default async function Page() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const entry = getPortfolio("event");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "포트폴리오", pathname: "/portfolio" },
            { name: entry?.title ?? "이벤트/예약형", pathname: "/portfolio/event" },
          ]),
        ]}
      />
      <EventLandingClient />
    </>
  );
}
