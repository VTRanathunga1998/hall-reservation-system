import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import SWRegister from "./sw-register";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hall Reservation System",
  description: "Next.js Hall reservation management system",
  manifest: "/manifest.json",
};

// Move viewport & themeColor here
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#00a159ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta
            name="apple-mobile-web-app-title"
            content="SmartUniversitySystem"
          />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
        </head>
        <body className={inter.className}>
          <SWRegister />
          {children} <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
