import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS 홈 화면 아이콘 (180×180).
 * dark-violet 톤 유지. 라운드 사각형은 iOS 가 자동 클립하므로
 * borderRadius 는 부드러운 시각 가이드 정도로만 부여.
 */
export default function AppleIcon() {
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
          fontSize: 110,
          fontWeight: 700,
          letterSpacing: "-0.05em",
          borderRadius: 40,
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
