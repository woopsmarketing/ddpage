// Server-only JSON-LD renderer.
//
// Renders one `<script type="application/ld+json">` tag per schema entry, as
// recommended by Google (one schema per script). Callers can pass `null` /
// `undefined` entries and they will be filtered out — but it is cleaner to
// `.filter(Boolean)` on the call site so the `data` array stays meaningful.
//
// IMPORTANT: this file MUST NOT carry `'use client'` — JSON-LD is rendered for
// crawlers and so has to live in the SSR HTML payload.

export default function JsonLd({ data }: { data: unknown[] }) {
  const items = data.filter((d): d is object => d !== null && d !== undefined);
  return (
    <>
      {items.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
