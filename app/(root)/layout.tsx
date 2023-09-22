import { ClerkProvider, currentUser } from "@clerk/nextjs";
import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopBar from "@/components/share/TopBar";
import LeftSidebar from "@/components/share/LeftSidebar";
import RightSidebar from "@/components/share/RightSidebar";
import BottomBar from "@/components/share/BottomBar";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "Next.js Threads App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const user = await currentUser();

  // if (user) {
  //   const userInfo = await fetchUser(user.id);

  //   if (!userInfo?.onboarded) redirect("/onboarding");
  // }

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TopBar />
          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            <RightSidebar />
          </main>
          <BottomBar />
        </body>
      </html>
    </ClerkProvider>
  );
}
