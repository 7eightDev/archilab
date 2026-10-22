import type { Metadata } from "next";
import { Montserrat, Oswald } from "next/font/google";
import { heroSlides } from "@/app/_components/site/content";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const title = "Archilab — Architetto a Fondi (LT) | Progetto, interni e pratiche";
const description =
  "Arch. Maria Pezzella, Fondi (LT): architettura, interni e pratiche urbanistiche con un solo architetto, dalla prima idea alla consegna delle chiavi.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    locale: "it_IT",
    siteName: "Archilab",
    images: [{ url: heroSlides[0].image.src, alt: heroSlides[0].image.alt }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${oswald.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
