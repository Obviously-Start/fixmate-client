import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FixMate | Smart Device & Home Appliance Repair",
  description: "Book verified technicians for phone, laptop, AC, fridge, TV and more. Pay only after the job is done.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-white text-slate-700 antialiased`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}