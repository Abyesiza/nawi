'use client';

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "../_components/animated-text";
import QRCode from "qrcode";

const EVENT_TYPES = [
  { id: "HONEYMOON", label: "Honeymoon", icon: "🌙", desc: "A private, luxurious escape for newlyweds" },
  { id: "BIRTHDAY", label: "Birthday", icon: "🎂", desc: "A personalised celebration designed around them" },
  { id: "ANNIVERSARY", label: "Anniversary", icon: "💍", desc: "Honour a milestone in your relationship" },
  { id: "PROPOSAL", label: "Proposal", icon: "💌", desc: "The perfect setting for a life-changing moment" },
  { id: "ROMANTIC_DATE", label: "Romantic Date", icon: "🕯️", desc: "An intimate evening curated for two" },
  { id: "BESPOKE", label: "Bespoke / Custom", icon: "✦", desc: "A fully custom experience built from your vision" },
];

const ADDONS = [
  { id: "photographer", label: "Private Photographer", desc: "Discreet, artistic coverage of your moment" },
  { id: "florals", label: "Luxury Florals", desc: "Premium floral arrangements tailored to the theme" },
  { id: "massage", label: "Professional Massage", desc: "In-suite therapists for ultimate relaxation" },
  { id: "stealth_pickup", label: "Stealth Pickup", desc: "Private, unmarked chauffeur service" },
  { id: "catering", label: "Private Chef / Catering", desc: "A bespoke dining experience in-venue" },
  { id: "silent_setup", label: "Silent Setup", desc: "Venue prepared and cleared without any contact" },
  { id: "cake", label: "Custom Cake / Desserts", desc: "Artisanal treats crafted for the occasion" },
  { id: "music", label: "Curated Soundtrack", desc: "Live musician or personalised playlist setup" },
];

interface FormData {
  eventType: string;
  theme: string;
  guestCount: string;
  venue: string;
  date: string;
  time: string;
  addons: string[];
  specialNotes: string;
}

