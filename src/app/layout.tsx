import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RugSentinel — Detect Rug Pulls Before They Happen",
  description:
    "Real-time Web3 security analytics platform. Analyze any crypto token smart contract and generate an AI-powered rug-pull risk score.",
  keywords: ["rug pull", "crypto security", "token analysis", "Web3", "DeFi", "smart contract"],
  openGraph: {
    title: "RugSentinel",
    description: "Detect rug pulls before they happen",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-background text-slate-200 antialiased">{children}</body>
    </html>
  );
}
