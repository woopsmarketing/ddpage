import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import { loadClient } from "@/lib/seo/loader";
import JsonLd from "@/components/JsonLd";
import { businessTypeSchema, faqSchema } from "@/lib/seo/schemas";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/",
    fallback: {
      title: "검색에서 찾아오는 사이트, 월 14,900원에",
      description:
        "월 14,900원으로 SEO/AEO까지 포함된 1인 사업자 랜딩페이지 호스팅. 1~2일 안에 검색에서 찾아오는 사이트를 만들어드립니다.",
    },
  });
}

export default async function Home() {
  const h = await headers();
  const host = h.get("host") ?? "ddpage.kr";
  const config = await loadClient("ddpage");

  return (
    <>
      <JsonLd
        data={[businessTypeSchema(config, host), faqSchema(config)].filter(
          Boolean,
        )}
      />
      <main className="flex min-h-screen items-center justify-center p-8">
        <h1 className="text-2xl font-semibold">ddpage</h1>
      </main>
    </>
  );
}
