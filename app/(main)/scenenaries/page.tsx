'use client';

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import AnimatedText from "../_components/animated-text";

const EXPERIENCES = [
    {
        title: "Forest Sanctuary",
        category: "ROMANTIC",
        description: "Transformation of your space into a lush, moonlit forest garden. Featuring real moss textures, warm fairy lighting, and the scent of pine and night-blooming jasmine.",
        features: ["Acoustic Soundscape", "Petal Pathway", "Forest-Scented Oils", "Organic Treats"],
        slug: "forest-sanctuary"
    },
    {
        title: "Celestial Heights",
        category: "FANTASY",
        description: "A star-gazer's dream. We project a hyper-realistic nebula across the ceiling, paired with floating candle-light and deep velvet textures.",
        features: ["Nebula Projection", "Floating Candles", "Velvet Bedding", "Sparkling Wine"],
        slug: "celestial-heights"
    },
    {
        title: "Royal Chamber",
        category: "ROMANTIC",
        description: "Elegance and authority. Gold-leaf accents, heavy drapes, and a royal feast presentation for a night of supreme decadence.",
        features: ["Gold Accents", "Silk Drapes", "Curated Feast", "Rose Petals"],
        slug: "royal-chamber"
    },
    {
        title: "The Moonlight Spa",
        category: "EXPERIMENTAL",
        description: "A sensory journey focused on touch and sound. A portable luxury spa setup with custom-blended body oils and a guided sensory flow.",
        features: ["Portable Spa", "Artisanal Oils", "Guided Sensory Plan", "Fruit Platter"],
        slug: "moonlight-spa"
    },
    {
        title: "Midnight Desert",
        category: "FANTASY",
        description: "Warm sands and cool breezes. Terracotta tones, silk cushions, and a desert-night soundscape for an exotic connection.",
        features: ["Silk Cushions", "Desert Scents", "Warm Glow Lighting", "Dates & Tea"],
        slug: "midnight-desert"
    },
    {
        title: "Parisian Balcony",
        category: "ROMANTIC",
        description: "The classic vibe of a rainy night in Paris. Bistro setup, French music, and the aroma of fresh pastries and aged wine.",
        features: ["Bistro Setup", "French Soundscape", "Artisanal Pastries", "Vintage Wine"],
        slug: "parisian-balcony"
    }
];

export default function ScenenariesPage() {
    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <section className="py-24 bg-background border-b border-burgundy/5 text-center px-4">
                <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-burgundy font-semibold tracking-widest uppercase text-sm mb-4 block"
                >
                    The Catalog
                </motion.span>
                <h1 className="text-5xl font-bold text-grey-dark mb-8 tracking-tighter">
                    <AnimatedText text="Honey Experiences" type="letters" />
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xl text-grey-medium max-w-2xl mx-auto italic"
                >
                    Select a theme for your journey. Every scene can be customized to fit your specific fantasy and venue.
                </motion.p>
            </section>

            {/* Catalog Grid */}
            <section className="py-24 bg-background-secondary">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {EXPERIENCES.map((exp, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="group bg-white rounded-3xl overflow-hidden border border-burgundy/5 shadow-sm hover:shadow-xl flex flex-col"
                            >
                                {/* Visual Placeholder */}
                                <div className="h-64 bg-background-secondary relative flex items-center justify-center p-8 overflow-hidden">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 5 }}
                                        className="absolute inset-0 bg-gradient-to-tr from-burgundy/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="relative text-center">
                                        <span className="text-xs font-bold text-burgundy/40 tracking-[0.2em] uppercase mb-2 block">{exp.category}</span>
                                        <h3 className="text-2xl font-serif italic text-burgundy">{exp.title}</h3>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <p className="text-grey-medium text-sm mb-6 leading-relaxed">
                                        {exp.description}
                                    </p>

                                    <div className="space-y-3 mb-8">
                                        {exp.features.map((feature, fi) => (
                                            <div key={fi} className="flex items-center gap-2 text-xs font-semibold text-grey-dark">
                                                <div className="w-1 h-1 rounded-full bg-burgundy" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/booking?theme=${exp.slug}`}
                                            className="block w-full text-center py-3 rounded-full bg-transparent border-2 border-burgundy/20 text-burgundy font-bold text-sm transition-all hover:bg-burgundy hover:text-white"
                                        >
                                            Book This Scene
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom Request CTA */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-20 text-center bg-background px-4"
            >
                <div className="max-w-2xl mx-auto bg-white border border-burgundy/5 rounded-3xl p-12 shadow-sm">
                    <h2 className="text-2xl font-bold text-grey-dark mb-4 drop-shadow-sm">Have a unique fantasy?</h2>
                    <p className="text-grey-medium mb-8">If you can imagine it, we can build it. Contact us for completely custom scene designs.</p>
                    <Link
                        href="/contact"
                        className="text-burgundy font-bold hover:underline"
                    >
                        Request a Custom Design →
                    </Link>
                </div>
            </motion.section>
        </div>
    );
}
