import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppwritePing from "@/components/AppwritePing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.mechanicsetu.tech";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mechanic Setu Blog",
    template: "%s | Mechanic Setu",
  },
  description:
    "Official Mechanic Setu blog for roadside assistance guides, vehicle care tips, and local mechanic insights.",
  keywords: [
    "Mechanic Setu",
    "roadside assistance",
    "vehicle maintenance",
    "car repair tips",
    "local mechanics",
    "auto care blog",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Mechanic Setu Blog",
    title: "Mechanic Setu Blog",
    description:
      "Official Mechanic Setu blog for roadside assistance guides, vehicle care tips, and local mechanic insights.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mechanic Setu Blog",
    description:
      "Official Mechanic Setu blog for roadside assistance guides, vehicle care tips, and local mechanic insights.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppwritePing />
        {children}
      </body>
    </html>
  );
}
