import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import "./main.css";
import { loadClient } from "@/lib/seo/loader";
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

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ROOT_SLUG = "ddpage";

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadClient(ROOT_SLUG);
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
  const config = await loadClient(ROOT_SLUG);
  const host = clientHost(config);

  return (
    <html
      lang={DEFAULT_LANG_HTML}
      className={`${notoSansKr.variable} h-full antialiased scroll-smooth`}
    >
      <JsonLd
        data={[websiteSchema(config, host), organizationSchema(config, host)]}
      />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
