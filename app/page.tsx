import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPageMetadata } from "@/lib/seo/helpers";
import { loadClient } from "@/lib/seo/loader";
import JsonLd from "@/components/JsonLd";
import { businessTypeSchema, faqSchema } from "@/lib/seo/schemas";
import HomeClient from "./HomeClient";

// 메인 페이지 FAQ — preview.html 의 8개 아코디언 콘텐츠 그대로
// (D-18 page-owns-data 패턴: 화면 = schema 동일 데이터)
const FAQ_ITEMS = [
  {
    q: "정말 14,900원에 다 되나요?",
    a: "네. 사이트 제작, 호스팅, SSL 인증서, 검색 노출 최적화, 서브도메인까지 모두 포함된 가격입니다. 추가 비용은 없습니다.",
  },
  {
    q: "사이트 만들기 얼마나 걸리나요?",
    a: "올인원 패키지 기준 신청 후 1~2시간 안에 시안을 받아보실 수 있습니다. 수정 요청 후 최종 배포까지 통상 1~3일 내 완료됩니다.",
  },
  {
    q: "도메인은 어떻게 되나요?",
    a: "기본형은 서브도메인(yourname.ddpage.kr)이 무료 제공됩니다. 원하시는 커스텀 도메인(예: yourname.com)도 본인 명의로 구매하신 후 무료로 연결 지원해드립니다.",
  },
  {
    q: "수정은 몇 번까지 가능한가요?",
    a: "1회의 무료 수정이 포함됩니다 (텍스트·이미지 5개 이내). 추가 수정은 건당 5,000원, 새 페이지 추가는 별도 견적입니다.",
  },
  {
    q: "구독 해지 후에는 어떻게 되나요?",
    a: "해지 시점 즉시 사이트가 비공개 처리되며, 30일 후 완전 폐기됩니다. 콘텐츠 원본은 고객님 소유이므로 해지 전 요청 시 백업해드립니다.",
  },
  {
    q: "검색 노출도 정말 다 해주나요?",
    a: "네. 구글·네이버 검색 최적화, 챗지피티·클로드 같은 AI 답변엔진 노출 최적화, 모바일 성능 최적화까지 모두 자동 적용됩니다. 일반 제작 업체에서 별도 30만원 이상 받는 작업입니다.",
  },
  {
    q: "결제는 어떻게 하나요?",
    a: "현재 MVP 단계로, 크몽 플랫폼을 통해 결제와 운영이 진행됩니다. 자체 결제 시스템과 정기 결제는 이후 도입 예정입니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "제작 시작 전 24시간 이내 100% 환불, 시안 전달 전 50% 환불이 가능합니다. 시안 전달 후에는 디지털 콘텐츠 특성상 환불이 어렵습니다. 서비스 이용료의 환불·해지 절차는 크몽 플랫폼 정책을 따릅니다.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    slug: "ddpage",
    pathname: "/",
    fallback: {
      title: "구글에 노출되고, 챗지피티가 추천하는 사이트 — 14,900원",
      description:
        "검색에서도, AI 답변에서도 노출되는 사이트. 랜딩페이지 한 장으로 사업의 매출 동선을 만듭니다. 출시 기념 14,900원.",
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
        data={[businessTypeSchema(config, host), faqSchema(FAQ_ITEMS)].filter(
          Boolean,
        )}
      />
      <HomeClient faqItems={FAQ_ITEMS} />
    </>
  );
}
