'use client';

import { motion, Variants } from "framer-motion";
import AnimatedText from "../_components/animated-text";

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-24 bg-background border-b border-burgundy/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.span
                        initial={{ opacity: 0, letterSpacing: "0.5em" }}
                        animate={{ opacity: 1, letterSpacing: "0.1em" }}
                        transition={{ duration: 1 }}
                        className="text-burgundy font-semibold tracking-widest uppercase text-sm mb-4 block"
                    >
                        Our Story
                    </motion.span>
                    <h1 className="text-5xl font-bold text-grey-dark mb-8 tracking-tight">
                        <AnimatedText text="The Secret Designers" type="letters" />
                    </h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="text-xl text-grey-medium max-w-3xl mx-auto leading-relaxed"
                    >
                        Nawi is more than an experience; it's a sanctuary for shared fantasies.
                        We are the invisible architects behind your most intimate memories.
                    </motion.p>
                </div>
            </section>

            {/* The Magic */}
            <section className="py-24 bg-background-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="aspect-[4/5] bg-white rounded-2xl shadow-sm border border-burgundy/5 relative overflow-hidden flex items-center justify-center p-12"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-burgundy/5 to-transparent" />
                            <p className="relative text-grey-medium italic text-center">Visualizing Transformation: From a standard hotel suite to a moonlit forest sanctuary...</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-grey-dark mb-8">Atmosphere is Artisanal</h2>
                            <p className="text-lg text-grey-medium mb-8 leading-relaxed">
                                We don't just decorate rooms; we craft portals. Every Nawi design is a multisensory journey meticulously planned to evoke specific emotions and connections.
                            </p>
                            <div className="space-y-6">
                                {[
                                    { title: "Lighting", desc: "Dynamic, warm, and cinematic shadows." },
                                    { title: "Atmosphere", desc: "Customized props, scents, and soundscapes." },
                                    { title: "Details", desc: "Baths, oils, petals, and curated treats." }
                                ].map((item, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        viewport={{ once: true }}
                                        key={i}
                                        className="flex gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-burgundy/10 flex items-center justify-center text-burgundy font-bold shrink-0">{i + 1}</div>
                                        <div>
                                            <h4 className="font-bold text-grey-dark">{item.title}</h4>
                                            <p className="text-grey-medium text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Promise - Privacy/Alias Section */}
            <section className="py-28 bg-burgundy text-white overflow-hidden relative">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl"
                />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-4xl font-bold mb-10"
                        >
                            Absolute Anonymity
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 md:p-16 border border-white/20"
                        >
                            <h3 className="text-2xl font-serif italic mb-6">"We Design Your Fantasies. We Never Know Who You Are."</h3>
                            <p className="text-burgundy-light/20 text-lg mb-12 leading-relaxed text-white/90">
                                Privacy is our primary service. Our platform is built specifically for users who require discretion.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-white" />
                                        The Alias System
                                    </h4>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        No real names or IDs. Upon registration, you are assigned a permanent alias (e.g., HiddenJasper_12). This alias is the only identify we, our vendors, and our drivers ever see.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xl font-bold flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-white" />
                                        Discreet Logistics
                                    </h4>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        Silent room setups, anonymous transportation in tinted vehicles, and no-contact supply deliveries. Our presence is felt through the atmosphere, never through face-to-face interaction.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5 }}
                            viewport={{ once: true }}
                            className="text-3xl font-bold text-grey-dark mb-4 tracking-tighter italic"
                        >
                            "Love has no limits. We design your world for you."
                        </motion.h2>
                    </div>
                </div>
            </section>
        </div>
    );
}
