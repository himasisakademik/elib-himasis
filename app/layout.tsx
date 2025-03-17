import { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const clashDisplay = localFont({
  src: "./ClashDisplay-Medium.woff2",
  variable: "--font-clash-display",
});

// Server-side metadata export
export const metadata: Metadata = {
  title: "E Library Himasis",
  description: "Bersatu Dalam Kolaborasi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`scroll-smooth ${clashDisplay.variable} ${spaceGrotesk.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
