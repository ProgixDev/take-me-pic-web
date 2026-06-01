import type { Metadata } from "next";
import { Fraunces, Caveat, Special_Elite, DM_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const specialElite = Special_Elite({
  variable: "--font-special-elite",
  subsets: ["latin"],
  weight: "400",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Take Me Pic — On se prend en photo ?",
  description:
    "Trouve un voyageur sympa à proximité qui veut bien prendre la photo. Une communauté de voyageurs qui se photographient les uns les autres.",
  icons: {
    icon: "/brand/take-me-pic-icon-transparent.svg",
    apple: "/brand/take-me-pic-icon-transparent.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${fraunces.variable} ${caveat.variable} ${specialElite.variable} ${dmMono.variable} h-full`}
    >
      {/* suppressHydrationWarning: silences attribute mismatches injected by
          browser extensions (crxlauncher, bis_register, …) on <html>/<body>.
          It only covers these elements' own attributes, not page content. */}
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
