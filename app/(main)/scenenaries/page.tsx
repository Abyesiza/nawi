'use client';

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import AnimatedText from "../_components/animated-text";

const EXPERIENCES = [
    {
        title: "Forest Sanctuary",
        category: "NATURE",
        description: "Transformation of your space into a lush, moonlit forest garden. Featuring real moss textures, warm fairy lighting, and the deep scent of night-blooming jasmine.",
        features: ["Acoustic Soundscape", "Petal Pathway", "Forest-Scented Oils", "Organic Treats"],
        slug: "forest-sanctuary"
    },
    {
        title: "Moonlit Terrace",
        category: "SERENE",
        description: "A serene and poetic environment designed for open-air intimacy. Billowing silks, telescopic starlight, and the quiet crackle of a private fire-pit.",
        features: ["Star-gazing Kit", "Premium Silk Drapes", "Ambient Fire-glow", "Artisanal Cheese Board"],
        slug: "moonlit-terrace"
    },
    {
        title: "Royal Chamber",
        category: "CLASSIC",
        description: "Elegance and authority. Gold-leaf accents, heavy velvet drapes, and a royal feast presentation for a night of supreme, timeless decadence.",
        features: ["Gold-leaf Accents", "Silk/Velvet Bedding", "Curated Royal Feast", "Rare Vintage Wine"],
        slug: "royal-chamber"
    },
    {
        title: "The Moonlight Spa",
        category: "SENSORY",
        description: "A sensory journey focused on touch and sound. A portable luxury spa setup with custom-blended body oils and a guided sensory flow.",
        features: ["Portable Luxury Spa", "Artisanal Body Oils", "Guided Sensory Plan", "Fresh Fruit Platter"],
        slug: "moonlight-spa"
    },
    {
        title: "Garden Sanctuary",
        category: "POETIC",
        description: "An indoor garden-themed sanctuary. Floor-to-ceiling florals, hidden soundscapes of birdsong, and the softest atmospheric lighting.",
        features: ["Exotic Florals", "Nature Soundscape", "Hidden Mist Emitters", "Botanical Cocktails"],
        slug: "garden-sanctuary"
    },
    {
        title: "Celestial Heights",
        category: "FANTASY",
        description: "A star-gazer's dream. We project a hyper-realistic nebula across the ceiling, paired with floating candle-light and deep velvet textures.",
        features: ["Nebula Projection", "Floating Candles", "Velvet Textures", "Champagne Service"],
        slug: "celestial-heights"
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function ScenenariesPage() {
    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <section className="py-24 sm:py-32 bg-background border-b border-burgundy/5 text-center px-4 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
                    <div className="absolute top-0 left-1/4 w-64 h-64 bg-burgundy/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-burgundy/3 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-burgundy font-semibold tracking-[0.4em] uppercase text-xs mb-6 block"
                    >
                        The Collection
                    </motion.span>
                    <h1 className="text-5xl sm:text-7xl font-bold text-grey-dark mb-10 tracking-tight leading-tight">
                        <AnimatedText text="Honey Moon Experiences" type="letters" />
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-xl sm:text-2xl text-grey-medium max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Select a curated theme for your journey. Each environment is designed with artistic care and emotional intelligence.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="mt-12 flex items-center justify-center gap-4 text-sm font-medium text-grey-medium"
                    >
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-burgundy" /> Bespoke Design</span>
                        <div className="w-1 h-1 rounded-full bg-grey-medium/30" />
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-burgundy" /> Multisensory</span>
                        <div className="w-1 h-1 rounded-full bg-grey-medium/30" />
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-burgundy" /> Discreet</span>
                    </motion.div>
                </div>
            </section>

            {/* Catalog Grid */}
            <section className="py-24 bg-background-secondary/30">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                    >
                        {EXPERIENCES.map((exp, i) => (
                            <motion.div
                                key={i}
                                variants={cardVariants}
                                whileHover={{ y: -12, transition: { duration: 0.4, ease: "easeOut" } }}
                                className="group bg-white rounded-[2rem] overflow-hidden border border-burgundy/5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
                            >
                                {/* Visual Wrapper */}
                                <div className="h-72 bg-background-secondary relative flex items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-beige to-white">
                                    <div className="absolute inset-0 bg-burgundy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    <div className="relative text-center z-10">
                                        <motion.span
                                            className="text-[10px] font-bold text-burgundy/50 tracking-[0.3em] uppercase mb-3 block opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0"
                                        >
                                            {exp.category}
                                        </motion.span>
                                        <h3 className="text-3xl font-serif italic text-burgundy group-hover:scale-110 transition-transform duration-700 ease-out">{exp.title}</h3>
                                    </div>

                                    {/* Corner Accents */}
                                    <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-burgundy/10 rounded-tl-lg" />
                                    <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-burgundy/10 rounded-br-lg" />
                                </div>

                                {/* Content */}
                                <div className="p-10 flex-1 flex flex-col">
                                    <p className="text-grey-medium text-base mb-8 leading-relaxed font-light">
                                        {exp.description}
                                    </p>

                                    <div className="grid grid-cols-1 gap-4 mb-10">
                                        {exp.features.map((feature, fi) => (
                                            <div key={fi} className="flex items-center gap-3 text-sm font-medium text-grey-dark">
                                                <div className="w-1.5 h-1.5 rounded-full bg-burgundy/20" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-auto">
                                        <Link
                                            href={`/booking?theme=${exp.slug}`}
                                            className="group/btn relative block w-full text-center py-4 rounded-full bg-burgundy text-white font-bold text-sm overflow-hidden transition-all hover:bg-burgundy-light shadow-lg hover:shadow-burgundy/20 shadow-transparent"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                Book Experience
                                                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </span>
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Custom Request CTA */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="py-32 text-center bg-background px-4"
            >
                <div className="max-w-4xl mx-auto bg-white border border-burgundy/5 rounded-[3rem] p-16 md:p-24 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-burgundy/5 rounded-bl-full -z-0 transition-transform group-hover:scale-110 duration-700" />
                    <div className="relative z-10">
                        <span className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-6 block">Bespoke Requests</span>
                        <h2 className="text-4xl font-bold text-grey-dark mb-6 leading-tight">Have a deeply personal fantasy?</h2>
                        <p className="text-xl text-grey-medium mb-12 font-light max-w-2xl mx-auto">
                            For clients who desire something unique, we offer custom-designed romantic scenes inspired by your imagination.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-3 bg-transparent border-2 border-burgundy px-12 py-5 rounded-full text-burgundy font-bold text-lg hover:bg-burgundy hover:text-white transition-all duration-300"
                        >
                            Request Custom Scene
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
