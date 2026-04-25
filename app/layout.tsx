import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WynnMarketSearch — searchable market GUI for Wynncraft",
  description:
    "A Fabric mod that replaces Wynncraft's market text prompt with a searchable GUI backed by a daily-cached item database.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
