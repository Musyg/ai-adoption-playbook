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
    "Evidence-gated AI adoption for independent work, organizations, nonprofits, and public services.";

  return {
    metadataBase,
    title: {
      default: "AI Adoption Playbook",
      template: "%s · AI Adoption Playbook",
    },
    description,
    openGraph: {
      title: "AI Adoption Playbook",
      description: "Evidence before autonomy — a visual path from idea to governed production.",
      images: [
        {
          url: image,
          width: 1732,
          height: 912,
          alt: "AI Adoption Playbook — Evidence before autonomy.",
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
    icons: { icon: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
