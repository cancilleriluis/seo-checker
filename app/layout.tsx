import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://seo-checker.vercel.app";
const siteName = "SEO Score Checker";
const siteDescription =
  "Run instant SEO and GEO (AI-readability) audits on any URL. Check meta tags, headings, content structure, structured data, and get actionable recommendations so AI models can actually find your brand.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} – Free SEO & GEO Analysis`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} – Free SEO & GEO Analysis`,
    description: siteDescription,
    images: [
      {
        url: "/logo.png",
        width: 1024,
        height: 559,
        alt: `${siteName} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} – Free SEO & GEO Analysis`,
    description: siteDescription,
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}#website`,
        url: siteUrl,
        name: siteName,
        description: siteDescription,
        inLanguage: "en",
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}#webapp`,
        name: siteName,
        description: siteDescription,
        url: siteUrl,
        applicationCategory: "SEO Tool",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
