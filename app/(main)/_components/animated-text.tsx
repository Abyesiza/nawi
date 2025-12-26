'use client';

import { motion, Variants } from "framer-motion";

interface AnimatedTextProps {
    text: string;
    className?: string;
    type?: "words" | "letters";
    delay?: number;
}

export default function AnimatedText({
    text,
    className = "",
    type = "words",
    delay = 0
}: AnimatedTextProps) {
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
                damping: 20,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 10,
            filter: "blur(10px)",
        },
    };

    const items = type === "words" ? text.split(" ") : text.split("");

    return (
        <motion.span
            className={`inline-flex flex-wrap ${className}`}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {items.map((item, index) => (
                <motion.span
                    variants={child}
                    className={type === "words" ? "mr-[0.25em]" : ""}
                    key={index}
                >
                    {item === " " ? "\u00A0" : item}
                </motion.span>
            ))}
        </motion.span>
    );
}
