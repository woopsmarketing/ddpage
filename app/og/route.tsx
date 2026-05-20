import { ImageResponse } from "next/og";
import { OG_DIMENSIONS } from "@/lib/seo/constants";

// next/og 는 nodejs runtime 에서 안정적. (Next.js 16 + Edge 호환성 이슈 회피)
export const runtime = "nodejs";
// searchParams 로 결과가 달라지므로 dynamic. CDN 캐싱은 응답 헤더로 제어.
export const dynamic = "force-dynamic";

type ThemeKey =
  | "dark-violet"
  | "light-neutral"
  | "warm-peach"
  | "azure-blue"
  | "fire-orange"
  | "deep-indigo"
  | "dot-grid";

const THEMES: Record<ThemeKey, { bg: string; fg: string; accent: string }> = {
  "dark-violet": {
    bg: "linear-gradient(135deg, #0a0b0d 0%, #4c1d95 100%)",
    fg: "#ffffff",
    accent: "#c4b5fd",
  },
  "light-neutral": {
    bg: "#fafafa",
    fg: "#0a0b0d",
    accent: "#737373",
  },
  "warm-peach": {
    bg: "linear-gradient(135deg, #fff5eb 0%, #f97316 100%)",
    fg: "#0a0b0d",
    accent: "#9a3412",
  },
  "azure-blue": {
    bg: "linear-gradient(135deg, #f0f9ff 0%, #0284c7 100%)",
    fg: "#ffffff",
    accent: "#bae6fd",
  },
  "fire-orange": {
    bg: "linear-gradient(135deg, #1a1a1a 0%, #ea580c 100%)",
    fg: "#ffffff",
    accent: "#fed7aa",
  },
  "deep-indigo": {
    bg: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)",
    fg: "#ffffff",
    accent: "#a5b4fc",
  },
  "dot-grid": {
    bg: "#ffffff",
    fg: "#0a0b0d",
    accent: "#a3a3a3",
  },
};

const DEFAULT_THEME: ThemeKey = "dark-violet";

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "뚝딱페이지").slice(0, 120);
  const subtitle = (searchParams.get("subtitle") ?? "").slice(0, 180);
  const themeKey = (searchParams.get("theme") ?? DEFAULT_THEME) as ThemeKey;
  const theme = THEMES[themeKey] ?? THEMES[DEFAULT_THEME];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: theme.bg,
          color: theme.fg,
          fontFamily:
            "system-ui, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 500,
            letterSpacing: "0.08em",
            opacity: 0.75,
            color: theme.accent,
            marginBottom: 32,
            textTransform: "uppercase",
          }}
        >
          ddpage.kr
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            display: "flex",
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: 32,
              marginTop: 28,
              opacity: 0.8,
              lineHeight: 1.4,
              display: "flex",
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    ),
    {
      width: OG_DIMENSIONS.width,
      height: OG_DIMENSIONS.height,
    },
  );
}
