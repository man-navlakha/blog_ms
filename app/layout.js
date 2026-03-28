import { JetBrains_Mono, Manrope, Sora } from "next/font/google";
import "./globals.css";
import AppwritePing from "@/components/AppwritePing";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
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
      className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppwritePing />
        {children}
      </body>
    </html>
  );
}
