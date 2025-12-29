'use client';

import { motion, Variants, useReducedMotion } from "framer-motion";
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
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: type === "words" ? 0.08 : 0.02,
                delayChildren: delay,
            },
        },
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 30,
                stiffness: 150,
            },
        },
        hidden: {
            opacity: 0,
            y: 15,
            filter: "blur(8px)",
        },
    };

    const items = type === "words" ? text.split(" ") : text.split("");

    // Prevent hydration mismatch while maintaining layout
    if (!isMounted) {
        return (
            <span className={`inline-flex flex-wrap ${className}`} style={{ opacity: 0 }}>
                {text}
            </span>
        );
    }

    // Accessibility fallback
    if (shouldReduceMotion) {
        return <span className={`inline-flex flex-wrap ${className}`}>{text}</span>;
    }

    return (
        <motion.span
            className={`inline-flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            whileInView={once ? "visible" : undefined}
            viewport={{ once: once, margin: "-20px" }}
        >
            {items.map((item, index) => (
                <motion.span
                    variants={child}
                    className={type === "words" ? "mr-[0.25em]" : ""}
                    key={`${item}-${index}`}
                    style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
                >
                    {item === " " ? "\u00A0" : item}
                </motion.span>
            ))}
        </motion.span>
    );
}
