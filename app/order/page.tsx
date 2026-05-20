import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schemas";
import OrderForm from "./OrderForm";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/order",
    fallback: {
      title: "주문하기",
      description:
        "시안 디자인의 톤과 사업 콘텐츠만 알려주시면, 신청 후 약 1시간 안에 시안이 도착합니다. 올인원 패키지 14,900원.",
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
      <OrderForm />
    </>
  );
}
