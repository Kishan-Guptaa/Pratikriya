import type { Metadata } from "next";
import localFont from "next/font/local";
import { Patrick_Hand, Caveat } from "next/font/google";
// @ts-ignore: Allow importing global CSS without type declarations
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const patrickHand = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick-hand",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Pratikriya",
  description: "Create, share and collect responses all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${patrickHand.variable} ${caveat.variable} bg-background text-foreground antialiased scribble-bg`}
      >
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
