import type { Metadata } from "next";
import { Newsreader, Inter, IBM_Plex_Mono, Bungee, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import "./studio.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungee",
  display: "swap",
});

const grotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Emris — We make games",
    template: "%s — Emris",
  },
  description:
    "Emris is an independent game studio. We design, build, and ship original games, with more than ten years in the craft.",
  openGraph: {
    title: "Emris — We make games",
    description:
      "An independent game studio. Original games, from the first playable to live. 10+ years building games.",
    type: "website",
    images: [{ url: "/gateway/mark.webp", alt: "An arc, a circle, a blue portal, and a gold gate" }],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${inter.variable} ${plexMono.variable} ${bungee.variable} ${grotesk.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
