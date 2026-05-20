import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import { getPortfolio } from "@/lib/portfolios";
import ProductLandingClient from "./ProductLandingClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/portfolio/product",
    fallback: {
      title: "상품/서비스 소개형",
      description:
        "SaaS·앱·서비스의 가치를 전달하고 가입·데모 전환을 만드는 랜딩 샘플.",
    },
  });
}

export default async function Page() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const entry = getPortfolio("product");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "포트폴리오", pathname: "/portfolio" },
            { name: entry?.title ?? "상품/서비스 소개형", pathname: "/portfolio/product" },
          ]),
        ]}
      />
      <ProductLandingClient />
    </>
  );
}
