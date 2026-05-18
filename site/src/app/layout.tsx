import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AudieVit",
  description: "AI vocale locale - Riconoscimento vocale e assistente personale",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