function BookingForm() {
  const searchParams = useSearchParams();
  const initialTheme = searchParams.get("theme") || "";

  const [step, setStep] = useState(1);
  const [alias, setAlias] = useState("");
  const [assignedAgent, setAssignedAgent] = useState("");
  const [identityImage, setIdentityImage] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    eventType: "",
    theme: initialTheme,
    guestCount: "2",
    venue: "EXTERNAL",
    date: "",
    time: "",
    addons: [],
    specialNotes: "",
  });

  const totalSteps = 3;
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const toggleAddon = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.includes(id)
        ? prev.addons.filter((a) => a !== id)
        : [...prev.addons, id],
    }));
  };

  const generateIdentityCard = async (newAlias: string, agentAlias: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 420;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Card background
    ctx.beginPath();
    const r = 40;
    ctx.moveTo(r, 0);
    ctx.lineTo(canvas.width - r, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
    ctx.lineTo(canvas.width, canvas.height - r);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
    ctx.lineTo(r, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();

    // Inner border
    ctx.beginPath();
    const g = 20, ir = 30;
    ctx.moveTo(g + ir, g);
    ctx.lineTo(canvas.width - g - ir, g);
    ctx.quadraticCurveTo(canvas.width - g, g, canvas.width - g, g + ir);
    ctx.lineTo(canvas.width - g, canvas.height - g - ir);
    ctx.quadraticCurveTo(canvas.width - g, canvas.height - g, canvas.width - g - ir, canvas.height - g);
    ctx.lineTo(g + ir, canvas.height - g);
    ctx.quadraticCurveTo(g, canvas.height - g, g, canvas.height - g - ir);
    ctx.lineTo(g, g + ir);
    ctx.quadraticCurveTo(g, g, g + ir, g);
    ctx.closePath();
    ctx.strokeStyle = "#80002015";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.textAlign = "center";

    // Logo
    try {
      const logo = new Image();
      logo.src = "/nawilogo.png";
      await new Promise((resolve, reject) => {
        logo.onload = resolve;
        logo.onerror = reject;
      });
      const logoH = 52;
      const logoW = (logo.naturalWidth / logo.naturalHeight) * logoH;
      ctx.drawImage(logo, (canvas.width - logoW) / 2, 30, logoW, logoH);
    } catch {
      ctx.fillStyle = "#800020";
      ctx.font = "italic 700 18px serif";
      ctx.fillText("Nawi Experiences", canvas.width / 2, 70);
    }

    ctx.fillStyle = "#333333";
    ctx.font = "600 10px sans-serif";
    ctx.fillText("EXPERIENCE CONFIRMATION", canvas.width / 2, 102);

    ctx.beginPath();
    ctx.moveTo(250, 112); ctx.lineTo(350, 112);
    ctx.strokeStyle = "#80002030"; ctx.lineWidth = 1; ctx.stroke();

    ctx.fillStyle = "#666666";
    ctx.font = "600 9px sans-serif";
    ctx.fillText("YOUR ALIAS", canvas.width / 2, 138);

    ctx.fillStyle = "#800020";
    ctx.font = "italic 40px serif";
    ctx.fillText(newAlias, canvas.width / 2, 188);

    const agentTop = 230;
    ctx.beginPath();
    ctx.moveTo(150, agentTop - 10); ctx.lineTo(450, agentTop - 10);
    ctx.strokeStyle = "#80002010"; ctx.stroke();

    ctx.fillStyle = "#999999";
    ctx.font = "600 8px sans-serif";
    ctx.fillText("ASSIGNED CONCIERGE", canvas.width / 2, agentTop + 10);

    ctx.fillStyle = "#333333";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(agentAlias, canvas.width / 2, agentTop + 30);

    ctx.fillStyle = "#800020";
    ctx.font = "500 10px sans-serif";
    ctx.fillText("contact@nawiexperiences.com  •  Nawi Private Line", canvas.width / 2, agentTop + 50);

    const gridTop = 330;
    const qrData = JSON.stringify({
      alias: newAlias,
      agent: agentAlias,
      event: formData.eventType,
      theme: formData.theme,
      date: formData.date,
    });

    try {
      const qrDataUrl = await QRCode.toDataURL(qrData, {
        margin: 0,
        color: { dark: "#800020", light: "#FFFFFF00" },
      });
      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      await new Promise((resolve) => { qrImg.onload = resolve; });
      ctx.drawImage(qrImg, canvas.width - 100, gridTop - 15, 60, 60);
    } catch (e) {
      console.error("QR error", e);
    }

    ctx.textAlign = "left";

    ctx.fillStyle = "#999999";
    ctx.font = "600 8px sans-serif";
    ctx.fillText("EVENT", 80, gridTop);
    ctx.fillStyle = "#333333";
    ctx.font = "600 12px sans-serif";
    ctx.fillText(formData.eventType.replace("_", " "), 80, gridTop + 20);

    ctx.fillStyle = "#999999";
    ctx.font = "600 8px sans-serif";
    ctx.fillText("THEME", 240, gridTop);
    ctx.fillStyle = "#333333";
    ctx.font = "600 12px sans-serif";
    ctx.fillText((formData.theme || "TBD").toUpperCase(), 240, gridTop + 20);

    ctx.fillStyle = "#999999";
    ctx.font = "600 8px sans-serif";
    ctx.fillText("DATE", 400, gridTop);
    ctx.fillStyle = "#333333";
    ctx.font = "600 12px sans-serif";
    ctx.fillText(formData.date || "TBD", 400, gridTop + 20);

    return canvas.toDataURL("image/png");
  };

  const handleSubmit = async () => {
    const prefixes = ["Hidden", "Silent", "Amber", "Velvet", "Golden", "Crimson", "Azure"];
    const suffixes = ["Fox", "Shadow", "Moon", "Rose", "Willow", "Jasper", "Lark"];
    const newAlias = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}_${Math.floor(Math.random() * 99) + 1}`;
    setAlias(newAlias);

    const agents = ["SilverPhantom", "CrimsonMist", "OnyxEdge", "EtherealPulse", "SilentSiren"];
    const agentAlias = agents[Math.floor(Math.random() * agents.length)];
    setAssignedAgent(agentAlias);

    const imageData = await generateIdentityCard(newAlias, agentAlias);
    setIdentityImage(imageData);
    setStep(4);
  };

  const downloadIdentity = () => {
    if (!identityImage) return;
    const fileName = `nawi-${(alias || "identity").toLowerCase()}.png`;
    try {
      const parts = identityImage.split(";base64,");
      const contentType = parts[0].split(":")[1] || "image/png";
      const raw = window.atob(parts[1]);
      const uInt8Array = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; ++i) uInt8Array[i] = raw.charCodeAt(i);
      const blob = new Blob([uInt8Array], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      document.body.appendChild(link);
      link.download = fileName;
      link.href = url;
      link.click();
      setTimeout(() => { window.URL.revokeObjectURL(url); document.body.removeChild(link); }, 100);
    } catch {
      const link = document.createElement("a");
      link.download = fileName;
      link.href = identityImage;
      link.click();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-burgundy/5 overflow-hidden"
    >
      {/* Progress Bar */}
      {step <= totalSteps && (
        <div className="h-1 bg-background-secondary w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            className="h-full bg-burgundy"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      )}

      <div className="p-8 md:p-12">
        <AnimatePresence mode="wait">

          {/* ─── STEP 1: Event Type ─── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center">
                <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">Step 1 of {totalSteps}</p>
                <h2 className="text-2xl font-bold text-grey-dark mb-1">What are we designing?</h2>
                <p className="text-grey-medium text-sm">Choose the occasion and we'll tailor everything around it.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {EVENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, eventType: type.id })}
                    className={`p-5 rounded-2xl border-2 transition-all text-left group ${
                      formData.eventType === type.id
                        ? "border-burgundy bg-burgundy/5 shadow-inner"
                        : "border-grey-light hover:border-burgundy/30"
                    }`}
                  >
                    <span className="text-2xl block mb-2">{type.icon}</span>
                    <span className={`block font-bold text-sm mb-1 ${formData.eventType === type.id ? "text-burgundy" : "text-grey-dark"}`}>
                      {type.label}
                    </span>
                    <span className="text-xs text-grey-medium leading-snug">{type.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-grey-dark">
                  Theme or vision <span className="font-normal text-grey-medium">(optional — describe the atmosphere you imagine)</span>
                </label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="e.g. Garden candles and soft jazz, or a rooftop surprise..."
                  className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none transition-colors text-sm"
                />
              </div>

              <button
                onClick={nextStep}
                disabled={!formData.eventType}
                className="w-full py-4 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </motion.div>
          )}

          {/* ─── STEP 2: Logistics ─── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center">
                <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">Step 2 of {totalSteps}</p>
                <h2 className="text-2xl font-bold text-grey-dark mb-1">When & where?</h2>
                <p className="text-grey-medium text-sm">Help us plan the logistics around your perfect moment.</p>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-grey-dark">Event Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none transition-colors text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-grey-dark">Preferred Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Guest Count */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-grey-dark">Number of Guests</label>
                <div className="flex gap-3 flex-wrap">
                  {["2", "3–5", "6–10", "10+"].map((count) => (
                    <button
                      key={count}
                      onClick={() => setFormData({ ...formData, guestCount: count })}
                      className={`px-6 py-3 rounded-full border-2 text-sm font-bold transition-all ${
                        formData.guestCount === count
                          ? "border-burgundy bg-burgundy text-white"
                          : "border-grey-light text-grey-medium hover:border-burgundy/30"
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-grey-dark">Venue Preference</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: "EXTERNAL", label: "Source a venue for us", sub: "Hotel, Airbnb, private space — we handle it" },
                    { id: "CLIENT", label: "We have a venue", sub: "Home, rented space, or existing booking" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setFormData({ ...formData, venue: v.id })}
                      className={`p-5 rounded-2xl border-2 text-left transition-all ${
                        formData.venue === v.id
                          ? "border-burgundy bg-burgundy/5 text-burgundy"
                          : "border-grey-light hover:border-burgundy/20 text-grey-medium"
                      }`}
                    >
                      <span className="block font-bold text-sm mb-1">{v.label}</span>
                      <span className="text-xs opacity-70">{v.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 rounded-full border-2 border-burgundy/20 text-burgundy font-bold hover:bg-burgundy/5 transition-all">
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!formData.date}
                  className="flex-[2] py-4 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Almost There
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 3: Enhancements ─── */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="text-center">
                <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">Step 3 of {totalSteps}</p>
                <h2 className="text-2xl font-bold text-grey-dark mb-1">Finishing touches</h2>
                <p className="text-grey-medium text-sm">Select any enhancements to elevate the experience.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS.map((addon) => {
                  const selected = formData.addons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-5 rounded-2xl border-2 text-left transition-all flex items-start justify-between gap-3 ${
                        selected
                          ? "border-burgundy bg-burgundy/5"
                          : "border-grey-light hover:border-burgundy/20 text-grey-medium"
                      }`}
                    >
                      <div>
                        <span className={`block font-bold text-sm mb-1 ${selected ? "text-burgundy" : "text-grey-dark"}`}>
                          {addon.label}
                        </span>
                        <span className="text-xs text-grey-medium leading-snug">{addon.desc}</span>
                      </div>
                      {selected && (
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Special Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-grey-dark">
                  Special requests or notes <span className="font-normal text-grey-medium">(optional)</span>
                </label>
                <textarea
                  value={formData.specialNotes}
                  onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                  placeholder="Any allergies, specific wishes, surprise instructions, or anything our team should know..."
                  rows={3}
                  className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none transition-colors text-sm resize-none"
                />
              </div>

              {/* Anonymous booking note */}
              <div className="flex items-center gap-4 bg-background-secondary rounded-2xl px-6 py-4 border border-burgundy/5">
                <div className="w-10 h-10 rounded-full border-2 border-burgundy/20 flex items-center justify-center text-burgundy italic font-serif text-sm flex-shrink-0">N</div>
                <div>
                  <p className="text-sm font-bold text-grey-dark">Anonymous Booking</p>
                  <p className="text-xs text-grey-medium">You'll receive a private alias and a dedicated concierge — no real names required.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 rounded-full border-2 border-burgundy/20 text-burgundy font-bold hover:bg-burgundy/5 transition-all">
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-[2] py-4 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all"
                >
                  Submit Request
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── STEP 4: Confirmation ─── */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4 space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto"
              >
                <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold text-grey-dark mb-2">Request Received</h2>
                <p className="text-grey-medium text-sm max-w-md mx-auto leading-relaxed">
                  Your concierge <span className="font-semibold text-burgundy">{assignedAgent}</span> has been assigned and will be in touch discreetly. Your alias is your identity with us.
                </p>
              </div>

              {identityImage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-burgundy/10 bg-white"
                >
                  <img src={identityImage} alt="Nawi Experience Confirmation" className="w-full h-auto" />
                  <div className="p-4 bg-background-secondary border-t border-burgundy/5 text-xs text-grey-medium italic">
                    Your private credentials — save this for your records.
                  </div>
                </motion.div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={downloadIdentity}
                  className="px-8 py-3 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Confirmation
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-8 py-3 rounded-full border-2 border-burgundy text-burgundy font-bold hover:bg-burgundy hover:text-white transition-all text-sm"
                >
                  Return to Nawi
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 px-4">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-4 block"
          >
            Private Booking
          </motion.span>
          <h1 className="text-4xl font-bold text-grey-dark mb-5 tracking-tight">
            <AnimatedText text="Design Your Experience" type="letters" />
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-base text-grey-medium max-w-xl mx-auto"
          >
            Whether it's a honeymoon, a birthday, a proposal, or a celebration all your own — tell us the vision and we'll bring it to life.
          </motion.p>
        </div>

        <Suspense fallback={
          <div className="text-center py-20 text-burgundy font-bold animate-pulse italic text-sm">
            Preparing your booking form...
          </div>
        }>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
