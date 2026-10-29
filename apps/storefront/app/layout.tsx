import type { Metadata } from "next";
import "./globals.css";
import { indexingEnabled, siteOrigin } from "../lib/seo";
export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  robots: { index: indexingEnabled(), follow: indexingEnabled() },
  openGraph: {
    type: "website",
    locale: "az_AZ",
    siteName: "Brend House",
    title: "Brend House",
    description: "Gözəl həyat, gözəl geyimlə başlayır!",
  },
  title: "Brend House",
  description: "Gözəl həyat, gözəl geyimlə başlayır!",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="az">
      <body>{children}</body>
    </html>
  );
}
