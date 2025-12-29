'use client';

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import AnimatedText from "./_components/animated-text";

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32 lg:py-48">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block"
            >
              <span className="text-burgundy font-semibold tracking-[0.3em] uppercase text-xs sm:text-sm">
                Nawi Experiences
              </span>
            </motion.div>

            <h1 className="text-4xl font-bold tracking-tight text-grey-dark sm:text-6xl lg:text-8xl leading-[1.1] mb-8">
              <AnimatedText
                text="Curated Romance."
                className="block"
                type="letters"
              />
              <AnimatedText
                text="Designed Intimacy."
                className="block text-burgundy italic font-serif"
                type="letters"
                delay={0.5}
              />
              <AnimatedText
                text="Absolute Discretion."
                className="block text-3xl sm:text-5xl lg:text-6xl mt-6 opacity-90"
                type="words"
                delay={1.2}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="mt-10 text-xl sm:text-2xl leading-relaxed text-grey-medium max-w-3xl mx-auto font-light"
            >
              We design unforgettable romantic moments for couples who believe love deserves intention, beauty, and privacy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.8 }}
              className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <Link
                href="/scenenaries"
                className="group relative inline-flex items-center justify-center rounded-full bg-burgundy px-12 py-5 text-lg font-semibold text-white shadow-2xl transition-all hover:bg-burgundy-light hover:scale-105 active:scale-95"
                style={{ boxShadow: '0 15px 35px -10px var(--burgundy-shadow)' }}
              >
                Explore Honey Moon Experiences
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="text-lg font-semibold text-grey-dark hover:text-burgundy transition-colors underline decoration-burgundy/20 underline-offset-8 hover:decoration-burgundy"
              >
                Our Philosophy
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -content-[''] w-96 h-96 bg-burgundy/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-1/4 right-0 -content-[''] w-64 h-64 bg-burgundy/3 rounded-full blur-2xl -z-10" />
      </section>

      {/* Signature Experience Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-32 bg-background-secondary relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <span className="text-burgundy font-semibold tracking-widest uppercase text-sm mb-4 block">Signature Experience</span>
              <h2 className="text-5xl font-bold text-grey-dark mb-8 leading-tight">
                Honey Moon Experiences
              </h2>
              <p className="text-xl text-grey-medium mb-10 leading-relaxed font-light">
                Our flagship offering created for couples who want more than a dinner date or a hotel stay.
                Honey Moon Experiences is a fully curated romantic journey, designed around emotion, atmosphere, and flow.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                {[
                  "Themed romantic environments",
                  "Intentional lighting & mood",
                  "Luxury florals & sensory details",
                  "Exotic treats & body oils",
                  "Curated experience flow",
                  "Private concierge support"
                ].map((item, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    viewport={{ once: true }}
                    key={i}
                    className="flex items-start gap-4"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full bg-burgundy/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-grey-dark font-medium leading-tight">{item}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/scenenaries"
                className="inline-flex items-center text-burgundy font-bold text-lg hover:gap-3 transition-all group"
              >
                Explore Bespoke Scenes
                <svg className="w-6 h-6 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="flex-1 w-full aspect-[4/5] bg-white rounded-[2rem] shadow-2xl border border-burgundy/5 flex items-center justify-center p-16 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-burgundy/10 via-transparent to-burgundy/5 opacity-50 transition-opacity group-hover:opacity-70" />
              <div className="relative z-10">
                <span className="text-burgundy/40 text-sm italic mb-4 block">Visual Inspiration</span>
                <h3 className="text-3xl font-serif italic text-burgundy mb-6">"Where imagination meets intimacy."</h3>
                <p className="text-grey-medium italic text-lg leading-relaxed">
                  Every detail—from scent to sound—is curated to support the mood you desire.
                </p>
              </div>

              {/* Decorative corners */}
              <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-burgundy/20 rounded-tl-xl" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-burgundy/20 rounded-br-xl" />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-32"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold text-grey-dark mb-6">How the Experience Works</h2>
            <p className="text-lg text-grey-medium font-light">
              Designing your perfect moment is an effortless and discreet process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-12">
            {[
              { step: "01", title: "Visit Nawi", desc: "Explore our Honey Moon Experiences and understand our design philosophy through our refined, minimal platform." },
              { step: "02", title: "Create a Private Account", desc: "Sign up using only essential contact details. You’ll be assigned a private alias that represents you." },
              { step: "03", title: "Choose or Customize", desc: "Select a Honey Moon Experience or submit a request for a custom romantic scene inspired by your fantasy." },
              { step: "04", title: "We Curate", desc: "Our design team prepares the venue, environment, and every sensory detail—quietly and professionally." },
              { step: "05", title: "Experience the Moment", desc: "Arrive to a fully transformed space designed for connection, intimacy, and presence." },
              { step: "06", title: "Optional Aftercare", desc: "Professional cleanup and discreet support can be arranged to ensure a seamless conclusion." }
            ].map((item, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                viewport={{ once: true }}
                key={i}
                className="relative"
              >
                <div className="text-6xl font-black text-burgundy/5 absolute -top-8 -left-2 z-0 tracking-tighter">
                  {item.step}
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-grey-dark mb-4">{item.title}</h3>
                  <p className="text-grey-medium leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Privacy Section - The USP */}
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="py-32 bg-burgundy text-beige"
        style={{ color: '#F5F3ED' }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">
                Absolute Privacy, <br /><span className="text-white/60 italic font-serif">By Design</span>
              </h2>
              <p className="text-xl mb-12 text-white/80 font-light leading-relaxed">
                Privacy is not a feature at Nawi—it is our foundation. We operate on a privacy-first identity model, ensuring every client enjoys complete discretion.
              </p>

              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <blockquote className="text-2xl font-serif italic mb-4">
                  "We design your experience. We never need to know who you are."
                </blockquote>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: "No Real Names", desc: "No legal identities required for booking or interaction." },
                { title: "Private Aliases", desc: "Automatic unique alias assigned to every client." },
                { title: "No Public Profiles", desc: "Your history and preferences remain strictly private." },
                { title: "Encrypted Data", desc: "Minimal data collected, encrypted and temporary." },
                { title: "Discreet Billing", desc: "Billing references that never reveal the nature of service." },
                { title: "Silent Logistics", desc: "Setup and removals performed with ghost-like precision." }
              ].map((item, i) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  viewport={{ once: true }}
                  key={i}
                  className="border-l border-white/20 pl-6 py-2"
                >
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed font-light">
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
        className="py-32 relative overflow-hidden"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-grey-dark mb-10">
              Begin Your Experience
            </h2>
            <p className="mb-14 text-xl sm:text-2xl text-grey-medium italic font-serif opacity-80">
              "Love has no limits. We design the world around yours."
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/booking"
                className="w-full sm:w-auto rounded-full bg-burgundy px-14 py-6 text-xl font-semibold text-white shadow-2xl transition-all hover:bg-burgundy-light inline-block hover:scale-105 active:scale-95"
              >
                Create Private Account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto rounded-full border-2 border-burgundy px-14 py-6 text-xl font-semibold text-burgundy transition-all hover:bg-burgundy/5"
              >
                Enter with Alias
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
