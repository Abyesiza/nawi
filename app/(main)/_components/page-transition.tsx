'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1], // easeOutQuart
            }}
            onAnimationStart={() => {
                if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "instant" });
                }
            }}
            style={{ willChange: "transform, opacity" }}
        >
            {children}
        </motion.div>
    );
}
