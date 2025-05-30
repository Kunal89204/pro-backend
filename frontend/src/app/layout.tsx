
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import AuthWrapper from "@/components/AuthWrapper";
import SidebarDemo from "@/components/SideBarWrapper";



const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "YouTube",
  description: "Watch you favorite videos on youtube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <AuthWrapper>
            <SidebarDemo>
              {children}
            </SidebarDemo>
          </AuthWrapper>
        </Providers>

      </body>
    </html>
  );
}