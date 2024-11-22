import type { Metadata } from "next";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryProvider } from "@/components/providers/query-provider";
import { AppSidebar } from "@/components/shared/app-sidebar";
import Header from "@/components/shared/header";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
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
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <QueryProvider>
          <SidebarProvider defaultOpen={false}>
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
