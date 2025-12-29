'use client';

import { motion } from "framer-motion";
import AnimatedText from "../_components/animated-text";

export default function ContactPage() {
    return (
        <div className="min-h-screen py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-20 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="flex-1"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="text-burgundy font-semibold tracking-widest uppercase text-sm mb-4 block"
                        >
                            Discreet Inquiry
                        </motion.span>
                        <h1 className="text-5xl font-bold text-grey-dark mb-8 tracking-tighter leading-tight">
                            <AnimatedText text="Stay in the" className="block" type="words" />
                            <AnimatedText text="Shadows." className="text-burgundy italic" type="letters" delay={0.5} />
                        </h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="text-lg text-grey-medium mb-10 leading-relaxed italic"
                        >
                            "We design your world. We never know who you are."
                        </motion.p>

                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="p-8 rounded-3xl bg-background-secondary border border-burgundy/5"
                            >
                                <h3 className="font-bold text-grey-dark mb-2">Our Concierge</h3>
                                <p className="text-sm text-grey-medium">For immediate inquiries regarding custom scents, stealth pickups, or venue scouting.</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4 }}
                                className="p-8 rounded-3xl bg-burgundy/5 border border-burgundy/10"
                            >
                                <h3 className="font-bold text-burgundy mb-2">Anonymous Response</h3>
                                <p className="text-sm text-grey-medium italic">All communications are encrypted and purged after 48 hours of service completion.</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="flex-1 w-full bg-white rounded-3xl shadow-xl border border-burgundy/5 p-10 md:p-12"
                    >
                        <form className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-grey-dark uppercase tracking-widest mb-2">Message Topic</label>
                                <select className="w-full px-6 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none bg-background-secondary/50 text-sm font-semibold transition-all">
                                    <option>Custom Scene Request</option>
                                    <option>Stealth Logistics Inquiry</option>
                                    <option>Corporate Romantic Gifting</option>
                                    <option>Partner with Nawi</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-grey-dark uppercase tracking-widest mb-2">Detail</label>
                                <textarea
                                    rows={5}
                                    placeholder="Tell us what you're dreaming of..."
                                    className="w-full px-6 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm transition-all resize-none"
                                />
                            </div>

                            <div className="pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="button"
                                    onClick={() => alert("Message sent into the shadows.")}
                                    className="w-full py-5 rounded-full bg-burgundy text-white font-bold text-lg shadow-lg hover:bg-burgundy-light transition-all"
                                >
                                    Send Inquiry
                                </motion.button>
                            </div>

                            <div className="text-center pt-4">
                                <p className="text-[10px] text-grey-medium uppercase tracking-[0.2em] font-bold">Nawi Experience Design • Fully Discreet</p>
                            </div>
                        </form>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
