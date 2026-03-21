import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppwritePing from "@/components/AppwritePing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mechanic Setu Blog",
  description:
    "Official Mechanic Setu blog for roadside assistance guides, vehicle care tips, and local mechanic insights.",
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
