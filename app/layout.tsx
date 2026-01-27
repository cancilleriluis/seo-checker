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

const siteUrl = "https://seo-checker-three.vercel.app";
const siteName = "SEO Score Checker";
const siteDescription =
  "Free SEO score checker and GEO analysis tool. Audit any URL for meta tags, headings, structured data, AI readability, and get actionable fixes. Optimize for Google and AI search engines like ChatGPT and Perplexity.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} – Free SEO & GEO Analysis Tool`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "SEO checker",
    "SEO score",
    "GEO analysis",
    "AI search optimization",
    "meta tag checker",
    "structured data checker",
    "free SEO tool",
    "AI readability audit",
    "on-page SEO audit",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: `${siteName} – Free SEO & GEO Analysis Tool`,
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
    title: `${siteName} – Free SEO & GEO Analysis Tool`,
    description: siteDescription,
    images: ["/logo.png"],
  },
  alternates: {
    canonical: siteUrl,
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
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is an SEO score checker?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "An SEO score checker is a tool that analyzes a web page and rates its search engine optimization on a scale of 0 to 100. It evaluates meta tags, heading structure, image alt text, content quality, and more.",
            },
          },
          {
            "@type": "Question",
            name: "What is GEO (Generative Engine Optimization)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "GEO is the practice of optimizing web content so AI-powered search engines and language models can easily understand, extract, and cite it. It focuses on readability, entity richness, structured data, and FAQ patterns.",
            },
          },
          {
            "@type": "Question",
            name: "How does this tool work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Paste any public URL and the tool crawls the page to compute both an SEO score and a GEO score. It checks meta tags, headings, content structure, readability, entities, and structured data, then gives you a prioritized checklist of fixes.",
            },
          },
          {
            "@type": "Question",
            name: "Is the SEO Score Checker free to use?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, the SEO Score Checker is completely free. No login or account is required. Just paste a URL and get your report instantly.",
            },
          },
        ],
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
