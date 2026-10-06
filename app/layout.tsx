import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter-tight";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Shell from "@/components/providers/Shell";
import { SITE } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: SITE.title,
    template: "%s — AsifWorks",
  },
  description: SITE.description,
  applicationName: "AsifWorks",
  keywords: [
    "creative web design",
    "interactive websites",
    "motion design",
    "GSAP",
    "Next.js",
    "digital studio",
    "Doha",
    "web development",
  ],
  authors: [{ name: "AsifWorks" }],
  creator: "AsifWorks",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "AsifWorks",
    title: SITE.title,
    description: SITE.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#08080a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
