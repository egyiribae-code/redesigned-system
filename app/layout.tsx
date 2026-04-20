import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ghana GPA Calculator | Academic Performance Tracker",
  description:
    "Track your academic performance with the Ghana GPA Calculator. Calculate semester GPA, cumulative GPA, and plan your path to academic success using the Ghana university grading scale.",
};

export const viewport: Viewport = {
  themeColor: "#040F2B",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${spaceMono.variable} bg-background`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
