import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppSidebar } from "@/components/shared/app-sidebar";
import Header from "@/components/shared/header";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import localFont from "next/font/local";

const avenir = localFont({
  src: [
    {
      path: "./fonts/Avenir-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/Avenir-Book.woff2",
      weight: "350",
      style: "normal",
    },
    {
      path: "./fonts/Avenir-Heavy.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/Avenir-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Avenir-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Avenir-Roman.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-avenir",
});

export const metadata: Metadata = {
  title: "TokenDocs",
  description: "Search E-Docs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const SIDEBAR_WIDTH_ICON = "4rem"
  return (
    <html lang="en">
      <body className={`${avenir.variable} antialiased font-sans`}>
        <QueryProvider>
          <SidebarProvider defaultOpen={false} style={{ "--sidebar-width-icon": SIDEBAR_WIDTH_ICON }} >
            <Toaster position="top-center" />
            <AppSidebar />
            <main className={cn("flex flex-col w-full h-full")}>
              <Header />
              {children}
            </main>
          </SidebarProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
