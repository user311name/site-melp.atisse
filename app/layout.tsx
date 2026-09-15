import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MELP.ATISSE — Pâtisserie artisanale & Cheffe privée",
  description:
    "MELP.ATISSE — Pâtisserie artisanale, créations sur mesure et cuisine privée à La Plaine-sur-Mer et alentours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}