# Core Web Vitals — 이미지 최적화 가이드

> 페이지 로딩 성능(LCP)·시각 안정성(CLS)·대역폭은 곧 SEO 순위와 직결된다.
> 새 페이지/콘텐츠를 추가할 때 아래 규칙을 따른다.

---

## 1. `next/image` 사용 (`<img>` 태그 대신)

`next/image`는 다음을 자동 처리한다:

- **포맷 변환**: AVIF / WebP 자동 서빙 (`next.config.ts`의 `images.formats` 설정)
- **lazy loading**: 뷰포트 밖 이미지는 자동 지연 로딩
- **responsive srcset**: 디바이스별 적절한 해상도 자동 생성

```tsx
import Image from "next/image";

// OK
<Image src="/portfolio/lead/hero.jpg" alt="…" width={1200} height={630} />

// NG — 최적화 우회
<img src="/portfolio/lead/hero.jpg" />
```

> `<img>` 태그는 ESLint 규칙(`@next/next/no-img-element`)으로도 경고된다. 예외가 정말 필요한 경우에만 주석으로 disable.

---

## 2. `priority` prop은 above-fold hero 이미지에만

LCP(Largest Contentful Paint) 측정 대상이 되는 이미지에만 `priority`를 부착한다.

- 페이지 첫 화면에 보이는 **단 한 장의** 핵심 이미지에만 사용
- 나머지 이미지에 `priority`를 남발하면 우선순위 의미가 사라지고, 초기 대역폭이 분산되어 LCP가 오히려 악화된다

```tsx
// 페이지 최상단 hero
<Image src="/hero.jpg" alt="…" width={1920} height={1080} priority />

// below-fold 이미지 — priority 없음
<Image src="/portfolio/02.jpg" alt="…" width={800} height={450} />
```

---

## 3. `width`, `height` 필수 — CLS 방지

`width` / `height` 누락 시 브라우저가 이미지 영역을 미리 계산할 수 없어 **레이아웃 시프트(CLS)** 가 발생한다.

```tsx
// OK — 실제 비율과 일치하는 width/height
<Image src="/article.jpg" alt="…" width={800} height={450} />

// NG — 누락 (Next.js가 빌드 에러로 막아주긴 함)
<Image src="/article.jpg" alt="…" />
```

### `fill` 모드를 쓸 때

부모 컨테이너에 `position: relative` + 명시적 크기가 필요하다.

```tsx
<div className="relative w-full aspect-[16/9]">
  <Image src="/banner.jpg" alt="…" fill className="object-cover" />
</div>
```

### Fallback 값 참조

`lib/seo/constants.ts`의 `CONTENT_IMG_FALLBACK = { width: 800, height: 450 }` —
`optimizeContentImages()` 헬퍼가 HTML 내 `<img>`에 폭/높이 누락 시 자동으로 채우는 값. 직접 작성하는 컴포넌트에는 *실제 비율 값*을 명시할 것.

---

## 4. `sizes` prop으로 반응형 처리

반응형 레이아웃에서 `sizes`를 지정하지 않으면 Next.js가 가장 큰 해상도의 이미지를 모든 뷰포트에 다운로드한다. 모바일에서 LCP가 크게 악화된다.

```tsx
// 데스크톱에서 절반 폭, 모바일에서 전체 폭
<Image
  src="/card.jpg"
  alt="…"
  width={1200}
  height={675}
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// 컨테이너가 항상 33% 폭이라면
<Image
  src="/thumb.jpg"
  alt="…"
  width={600}
  height={400}
  sizes="(max-width: 768px) 50vw, 33vw"
/>
```

---

## 5. `alt`는 비워두지 말 것

`alt`는 접근성(스크린 리더)과 이미지 검색 SEO에 모두 영향을 미친다.

- **의미 있는 이미지**: 무엇을 보여주는지 한 줄로 서술
- **장식용 이미지** (내용 없음): `alt=""` 빈 문자열을 *명시*. 빈 문자열은 누락과 다르다 — 스크린 리더가 건너뛴다.

```tsx
// OK
<Image src="/owner.jpg" alt="대표 김민수가 매장 입구에서 환영하는 모습" width={…} height={…} />

// OK — 장식
<Image src="/divider.svg" alt="" width={…} height={…} aria-hidden />

// NG — 누락
<Image src="/owner.jpg" width={…} height={…} />
```

### 자동 fallback (HTML 콘텐츠)

운영자가 작성한 HTML 본문에 `alt`가 누락된 `<img>`가 있을 경우, `lib/seo/helpers.ts`의 `optimizeContentImages(html, fallbackAlt)`가 페이지 제목으로 자동 채운다. 단, 페이지 제목은 일반적이므로 *명시적 alt 작성을 권장*한다.

---

## 6. 외부 이미지 호스트는 `next.config.ts`의 `remotePatterns`에 등록

외부 도메인의 이미지를 `next/image`로 쓰려면 해당 도메인을 `remotePatterns`에 등록해야 한다. 미등록 시 빌드 에러.

```ts
// next.config.ts
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    { protocol: "https", hostname: "cdn.example.com" },
    { protocol: "https", hostname: "images.unsplash.com" },
  ],
},
```

> 현재 1차 적용 단계에서는 `remotePatterns: []` (비어 있음). 클라이언트 사이트에 외부 호스트가 필요해지면 v2에서 `ClientConfig.images.remoteHosts` 필드를 통해 자동 동기화 예정.

---

## 체크리스트 — 새 이미지를 추가할 때

- [ ] `<img>` 대신 `next/image`의 `<Image>` 사용
- [ ] `width`, `height` 명시 (또는 `fill` + 부모 컨테이너 크기 지정)
- [ ] above-fold hero 1장에만 `priority` 부착
- [ ] 반응형 레이아웃이면 `sizes` 지정
- [ ] `alt` 작성 — 장식 이미지면 `alt=""` 명시
- [ ] 외부 호스트면 `next.config.ts`의 `remotePatterns`에 도메인 등록
- [ ] 이미지 원본 크기를 실제 표시 크기의 2배 이내로 — 과도하게 큰 원본은 변환 비용·대역폭 낭비

---

## 참고

- Next.js `next/image` 공식 문서: `node_modules/next/dist/docs/` 내 image 가이드 참조
- LCP 기준: 2.5초 이하 (Good), 4.0초 초과 (Poor)
- CLS 기준: 0.1 이하 (Good), 0.25 초과 (Poor)
