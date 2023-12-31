import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "../globals.css";

export const metadata: Metadata = {
  title: "Threads",
  description: "Next.js Threads App",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.className} bg-dark-1 flex justify-center items-center min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
