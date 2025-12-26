'use client';

import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedTextProps {
    text: string;
    className?: string;
    type?: "words" | "letters";
    delay?: number;
    once?: boolean;
}

export default function AnimatedText({
    text,
    className = "",
    type = "words",
    delay = 0,
    once = true
}: AnimatedTextProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: type === "words" ? 0.08 : 0.03,
                delayChildren: delay
            },
        },
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring" as const,
                damping: 25,
                stiffness: 120,
            },
        },
        hidden: {
            opacity: 0,
            y: 10,
            filter: "blur(4px)", // Reduced blur for better performance
        },
    };

    const items = type === "words" ? text.split(" ") : text.split("");

    // If not mounted, show a static or hidden version to prevent hydration flickering
    if (!isMounted) {
        return <span className={`inline-flex flex-wrap ${className}`}>{text}</span>;
    }

    return (
        <motion.span
            className={`inline-flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {items.map((item, index) => (
                <motion.span
                    variants={child}
                    className={type === "words" ? "mr-[0.25em]" : ""}
                    key={`${item}-${index}`}
                >
                    {item === " " ? "\u00A0" : item}
                </motion.span>
            ))}
        </motion.span>
    );
}
