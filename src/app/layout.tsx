import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Black Cat Store | Catalogo",
  description: "Catálogo de productos",
  icons:{
    icon: "/cat-logo-light.png",
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)} suppressHydrationWarning>
      <body>
        <Toaster />
<Script
  src="https://cdn.botpress.cloud/webchat/v5.0/inject.js"
  strategy="beforeInteractive"
/>

<Script
  src="https://files.bpcontent.cloud/2026/11/04/21/20261104215642-MQHNAAZY.js"
  strategy="afterInteractive"
/>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
