import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl, siteUrlFor } from "./site-url";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const image = siteUrlFor("/og.png");
  const description =
    "A practical playbook to choose the right AI integration, run a real pilot, measure gains, and govern business agents safely.";

  return {
    ...(siteUrl ? { metadataBase: new URL(`${siteUrl}/`) } : {}),
    title: {
      default: "AI Adoption Playbook",
      template: "%s · AI Adoption Playbook",
    },
    description,
    openGraph: {
      title: "AI Adoption Playbook",
      description: "Choose the right AI integration, test it on real work, measure the result, and govern the move to production.",
      ...(image ? { images: [{ url: image, width: 1732, height: 912, alt: "AI Adoption Playbook: evidence before autonomy." }] } : {}),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Adoption Playbook",
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: {
      index: Boolean(siteUrl),
      follow: Boolean(siteUrl),
      googleBot: {
        index: Boolean(siteUrl),
        follow: Boolean(siteUrl),
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang=/(?:^|\\/)fr(?:\\/|$)/.test(location.pathname)?'fr':'en'" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
