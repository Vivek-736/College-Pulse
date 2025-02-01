import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "College Pulse - Connect With Your Campus Communities Better",
  description: "Connect with your campus communities better with College Pulse. College Pulse is a platform for students to connect with their campus communities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(font.className, "bg-white dark:bg-[#aca8b9]")}
        >
          <ThemeProvider attribute={"class"} defaultTheme="light" enableSystem={false} storageKey="college-theme">
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}