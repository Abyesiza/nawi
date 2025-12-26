'use client';

import { ReactNode } from "react";
import Header from "./_components/header";
import Footer from "./_components/footer";
import PageTransition from "./_components/page-transition";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <PageTransition key={pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
