import type { Metadata } from "next";
import { headers } from "next/headers";
import { Noto_Sans_KR } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./main.css";
import { resolveClient } from "@/lib/seo/loader";
import {
  canonicalUrl,
  clientHost,
  ogImageUrl,
  siteUrl,
} from "@/lib/seo/helpers";
import {
  DEFAULT_LANG_HTML,
  DEFAULT_LOCALE_OG,
  OG_DIMENSIONS,
} from "@/lib/seo/constants";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";

// headers() 사용 → 동적 렌더링 (멀티테넌트 host 분기)
export const dynamic = "force-dynamic";

// 한국어 산세리프 디자인 폰트 (Pretendard Variable, self-hosted)
// CDN @import 으로 5MB 9개 weight 받던 것을 단일 2MB Variable 폰트로 교체 (D-25)
const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

// 라틴/숫자 fallback 폰트 — Noto Sans KR (Pretendard 가 못 잡는 글리프 대비)
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const config = await resolveClient(h);
  const host = clientHost(config);

  const defaultTitle = `${config.name} — ${config.tagline}`;
  const ogImage = ogImageUrl(host, {
    title: defaultTitle,
    theme: config.ogImage.theme,
  });

  return {
    metadataBase: new URL(siteUrl(host)),
    title: {
      default: defaultTitle,
      template: `%s | ${config.name}`,
    },
    description: config.description,
    keywords: [...config.keywords],
    authors: [{ name: config.name, url: siteUrl(host) }],
    creator: config.name,
    publisher: config.name,
    openGraph: {
      type: "website",
      siteName: config.name,
      locale: DEFAULT_LOCALE_OG,
      url: canonicalUrl(host, "/"),
      title: defaultTitle,
      description: config.description,
      images: [
        {
          url: ogImage,
          width: OG_DIMENSIONS.width,
          height: OG_DIMENSIONS.height,
          alt: defaultTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: config.description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl(host, "/"),
    },
    verification: {
      google: config.verification.google ?? undefined,
      other: config.verification.naver
        ? { "naver-site-verification": config.verification.naver }
        : undefined,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const config = await resolveClient(h);
  const host = clientHost(config);

  return (
    <html
      lang={DEFAULT_LANG_HTML}
      className={`${pretendard.variable} ${notoSansKr.variable} h-full antialiased scroll-smooth`}
    >
      <JsonLd
        data={[websiteSchema(config, host), organizationSchema(config, host)]}
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
