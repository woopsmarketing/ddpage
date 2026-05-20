/**
 * FAQPage schema.
 *
 * 페이지에 실제로 보이는 FAQ 데이터를 인자로 받아 schema 객체로 변환.
 * 빈 배열이면 null 반환 → 호출자가 `.filter(Boolean)` 으로 제거.
 *
 * 설계 (D-18 — page-owns-data 패턴):
 * - 자동 주입 안 함. ClientConfig.faq 를 통째로 박는 동작 제거됨.
 * - 페이지가 *자기 화면에 표시하는* FAQ 데이터로만 호출.
 * - 호출 패턴:
 *     const FAQ_ITEMS = [{ q: "...", a: "..." }, ...];
 *     <JsonLd data={[..., faqSchema(FAQ_ITEMS)].filter(Boolean)} />
 *     ...<FAQSection items={FAQ_ITEMS} />
 *
 * Speakable 제외: cssSelector 가 실제 페이지 DOM 과 매치 안 되면 Google
 * Rich Results 에 경고가 뜨고, 한국어 음성 비서 인용 활용도 미미.
 */
export function faqSchema(
  faq: ReadonlyArray<{ q: string; a: string }>,
) {
  if (faq.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ko-KR",
    mainEntity: faq.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}
