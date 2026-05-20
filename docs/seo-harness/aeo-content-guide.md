# AEO 콘텐츠 작성 가이드

> 이 문서는 사이트 콘텐츠를 작성·수정할 때 AI 답변엔진(ChatGPT/Claude/Perplexity 등)이 잘 인용하도록 만드는 규칙을 정리합니다.

## 1. FAQPage schema 박기 — page-owns-data 패턴 (D-18)

**핵심 원칙**: FAQ 섹션이 *화면에 실제로 표시되는* 페이지에서만 schema를 박는다. 자동 주입 안 함 (페이지 콘텐츠와 schema 불일치 방지).

```tsx
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/seo/schemas";

// 1) 단일 데이터 소스 — 같은 배열이 화면과 schema 둘 다에 사용됨
const FAQ_ITEMS = [
  { q: "정말 월 14,900원에 다 되나요?", a: "네. SEO/AEO까지 모두 포함입니다." },
  { q: "사이트 만들기 얼마나 걸리나요?", a: "신청 후 1~2일 안에 시안 받으실 수 있습니다." },
  // ...
];

export default function Home() {
  return (
    <>
      {/* 2) schema는 화면과 같은 데이터로 */}
      <JsonLd data={[faqSchema(FAQ_ITEMS)].filter(Boolean)} />

      <main>
        {/* 3) 화면 렌더링 — 반드시 같은 Q&A 가 보이도록 */}
        <section id="faq">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </section>
      </main>
    </>
  );
}
```

규칙:
- `faqSchema(faq)` — 배열을 받아 schema 객체 반환. 빈 배열이면 `null` 반환 (`.filter(Boolean)` 로 제거).
- FAQ 데이터는 **반드시 화면에도 표시** 되어야 함. schema만 박고 화면 누락은 Google 가이드라인 위반.
- 페이지에 FAQ 없으면 `<JsonLd>` 에 `faqSchema(...)` 호출도 하지 마세요.

## 2. `data-speakable` 속성 (현재 비활성)

음성 비서(Google Assistant, Siri) 인용용 `data-speakable` 속성은 schema-agent가 자동 cssSelector 를 박는 패턴이었으나, 실제 페이지 DOM 과 매치 안 되는 경고가 자주 떠서 **D-18 에서 자동 주입 제거**.

부착해도 무해하나 현재 효과 없음. 필요하면 페이지가 직접 SpeakableSpecification schema 를 박는 패턴으로 v2 에서 재활성화 예정.

## 2. HowTo 3단계 패턴 (D-11)

H2 또는 H3 제목에 다음 패턴을 **3개 이상** 사용하면 schema-agent가 HowTo JSON-LD를 자동 감지·생성합니다. 상수 `HOWTO_MIN_STEPS=3` (lib/seo/constants.ts) 기준입니다.

지원 패턴:
- `1단계`, `2단계`, `3단계` ...
- `Step 1`, `Step 2`, `Step 3` ...
- `1.`, `2.`, `3.` ... (공백 포함 `1. 회원가입`)
- `첫 번째`, `두 번째`, `세 번째` ...

예시 (H3 3개로 HowTo 자동 감지):

```md
### 1단계. 신청 폼 작성

이메일, 사업 분야, 원하는 도메인을 입력하세요.

### 2단계. 시안 검토

1~2일 안에 디자인 시안을 받아보고 수정 요청을 보내세요.

### 3단계. 배포

최종 승인 후 24시간 내 사이트가 공개됩니다.
```

각 단계 바로 다음 `<p>` 단락이 step.text로 추출됩니다. 단계가 3개 미만이면 HowTo가 생성되지 않습니다 (리치 스니펫 부적격, D-11).

## 3. FAQ는 `config/clients/<slug>.json`에 추가

페이지에 FAQ를 하드코딩하지 말고 `config/clients/ddpage.json`의 `faq` 배열에 추가하세요. schema-agent가 FAQPage JSON-LD를 자동 생성하고, `/llms-full.txt`에도 FAQ 섹션이 자동 포함됩니다.

예시:

```json
"faq": [
  { "q": "정말 월 14,900원에 다 되나요?", "a": "네. 사이트 제작, 호스팅, SSL, SEO/AEO 풀세트가 모두 포함된 가격입니다." }
]
```

## 4. 답변 우선 단락 (Answer-First)

각 페이지/섹션의 첫 단락은 "결론 먼저, 부연 나중" 구조로 쓰세요. AI 답변엔진은 첫 100~200자에서 인용 후보를 뽑는 경향이 있습니다.

나쁜 예: "저희는 2024년부터 운영해 온 1인 사업자 전문 서비스로..."
좋은 예: "월 14,900원으로 1인 사업자 랜딩페이지를 호스팅합니다. 제작 1~2일."

## 5. `/llms.txt` / `/llms-full.txt`

`/llms.txt`와 `/llms-full.txt`는 자동 생성됩니다 (`app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`). 직접 편집하지 마세요. 콘텐츠를 늘리려면:

- `config/clients/<slug>.json`의 `pages.{home,portfolio,order}.{title,description}` 보강
- `lib/portfolios.ts`의 `description`·`designTone` 보강
- `faq` 배열 보강

llms-full.txt는 페이지당 4000자(`MAX_CHARS_PER_PAGE = 4000`)로 잘립니다. 초과분은 생략되니 가장 중요한 정보를 앞쪽에 두세요.

## 6. AI 크롤러 허용 정책

`config/clients/<slug>.json`의 `aeo.aiCrawlersAllow`로 제어됩니다 (기본값 `true`). `true`이면 `/llms.txt`에 "AI 답변엔진 활용 허용" 문구가 노출되며, infra-agent가 생성하는 `robots.txt`에서도 AI 크롤러 화이트리스트(GPTBot, ClaudeBot, PerplexityBot 등)가 허용됩니다.

## 7. 캐시

`/llms.txt` / `/llms-full.txt`는 ISR 1시간(`ISR_REVALIDATE_SECONDS = 3600`, D-12) + `stale-while-revalidate=86400`. JSON 변경 후 최대 1시간 뒤에 반영됩니다. 즉시 갱신이 필요하면 재배포하세요.
