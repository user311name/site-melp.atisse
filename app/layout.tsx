import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";

export const metadata: Metadata = {
  title: "Melp.atisse — Pâtisserie artisanale à La Plaine-sur-Mer",
  description:
    "Pâtisseries artisanales, ateliers gourmands, traiteur et cheffe privée à La Plaine-sur-Mer et dans le Pays de Retz.",
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
