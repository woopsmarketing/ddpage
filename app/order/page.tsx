import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/order",
    fallback: {
      title: "주문하기",
      description:
        "뚝딱페이지 랜딩페이지 호스팅 주문. 월 14,900원으로 사이트 제작·호스팅·SEO/AEO·서브도메인까지 모두 포함됩니다.",
    },
  });
}

export default async function OrderPage() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(host, [
            { name: "홈", pathname: "/" },
            { name: "주문하기", pathname: "/order" },
          ]),
        ]}
      />
      <main className="flex min-h-screen items-center justify-center p-8">
        <h1 className="text-2xl font-semibold">Order</h1>
      </main>
    </>
  );
}
