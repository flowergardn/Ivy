import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "~/components/ui/toaster";
import Footer from "~/components/footer";
import Navbar from "~/components/Navbar";

export const metadata = {
  title: "Ivy",
  description: "Two-factor authentication for Minecraft servers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} dark`}>
      <body>
        <Toaster />
        <Navbar />
        <main className="h-[86vh] flex-1 overflow-y-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
