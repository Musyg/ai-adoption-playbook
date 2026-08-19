import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);
  const image = new URL("/og.png", metadataBase).toString();
  const description =
    "A practical playbook to choose the right AI integration, run a real pilot, measure gains, and govern business agents safely.";

  return {
    metadataBase,
    title: {
      default: "AI Adoption Playbook",
      template: "%s · AI Adoption Playbook",
    },
    description,
    openGraph: {
      title: "AI Adoption Playbook",
      description: "Choose the right AI integration, test it on real work, measure the result, and govern the move to production.",
      images: [
        {
          url: image,
          width: 1732,
          height: 912,
          alt: "AI Adoption Playbook: evidence before autonomy.",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI Adoption Playbook",
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
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
