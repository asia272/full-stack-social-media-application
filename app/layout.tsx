import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";
import AuthHydrationFix from "@/components/AuthHydrationFix";
import AuthGate from "@/components/AuthGate";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevConnect | Developer Community Platform",
  description:
    "DevConnect is a modern developer platform where you can showcase projects, share posts, connect with developers, and get feedback from the community.",
  keywords: [
    "DevConnect",
    "developer community",
    "share coding projects",
    "web developers",
    "react nextjs community",
    "frontend backend developers",
    "coding social platform",
  ],
  icons: {
    icon: "/brand.png",
  },
};

export default  function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthHydrationFix />

            {/*  AUTH GATE ADDED HERE */}
            <AuthGate>
              <div className="min-h-screen">
                <Navbar />

                <main className="mx-auto max-w-7xl px-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    <div className="hidden lg:block lg:col-span-3">
                      <Sidebar />
                    </div>

                    <div className="lg:col-span-9">{children}</div>
                  </div>
                </main>
              </div>
            </AuthGate>

            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
