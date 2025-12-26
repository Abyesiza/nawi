'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "../_components/animated-text";
import Link from "next/link";

const CATEGORIES = ["ALL", "LINGERIE", "PROPS & COSTUMES", "TOYS", "ATMOSPHERE"];

const PRODUCTS = [
    {
        id: 1,
        name: "Midnight Silk Robe",
        category: "LINGERIE",
        price: "$120",
        description: "Floor-length Italian silk robe in deep obsidian. Designed for graceful movement and ultimate comfort.",
        image_alt: "Luxury silk robe"
    },
    {
        id: 2,
        name: "Siren Lace Set",
        category: "LINGERIE",
        price: "$85",
        description: "Intricate burgundy lace with delicate gold-tone hardware. A statement of elegance and desire.",
        image_alt: "Delicate lace set"
    },
    {
        id: 3,
        name: "Clinical Devotion (Nurse)",
        category: "PROPS & COSTUMES",
        price: "$110",
        description: "A premium, tailored nurse ensemble. Features soft-touch fabrics and authentic brass buttons.",
        image_alt: "Nurse costume ensemble"
    },
    {
        id: 4,
        name: "Midnight Maid",
        category: "PROPS & COSTUMES",
        price: "$95",
        description: "A refined take on the classic French maid. Includes a silk apron and lace headband.",
        image_alt: "Maid costume ensemble"
    },
    {
        id: 5,
        name: "Silk Shadow (Blindfold)",
        category: "PROPS & COSTUMES",
        price: "$45",
        description: "Weighted silk blindfold with a plush velvet lining. For total sensory immersion.",
        image_alt: "Silk blindfold"
    },
    {
        id: 6,
        name: "Crimson Restraints",
        category: "PROPS & COSTUMES",
        price: "$150",
        description: "Hand-stitched leather cuffs lined with soft lambskin. Durable, elegant, and secure.",
        image_alt: "Luxury leather restraints"
    },
    {
        id: 7,
        name: "Gilded Pulse",
        category: "TOYS",
        price: "$180",
        description: "24k gold-plated vibrating massager. Whisper-quiet motor with 10 customizable patterns.",
        image_alt: "Gold-plated massager"
    },
    {
        id: 8,
        name: "Azure Glass Wand",
        category: "TOYS",
        price: "$90",
        description: "Hand-formed borosilicate glass with a textured ergonomic handle. Excellent for temperature play.",
        image_alt: "Textured glass wand"
    },
    {
        id: 9,
        name: "Velvet Petal Set",
        category: "ATMOSPHERE",
        price: "$35",
        description: "1,000 realistic silk rose petals infused with our signature 'Obsidian' fragrance.",
        image_alt: "Luxury silk petals"
    },
    {
        id: 10,
        name: "Nebula Projector",
        category: "ATMOSPHERE",
        price: "$210",
        description: "High-definition projection unit that transforms any ceiling into a hyper-realistic night sky.",
        image_alt: "Ambient light projector"
    }
];

export default function MarketplacePage() {
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const filteredProducts = selectedCategory === "ALL"
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header Section */}
            <section className="py-24 bg-background border-b border-burgundy/5 text-center px-4">
                <motion.span
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-burgundy font-semibold tracking-widest uppercase text-sm mb-4 block"
                >
                    Marketplace
                </motion.span>
                <h1 className="text-5xl font-bold text-grey-dark mb-8 tracking-tighter">
                    <AnimatedText text="Curated Enhancements" type="letters" />
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-xl text-grey-medium max-w-2xl mx-auto italic"
                >
                    Everything you need to heighten the magic. From attire to atmosphere, selected for quality and discretion.
                </motion.p>
            </section>

            {/* Category Filter */}
            <section className="sticky top-20 z-30 bg-background/95 backdrop-blur-md border-b border-burgundy/5 py-4">
                <div className="container mx-auto px-4 overflow-x-auto no-scrollbar">
                    <div className="flex sm:justify-center gap-4 min-w-max pb-2 sm:pb-0">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full text-[10px] font-bold tracking-widest transition-all ${selectedCategory === cat
                                    ? "bg-burgundy text-white shadow-lg"
                                    : "bg-white text-grey-medium border border-burgundy/10 hover:border-burgundy/30"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Product Grid */}
            <section className="py-12 sm:py-16 container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-10"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="group bg-white rounded-3xl overflow-hidden border border-burgundy/5 shadow-sm hover:shadow-2xl transition-all flex flex-col"
                            >
                                {/* Image Placeholder */}
                                <div className="h-64 sm:h-72 bg-gradient-to-b from-background-secondary to-white relative flex items-center justify-center p-8 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-burgundy/5 to-transparent flex items-center justify-center">
                                        <div className="text-burgundy/10 font-serif italic text-6xl select-none">NAWI</div>
                                    </div>
                                    <div className="relative text-center z-10 group-hover:scale-105 transition-transform duration-500">
                                        <span className="text-[10px] font-bold text-burgundy/60 tracking-[0.2em] uppercase mb-2 block">{product.category}</span>
                                        <h3 className="text-xl font-serif italic text-burgundy leading-tight px-4">{product.name}</h3>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-2xl font-bold text-grey-dark">{product.price}</span>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <div key={star} className="w-1.5 h-1.5 rounded-full bg-burgundy/20" />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-grey-medium text-sm mb-8 leading-relaxed line-clamp-3">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto space-y-3 sm:space-y-4">
                                        <button className="w-full py-4 sm:py-3 rounded-full bg-grey-dark text-white font-bold text-[10px] tracking-widest hover:bg-burgundy transition-colors shadow-sm active:scale-95">
                                            ADD TO CART
                                        </button>
                                        <button className="w-full py-4 sm:py-3 rounded-full bg-transparent border border-burgundy/20 text-burgundy font-bold text-[10px] tracking-widest hover:bg-burgundy/5 transition-colors active:scale-95">
                                            DISCREET SHIP
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </section>

            {/* Discretion Section */}
            <section className="py-24 bg-background-secondary border-t border-burgundy/5">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-block p-4 rounded-full bg-white border border-burgundy/10 mb-8 shadow-sm">
                        <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-grey-dark mb-6">Total Discretion Guaranteed</h2>
                    <p className="text-lg text-grey-medium mb-10 leading-relaxed">
                        All marketplace orders are shipped in unbranded, generic packaging. Your statement will show a neutral charge, and the internal tracking remains anonymous within our encrypted system.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        <div className="p-6 bg-white rounded-2xl border border-burgundy/5 shadow-sm">
                            <h4 className="font-bold text-burgundy mb-2 text-sm uppercase tracking-wider">Generic Box</h4>
                            <p className="text-xs text-grey-medium">No mention of Nawi or the contents on the exterior.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-burgundy/5 shadow-sm">
                            <h4 className="font-bold text-burgundy mb-2 text-sm uppercase tracking-wider">Neutral Billing</h4>
                            <p className="text-xs text-grey-medium">Billed as "Retail Services" for maximum privacy.</p>
                        </div>
                        <div className="p-6 bg-white rounded-2xl border border-burgundy/5 shadow-sm">
                            <h4 className="font-bold text-burgundy mb-2 text-sm uppercase tracking-wider">Concierge Pickup</h4>
                            <p className="text-xs text-grey-medium">Option to have the box waiting at your venue.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
