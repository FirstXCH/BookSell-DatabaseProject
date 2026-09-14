import type { Metadata } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import CartDrawer from "@/components/CartDrawer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lampara Books : ร้านหนังสือและอีบุ๊กออนไลน์",
  description: "ร้านขายหนังสือ e-Book ดิจิทัลคุณภาพ คัดสรรพิเศษเพื่อการอ่านยามค่ำคืน รองรับทั้ง PDF และ EPUB",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={`${plusJakartaSans.variable} ${ibmPlexSansThai.variable}`}>
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] selection:bg-[var(--color-accent)] selection:text-black flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <MobileBottomNav />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}


