'use client';

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import AnimatedText from "./_components/animated-text";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-grey-dark sm:text-6xl lg:text-7xl leading-[1.1]">
              <AnimatedText
                text="We Design Your"
                className="block"
                type="letters"
              />
              <AnimatedText
                text="Fantasies."
                className="text-burgundy italic"
                type="letters"
                delay={0.5}
              />
              <br />
              <AnimatedText
                text="We Never Know Who You Are."
                className="block text-3xl sm:text-5xl lg:text-6xl mt-4 opacity-90"
                type="words"
                delay={1.2}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-8 text-xl leading-8 text-grey-medium max-w-2xl mx-auto"
            >
              Nawi is a premium, discreet romantic experience designer.
              We curate custom environments and immersive scenarios for those who value elegance, intimacy, and absolute privacy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <Link
                href="/scenenaries"
                className="rounded-full bg-burgundy px-10 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-burgundy-light hover:scale-105 active:scale-95"
                style={{ boxShadow: '0 10px 25px -5px var(--burgundy-shadow)' }}
              >
                Explore Honey Experiences
              </Link>
              <Link
                href="/about"
                className="rounded-full border-2 border-burgundy/30 bg-transparent px-10 py-4 text-base font-semibold text-burgundy transition-all hover:bg-burgundy/5 hover:border-burgundy"
              >
                Our Philosophy
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flagship Service - Honey Experiences */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24 bg-background-secondary relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-burgundy font-semibold tracking-widest uppercase text-sm mb-4 block">Flagship Product</span>
              <h2 className="text-4xl font-bold text-grey-dark mb-6">
                Honey Experiences
              </h2>
              <p className="text-lg text-grey-medium mb-8 leading-relaxed">
                Beyond imagination. A luxurious, unforgettable romantic journey curated specifically for you and your partner.
                From fully themed environments to private concierge services, Honey represents the peak of Nawi design.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Fully themed romantic environments",
                  "Luxury treats and sensory experiences",
                  "Private concierge on standby",
                  "Optional stealth logistics"
                ].map((item, i) => (
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    viewport={{ once: true }}
                    key={i}
                    className="flex items-center gap-3 text-grey-dark font-medium"
                  >
                    <div className="w-2 h-2 rounded-full bg-burgundy" />
                    {item}
                  </motion.li>
                ))}
              </ul>
              <Link
                href="/scenenaries"
                className="inline-flex items-center text-burgundy font-bold hover:gap-2 transition-all group"
              >
                View all scenes
                <svg className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="flex-1 w-full aspect-square bg-white/40 rounded-3xl border border-burgundy/10 flex items-center justify-center p-12 text-center relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-burgundy/5 to-transparent rounded-3xl" />
              <div className="relative">
                <h3 className="text-2xl font-serif italic text-burgundy mb-4">"The Forest Room"</h3>
                <p className="text-grey-medium italic text-sm">One of our most requested curated scenes.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Privacy Section - The USP */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-grey-dark mb-6">Safety + Privacy + Quality</h2>
            <p className="text-lg text-grey-medium mb-12">
              Privacy is not just a feature; it's our foundation. We use a unique identity model to ensure your absolute anonymity.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              {[
                { title: "No Real Identity", desc: "No IDs, no real names, no location tracking. We only care about designing your moment." },
                { title: "Automatic Aliases", desc: "The system assigns you a unique identity (e.g., AmberFox_27). This becomes your shadow across Nawi." },
                { title: "Stealth Logistics", desc: "Silent setup, anonymous pickups, and discreet deliveries. We operate entirely in the shadows." }
              ].map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                  viewport={{ once: true }}
                  key={i}
                >
                  <h3 className="text-xl font-bold text-burgundy mb-3">{item.title}</h3>
                  <p className="text-grey-medium text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-burgundy/5"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-grey-dark sm:text-4xl">
              Ready to Design Your World?
            </h2>
            <p className="mt-6 text-lg text-grey-medium italic">
              "Love has no limits. We design your world for you."
            </p>
            <div className="mt-10">
              <Link
                href="/booking"
                className="rounded-full bg-burgundy px-12 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-burgundy-light inline-block"
              >
                Begin Your Journey
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
