import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // 클라이언트가 외부 이미지 호스트를 쓰면 ClientConfig 확장 후 동적으로 채울 예정 (v2).
    remotePatterns: [],
  },
};

export default nextConfig;
