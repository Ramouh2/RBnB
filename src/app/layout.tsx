import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RBNB_SITE } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(RBNB_SITE.url),
  title: {
    default: RBNB_SITE.title,
    template: `%s · ${RBNB_SITE.name}`,
  },
  description: RBNB_SITE.description,
  applicationName: RBNB_SITE.name,
  openGraph: {
    type: "website",
    siteName: RBNB_SITE.name,
    title: RBNB_SITE.title,
    description: RBNB_SITE.description,
    locale: RBNB_SITE.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: RBNB_SITE.title,
    description: RBNB_SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: RBNB_SITE.themeColor,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
