import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignBridge – AI Sign Language Interpreter Platform",
  description: "Real-time sign language interpretation powered by AI. Translate text, video, and live gestures into animated sign language. Supporting ASL, BSL, and more.",
  keywords: ["sign language", "ASL", "BSL", "interpreter", "accessibility", "AI", "computer vision"],
  openGraph: {
    title: "SignBridge – AI Sign Language Interpreter",
    description: "Real-time sign language interpretation for everyone",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
