---
description: Convert a claude-design prototype in projects/<id>/ to a production Next.js 16 site with full SEO/AEO. Runs through 6 phases with checkpoints.
argument-hint: <project-id>
---

# /build-site $ARGUMENTS

You are orchestrating the site-build pipeline. The single argument is the project id (e.g., `cok-tv`).

## Pre-flight

1. Parse `<id>` from `$ARGUMENTS`. If empty: tell the user "사용법: `/build-site <project-id>`" and stop.
2. Verify `projects/<id>/` exists. If not: tell the user and stop.
3. Read `pipeline/schemas/brief.schema.json` to know what intake will need.
4. Initialize `projects/<id>/_state/progress.json` with all 6 phases in `pending` status, `started_at` = current ISO 8601 KST.

## Reference docs

Before starting, internalize:
- `PIPELINE_PLAN.md` — overall design
- `pipeline/schemas/*.schema.json` — data contracts
- `pipeline/scripts/*` — what the deterministic tools do
- `pipeline/templates/*` — what they emit

## Phase execution

For each phase, after completion:
1. Update `_state/progress.json`: set the phase to `completed`, add `files: [...]`, `completed_at`.
2. Print a **5-line summary** + bullet list of generated files.
3. Ask the user: **"이 phase 결과 OK? 다음으로 진행할까요? (yes / no / preview)"**
4. On `yes` → next phase. On `no` → stop, leave state intact. On `preview` → print the first 30 lines of each generated file, then re-ask.

### Phase 0 — Scaffold + Foundation

1. Invoke **intake** agent with `<id>` and any user-supplied free-text already in the conversation. → produces `_state/brief.json`.
2. Run `bash pipeline/scripts/scaffold.sh <id>` → creates `site/` skeleton.
3. Invoke **prototype-analyzer** agent → produces `_state/analysis.json` and `_state/style-guide.json`.
4. Run `node pipeline/scripts/gen-config.js <id>` → site-config.ts.
5. Run `node pipeline/scripts/gen-tokens.js <id>` → globals.css.
6. Invoke **page-converter** (mode = `shared-components`) → NavBar, Footer, Logo, Icons + ui/Button, Section, Tag.
7. Checkpoint.

### Phase 1 — Pages

For each entry in `analysis.pages[]` (filter out `is_dynamic` for now — blog detail handled in Phase 3):
- Invoke **page-converter** (mode = `page-conversion`, route, source, title_hint) **in parallel** (one Agent call per page in the same message).

If `has_blog=true` AND `analysis.pages` contains a dynamic `/blog/[slug]` entry, also convert it now with `page-conversion` mode (basic version; UX enhanced in Phase 3).

Checkpoint.

### Phase 2 — SEO

1. Run `node pipeline/scripts/gen-domain-infra.js <id>` → sitemap, robots, llms.txt, og-image, twitter-image.
2. Run `node pipeline/scripts/gen-jsonld-lib.js <id>` → schema.ts, JsonLd.tsx.
3. Invoke **seo-injector** (mode = `jsonld-inject`) for groups `layout`, `blog`, `content` **in parallel**.
   - Skip `blog` group if `has_blog=false`.

Checkpoint.

### Phase 3 — AEO + Blog UX

Skip entirely if `analysis.has_blog === false`. Update progress.json with `skip_reason: "has_blog=false"`.

If `has_blog`:
1. Invoke **content-enricher** agent → enrich `lib/blog-posts.ts` with publishedAt/updatedAt/tags + helpers.
2. Invoke **page-converter** (mode = `blog-ux-enhance`) → augment `app/blog/[slug]/page.tsx`.

Checkpoint.

### Phase 4 — Performance + Polish

1. Invoke **image-migrator** for groups `home`, `blog`, `other` **in parallel**.
   - Skip `blog` group if `has_blog=false`.
2. If `brief.options.self_host_images` is true:
   - Run `bash pipeline/scripts/download-images.sh <id>` → produces `_state/image-map.json`.
   - Run `node pipeline/scripts/swap-image-urls.js <id>` → rewrites code to local paths.
3. If `has_blog=true`: invoke **seo-injector** (mode = `per-post-og`) → blog/[slug]/opengraph-image.tsx.
4. Run `node pipeline/scripts/gen-favicons.js <id>` → icon, apple-icon, manifest.
5. If `brief.options.ga4` is true: run `node pipeline/scripts/gen-analytics.js <id>` → Analytics component + layout patch.

Checkpoint.

### Phase 5 — Verify

1. Invoke **validator** agent.
2. Print the final report (validator produces the format).

End. No further checkpoint.

## Parallel invocation pattern

When invoking the same agent multiple times in parallel (page-converter for N pages, seo-injector for 3 groups, image-migrator for 3 groups), put all Agent tool calls in a **single message**. The framework will run them concurrently.

## Error handling

- If any subagent reports a fatal error (e.g., prototype-analyzer can't find any page source), stop and report. Mark the current phase as `failed` in progress.json with `error: "<reason>"`.
- If a deterministic script (gen-*) exits non-zero, stop and report. Same handling.
- Do **not** silently retry or invent fallbacks.

## Resume semantics (v1 — limited)

If `_state/progress.json` already exists when `/build-site <id>` is invoked, ask the user:
```
이미 진행 중인 빌드가 있습니다. 다음 옵션 중 선택:
  1. 이어서 (다음 pending phase 부터)
  2. 처음부터 (site/ 와 _state/ 모두 삭제 후 재시작)
  3. 취소
```

For option 2, run `rm -rf projects/<id>/site projects/<id>/_state` and restart.

## Initial output

When `/build-site <id>` is invoked, your first response to the user (before any tool call) should be:

```
═══════════════════════════════════════════════════
  /build-site <id>
═══════════════════════════════════════════════════

다음 단계로 진행합니다:
  Phase 0 — Scaffold + Foundation
  Phase 1 — Pages
  Phase 2 — SEO
  Phase 3 — AEO + Blog UX (블로그 감지 시)
  Phase 4 — Performance + Polish
  Phase 5 — Verify

각 phase 후 체크포인트가 있습니다 (yes/no/preview).

intake 시작합니다...
```

Then proceed with Phase 0.
