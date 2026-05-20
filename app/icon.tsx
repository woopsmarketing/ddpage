import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * 동적 파비콘.
 * 1차 ddpage 의 ogImage.theme("dark-violet") 톤과 통일.
 * 클라이언트별 분기는 v2 (params 받는 형태로 확장).
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #0a0b0d 0%, #4c1d95 100%)",
          color: "white",
          fontSize: 20,
          fontWeight: 700,
          letterSpacing: "-0.05em",
          fontFamily:
            "system-ui, -apple-system, 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        }}
      >
        뚝
      </div>
    ),
    { ...size },
  );
}
