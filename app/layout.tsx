import { Metadata } from "next";
import "./globals.css";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import { SessionProvider } from "next-auth/react";

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
  icons: "/himasis.png",
};

const HeadContent = () => (
  <head>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" sizes="192x192" href="/himasis.png" />
    <link rel="apple-touch-icon" sizes="512x512" href="/himasis.png" />
    <meta name="theme-color" content="#000000" />
    {/* Google Tag Manager */}
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-K946CW9');`,
      }}
    />
    {/* End Google Tag Manager */}
    
  </head>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <HeadContent />
      <body className={`scroll-smooth overflow-x-hidden ${clashDisplay.variable} ${spaceGrotesk.variable}`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

