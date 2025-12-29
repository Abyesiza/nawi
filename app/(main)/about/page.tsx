'use client';

import { motion, Variants } from "framer-motion";
import AnimatedText from "../_components/animated-text";
import Link from "next/link";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-24 sm:py-32 bg-background border-b border-burgundy/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-balance">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-burgundy font-semibold tracking-[0.4em] uppercase text-xs mb-6 block">
                            Our Essence
                        </span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-7xl font-bold text-grey-dark mb-10 tracking-tight leading-tight">
                        <AnimatedText text="Designed Intimacy." type="letters" />
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="text-xl sm:text-2xl text-grey-medium max-w-4xl mx-auto leading-relaxed font-light"
                    >
                        At Nawi Experiences, we design unforgettable romantic moments for couples who believe love deserves intention, beauty, and privacy.
                    </motion.p>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-32 bg-background-secondary/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <span className="text-burgundy font-semibold tracking-widest uppercase text-sm">A Design House</span>
                            <h2 className="text-4xl sm:text-5xl font-bold text-grey-dark leading-tight">
                                We combine luxury hospitality, artistic staging, and concierge-level service.
                            </h2>
                            <p className="text-lg text-grey-medium leading-relaxed font-light">
                                Think of Nawi as your private partner in romance: part luxury retreat,
                                part artistic environment designer, and part discreet concierge—entirely devoted to privacy and quality.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                                {[
                                    { title: "Bespoke Scenes", desc: "Customized environments inspired by imagination, emotion, and fantasy." },
                                    { title: "Multisensory", desc: "Every detail—from scent to sound—is curated to support the mood you desire." }
                                ].map((item, i) => (
                                    <div key={i} className="space-y-3">
                                        <h4 className="font-bold text-grey-dark text-xl">{item.title}</h4>
                                        <p className="text-grey-medium text-sm font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="aspect-square bg-white rounded-[2.5rem] shadow-sm border border-burgundy/10 relative overflow-hidden flex items-center justify-center p-16"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-burgundy/10 to-transparent opacity-50" />
                            <div className="text-center relative z-10">
                                <span className="text-burgundy/30 text-xs tracking-widest uppercase mb-4 block">Our Specialization</span>
                                <h3 className="text-3xl font-serif italic text-burgundy mb-6">"Bespoke Romantic Environments"</h3>
                                <p className="text-grey-medium italic text-lg leading-relaxed font-light">
                                    Crafted scenes that awaken emotion, deepen connection, and transform ordinary spaces into extraordinary memories.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Philosophy Grid */}
            <section className="py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold text-grey-dark mb-6">Our Philosophy</h2>
                        <div className="w-20 h-1 bg-burgundy mx-auto rounded-full" />
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
                    >
                        {[
                            { title: "Safety", desc: "Romance should feel safe." },
                            { title: "Effortless", desc: "Luxury should feel effortless." },
                            { title: "Guarantee", desc: "Privacy should be guaranteed." },
                            { title: "Memorable", desc: "Experiences should be remembered, not explained." }
                        ].map((item, i) => (
                            <motion.div key={i} variants={itemVariants} className="text-center space-y-4">
                                <div className="w-16 h-16 rounded-2xl bg-burgundy/5 flex items-center justify-center mx-auto transition-colors hover:bg-burgundy/10">
                                    <span className="text-burgundy font-serif italic text-2xl font-bold">{i + 1}</span>
                                </div>
                                <h3 className="text-xl font-bold text-grey-dark">{item.title}</h3>
                                <p className="text-grey-medium font-light leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Who We Serve */}
            <section className="py-32 bg-burgundy/5 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-16 items-center">
                            <div className="flex-1">
                                <h2 className="text-4xl font-bold text-grey-dark mb-8">Designed for Couples Who Value…</h2>
                                <ul className="space-y-4">
                                    {[
                                        "Absolute Privacy",
                                        "Timeless Elegance",
                                        "Emotional Depth",
                                        "Quality Over Excess",
                                        "Thoughtful Luxury",
                                        "Meaningful Moments"
                                    ].map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex items-center gap-3 text-grey-dark font-medium text-lg"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-burgundy" />
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 bg-white p-12 rounded-[2.5rem] shadow-xl border border-burgundy/5 relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-burgundy/5 rounded-bl-full -z-0" />
                                <div className="relative z-10">
                                    <p className="text-xl text-grey-medium italic leading-relaxed font-serif">
                                        "Nawi is for couples who understand that romance is not loud—it is intentional."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Section - Reinforcement */}
            <section className="py-32 bg-burgundy text-beige" style={{ color: '#F5F3ED' }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto text-center">
                        <h2 className="text-4xl sm:text-5xl font-bold mb-10">Our Privacy Commitment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                            {[
                                "No real names required",
                                "No public profiles",
                                "No visible history",
                                "Automatic private alias",
                                "Encrypted & temporary data",
                                "Discreet billing references"
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    viewport={{ once: true }}
                                    className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:bg-white/15 transition-all"
                                >
                                    <p className="font-medium text-lg text-white">{item}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-20">
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="text-2xl font-serif italic mb-10 opacity-80"
                            >
                                "Love has no limits. We design the world around yours."
                            </motion.p>
                            <Link
                                href="/booking"
                                className="inline-block rounded-full bg-white px-10 py-5 text-lg font-bold text-burgundy hover:bg-beige transition-colors"
                            >
                                Begin Your Experience
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
