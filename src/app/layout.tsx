import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phare — Espace client",
  description: "Vos posts LinkedIn, chaque semaine.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-bg-base text-t1 antialiased">{children}</body>
    </html>
  );
}
