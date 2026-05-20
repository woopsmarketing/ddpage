# `app/(client)/` — 클라이언트 사이트 Route Group

이 폴더는 **클라이언트 사이트 라우트의 그룹 디렉토리**입니다.

`(client)`는 Next.js Route Group 표기 — URL에는 영향 없습니다.
- 폴더: `app/(client)/gildongsalon/page.tsx`
- URL: `/gildongsalon` (또는 호스트 라우팅을 통해 `gildongsalon.ddpage.kr/`)

## 어떻게 페이지가 들어오나

직접 수동으로 작성하지 않고 **`/client-integrate` 슬래시커맨드**가 자동 생성합니다.

```
/client-integrate <slug> <source-folder>

예: /client-integrate gildongsalon ./client1
```

내부 동작:
1. `./client1/` 에 있는 Claude Design 결과물(page.tsx + preview.html + 이미지)을 분석
2. `app/(client)/<slug>/page.tsx` + `<Slug>Client.tsx` 생성 (D-02 B안)
3. 에셋을 `public/clients/<slug>/` 로 복사
4. `config/clients/<slug>.json` 자동 생성 (`client-intake` 에이전트)
5. `/seo-apply <slug>` 자동 호출 → SEO/AEO 하네스 적용
6. `validator` 로 검증

## 호스트 라우팅 (proxy.ts)

`<slug>.ddpage.kr/*` → `app/(client)/<slug>/*` 로 자동 rewrite 됩니다.
구현: `/proxy.ts`. 결정 D-19, D-20 참조.

## 직접 접근

개발/미리보기용으로 메인 도메인에서도 접근 가능합니다:
- `ddpage.kr/<slug>` → 같은 페이지 (rewrite 없이 직접 매치)

## 새 클라이언트 추가 후 체크리스트

- [ ] `npm run build` 통과
- [ ] `git status` 로 변경 파일 확인
- [ ] Vercel 에 `<slug>.ddpage.kr` 자동 라우팅 확인 (와일드카드 도메인 `*.ddpage.kr` 이미 등록됨)
- [ ] Google Search Console 에 `<slug>.ddpage.kr` 속성 등록 (선택)
- [ ] git commit + push

자세한 설계는 `docs/seo-harness/99-decisions.md` D-19/D-20/D-21 참조.
