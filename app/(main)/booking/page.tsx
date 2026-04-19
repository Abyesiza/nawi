'use client';

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const PLACE_TYPES = [
  { id: "AIRBNB", label: "Airbnb" },
  { id: "BOAT_CRUISE", label: "Boat Cruise" },
  { id: "FOREST_COTTAGE", label: "Forest Cottage" },
  { id: "ISLAND", label: "Island" },
  { id: "GAMEPARK", label: "Gamepark" },
  { id: "HOTEL", label: "Hotel" },
  { id: "OTHER", label: "Other" },
];

const ADDONS = [
  { id: "photographer", label: "Private Photographer", desc: "Discreet, artistic coverage" },
  { id: "florals", label: "Luxury Florals", desc: "Premium arrangements" },
  { id: "massage", label: "Couple Massage", desc: "In-suite therapists" },
  { id: "stealth_pickup", label: "Stealth Pickup", desc: "Private chauffeur" },
  { id: "catering", label: "Private Chef", desc: "Bespoke dining in-venue" },
  { id: "silent_setup", label: "Silent Setup", desc: "Venue prepared without contact" },
  { id: "cake", label: "Custom Cake", desc: "Artisanal treats" },
  { id: "music", label: "Live Music / Playlist", desc: "Violin, sax or playlist" },
  { id: "rose_petals", label: "Rose Petal Path", desc: "Pathway, bed, bathtub" },
  { id: "candle_dinner", label: "Candle-Light Dinner", desc: "Themed table setup" },
  { id: "champagne", label: "Champagne Service", desc: "On ice, on arrival" },
  { id: "lingerie_box", label: "Lingerie Gift Box", desc: "Curated selection" },
];

interface FormData {
  eventType: string;
  theme: string;
  guestCount: string;
  venuePref: "EXTERNAL" | "CLIENT";
  placeType: string;
  destination: string;
  roomRating: string;
  pickupRequired: boolean;
  dateFrom: string;
  dateTo: string;
  preferredTime: string;
  addons: string[];
  specialNotes: string;
  contactMethod: "WHATSAPP" | "EMAIL" | "NONE";
  contactValue: string;
}

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTheme = searchParams.get("theme") || "";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    alias: string;
    password: string;
    agentPersona: string;
  } | null>(null);
  const [identityImage, setIdentityImage] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    eventType: "",
    theme: initialTheme,
    guestCount: "2",
    venuePref: "EXTERNAL",
    placeType: "",
    destination: "",
    roomRating: "",
    pickupRequired: false,
    dateFrom: "",
    dateTo: "",
    preferredTime: "",
    addons: [],
    specialNotes: "",
    contactMethod: "NONE",
    contactValue: "",
  });

  const totalSteps = 4;
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

  async function generateIdentityCard(alias: string, password: string, agent: string) {
    const canvas = document.createElement("canvas");
    canvas.width = 600; canvas.height = 460;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    const r = 40;
    ctx.moveTo(r, 0); ctx.lineTo(canvas.width - r, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
    ctx.lineTo(canvas.width, canvas.height - r);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
    ctx.lineTo(r, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
    ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0); ctx.closePath(); ctx.fill();
    ctx.textAlign = "center";

    try {
      const logo = new Image(); logo.src = "/nawilogo.png";
      await new Promise((res, rej) => { logo.onload = res; logo.onerror = rej; });
      const h = 52, w = (logo.naturalWidth / logo.naturalHeight) * h;
      ctx.drawImage(logo, (canvas.width - w) / 2, 30, w, h);
    } catch {
      ctx.fillStyle = "#800020"; ctx.font = "italic 700 18px serif";
      ctx.fillText("Nawi Experiences", canvas.width / 2, 70);
    }
    ctx.fillStyle = "#333"; ctx.font = "600 10px sans-serif";
    ctx.fillText("PRIVATE EXPERIENCE CREDENTIALS", canvas.width / 2, 102);

    ctx.fillStyle = "#999"; ctx.font = "600 9px sans-serif";
    ctx.fillText("USERNAME", canvas.width / 2, 138);
    ctx.fillStyle = "#800020"; ctx.font = "italic 36px serif";
    ctx.fillText(alias, canvas.width / 2, 178);

    ctx.fillStyle = "#999"; ctx.font = "600 9px sans-serif";
    ctx.fillText("PASSWORD", canvas.width / 2, 215);
    ctx.fillStyle = "#3A3A3A"; ctx.font = "bold 22px monospace";
    ctx.fillText(password, canvas.width / 2, 248);

    ctx.beginPath();
    ctx.moveTo(120, 280); ctx.lineTo(480, 280);
    ctx.strokeStyle = "#80002015"; ctx.stroke();

    ctx.fillStyle = "#999"; ctx.font = "600 8px sans-serif";
    ctx.fillText("YOUR ASSIGNED CONCIERGE", canvas.width / 2, 305);
    ctx.fillStyle = "#333"; ctx.font = "bold 16px sans-serif";
    ctx.fillText(agent, canvas.width / 2, 328);
    ctx.fillStyle = "#800020"; ctx.font = "500 10px sans-serif";
    ctx.fillText("Login → /login   ·   Save this card. It's shown only once.", canvas.width / 2, 352);

    try {
      const qrData = JSON.stringify({ alias, agent });
      const qrUrl = await QRCode.toDataURL(qrData, { margin: 0, color: { dark: "#800020", light: "#FFFFFF00" } });
      const qrImg = new Image(); qrImg.src = qrUrl;
      await new Promise((res) => { qrImg.onload = res; });
      ctx.drawImage(qrImg, canvas.width - 110, canvas.height - 90, 60, 60);
    } catch {}

    return canvas.toDataURL("image/png");
  }

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: formData.eventType,
          theme: formData.theme,
          dateFrom: formData.dateFrom ? new Date(formData.dateFrom).toISOString() : "",
          dateTo: formData.dateTo ? new Date(formData.dateTo).toISOString() : null,
          preferredTime: formData.preferredTime,
          guestCount: formData.guestCount,
          venuePref: formData.venuePref,
          placeType: formData.placeType || null,
          destination: formData.destination,
          roomRating: formData.roomRating ? Number(formData.roomRating) : null,
          pickupRequired: formData.pickupRequired,
          addons: formData.addons,
          productIds: [],
          specialNotes: formData.specialNotes,
          contactMethod: formData.contactMethod,
          contactValue: formData.contactValue,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setResult({ alias: data.alias, password: data.password, agentPersona: data.agentPersona });
      const img = await generateIdentityCard(data.alias, data.password, data.agentPersona);
      setIdentityImage(img);
      setStep(5);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadIdentity = () => {
    if (!identityImage || !result) return;
    const link = document.createElement("a");
    link.download = `nawi-${result.alias.toLowerCase()}.png`;
    link.href = identityImage;
    link.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-burgundy/5 overflow-hidden"
    >
      {step <= totalSteps && (
        <div className="h-1 bg-background-secondary w-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            className="h-full bg-burgundy"
            transition={{ duration: 0.6 }}
          />
        </div>
      )}

      <div className="p-8 md:p-12">
        <AnimatePresence mode="wait">

          {/* STEP 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center">
                <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">Step 1 of {totalSteps}</p>
                <h2 className="text-2xl font-bold text-grey-dark mb-1">What are we designing?</h2>
                <p className="text-grey-medium text-sm">Choose the occasion and we&apos;ll tailor everything around it.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {EVENT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setFormData({ ...formData, eventType: t.id })}
                    className={`p-5 rounded-2xl border-2 text-left transition-all ${
                      formData.eventType === t.id ? "border-burgundy bg-burgundy/5" : "border-grey-light hover:border-burgundy/30"
                    }`}
                  >
                    <span className="text-2xl block mb-2">{t.icon}</span>
                    <span className={`block font-bold text-sm mb-1 ${formData.eventType === t.id ? "text-burgundy" : "text-grey-dark"}`}>{t.label}</span>
                    <span className="text-xs text-grey-medium leading-snug">{t.desc}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-grey-dark">
                  Theme or vision <span className="font-normal text-grey-medium">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.theme}
                  onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                  placeholder="e.g. Garden candles and soft jazz, or a rooftop surprise..."
                  className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm"
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

          {/* STEP 2 — Dates / Place */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center">
                <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">Step 2 of {totalSteps}</p>
                <h2 className="text-2xl font-bold text-grey-dark mb-1">When &amp; where?</h2>
                <p className="text-grey-medium text-sm">Dates, venue and any pickup logistics.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold tracking-widest uppercase text-grey-medium">Date From</label>
                  <input type="date" value={formData.dateFrom} onChange={(e) => setFormData({ ...formData, dateFrom: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold tracking-widest uppercase text-grey-medium">Date To <span className="font-normal lowercase tracking-normal">(opt.)</span></label>
                  <input type="date" value={formData.dateTo} onChange={(e) => setFormData({ ...formData, dateTo: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold tracking-widest uppercase text-grey-medium">Preferred Time</label>
                  <input type="time" value={formData.preferredTime} onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-grey-dark">Number of Guests</label>
                <div className="flex gap-3 flex-wrap">
                  {["2", "3–5", "6–10", "10+"].map((c) => (
                    <button key={c} onClick={() => setFormData({ ...formData, guestCount: c })}
                      className={`px-6 py-2.5 rounded-full border-2 text-sm font-bold transition-all ${
                        formData.guestCount === c ? "border-burgundy bg-burgundy text-white" : "border-grey-light text-grey-medium hover:border-burgundy/30"
                      }`}>{c}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-grey-dark">Venue</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "EXTERNAL", label: "Source a venue for us", sub: "We handle the booking" },
                    { id: "CLIENT", label: "We have a venue", sub: "Home, rented, or existing" },
                  ].map((v) => (
                    <button key={v.id} onClick={() => setFormData({ ...formData, venuePref: v.id as "EXTERNAL" | "CLIENT" })}
                      className={`p-4 rounded-2xl border-2 text-left ${
                        formData.venuePref === v.id ? "border-burgundy bg-burgundy/5 text-burgundy" : "border-grey-light hover:border-burgundy/20 text-grey-medium"
                      }`}>
                      <span className="block font-bold text-sm">{v.label}</span>
                      <span className="text-xs opacity-70">{v.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.venuePref === "EXTERNAL" && (
                <>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-grey-dark">Place type</label>
                    <div className="flex gap-2 flex-wrap">
                      {PLACE_TYPES.map((p) => (
                        <button key={p.id} onClick={() => setFormData({ ...formData, placeType: p.id })}
                          className={`px-4 py-2 rounded-full border text-xs font-semibold tracking-wide ${
                            formData.placeType === p.id ? "bg-burgundy text-white border-burgundy" : "bg-white text-grey-medium border-grey-light hover:border-burgundy/30"
                          }`}>{p.label}</button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-grey-dark">Destination</label>
                      <input type="text" value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        placeholder="e.g. Entebbe, Jinja, Murchison..."
                        className="w-full px-4 py-3 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-grey-dark">Room rating</label>
                      <div className="flex gap-2">
                        {[3, 4, 5].map((r) => (
                          <button key={r} onClick={() => setFormData({ ...formData, roomRating: String(r) })}
                            className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold ${
                              formData.roomRating === String(r) ? "border-burgundy bg-burgundy text-white" : "border-grey-light text-grey-medium hover:border-burgundy/30"
                            }`}>{r === 5 ? "5★+" : `${r}★`}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <label className="flex items-center gap-3 bg-background-secondary rounded-xl px-4 py-3 cursor-pointer">
                <input type="checkbox" checked={formData.pickupRequired}
                  onChange={(e) => setFormData({ ...formData, pickupRequired: e.target.checked })}
                  className="w-4 h-4 accent-burgundy" />
                <span className="text-sm font-medium text-grey-dark">Add private pickup service</span>
              </label>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 rounded-full border-2 border-burgundy/20 text-burgundy font-bold hover:bg-burgundy/5">Back</button>
                <button onClick={nextStep} disabled={!formData.dateFrom}
                  className="flex-[2] py-4 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all disabled:opacity-40">Continue</button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Enhancements */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center">
                <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">Step 3 of {totalSteps}</p>
                <h2 className="text-2xl font-bold text-grey-dark mb-1">Finishing touches</h2>
                <p className="text-grey-medium text-sm">Browse our full marketplace later from your dashboard.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDONS.map((a) => {
                  const sel = formData.addons.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => toggleAddon(a.id)}
                      className={`p-4 rounded-2xl border-2 text-left flex items-start justify-between gap-3 ${
                        sel ? "border-burgundy bg-burgundy/5" : "border-grey-light hover:border-burgundy/20 text-grey-medium"
                      }`}>
                      <div>
                        <span className={`block font-bold text-sm mb-0.5 ${sel ? "text-burgundy" : "text-grey-dark"}`}>{a.label}</span>
                        <span className="text-xs text-grey-medium leading-snug">{a.desc}</span>
                      </div>
                      {sel && <div className="w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center text-xs">✓</div>}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-grey-dark">Special notes <span className="font-normal text-grey-medium">(optional)</span></label>
                <textarea value={formData.specialNotes} onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                  placeholder="Allergies, surprise instructions, anything our team should know..." rows={3}
                  className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm resize-none" />
              </div>

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 rounded-full border-2 border-burgundy/20 text-burgundy font-bold hover:bg-burgundy/5">Back</button>
                <button onClick={nextStep} className="flex-[2] py-4 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light">Continue</button>
              </div>
            </motion.div>
          )}

          {/* STEP 4 — Contact preference */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div className="text-center">
                <p className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-2">Step 4 of {totalSteps}</p>
                <h2 className="text-2xl font-bold text-grey-dark mb-1">How should we reach you?</h2>
                <p className="text-grey-medium text-sm">
                  Optional. Sharing a contact lets your concierge reach out — we encrypt it at rest and only your assigned agent (under their persona name) can see it.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: "WHATSAPP", label: "WhatsApp", sub: "Auto messages from concierge" },
                  { id: "EMAIL", label: "Email", sub: "Discreet, neutral subject lines" },
                  { id: "NONE", label: "Don't share yet", sub: "I'll check the dashboard" },
                ].map((c) => (
                  <button key={c.id} onClick={() => setFormData({ ...formData, contactMethod: c.id as FormData["contactMethod"], contactValue: c.id === "NONE" ? "" : formData.contactValue })}
                    className={`p-4 rounded-2xl border-2 text-left ${
                      formData.contactMethod === c.id ? "border-burgundy bg-burgundy/5 text-burgundy" : "border-grey-light hover:border-burgundy/20 text-grey-medium"
                    }`}>
                    <span className="block font-bold text-sm">{c.label}</span>
                    <span className="text-xs opacity-70">{c.sub}</span>
                  </button>
                ))}
              </div>

              {formData.contactMethod !== "NONE" && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-grey-dark">
                    {formData.contactMethod === "WHATSAPP" ? "WhatsApp number (with country code)" : "Email address"}
                  </label>
                  <input
                    type={formData.contactMethod === "EMAIL" ? "email" : "tel"}
                    value={formData.contactValue}
                    onChange={(e) => setFormData({ ...formData, contactValue: e.target.value })}
                    placeholder={formData.contactMethod === "WHATSAPP" ? "+256 700 000 000" : "you@example.com"}
                    className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm"
                  />
                  <p className="text-xs text-grey-medium">Encrypted at rest with AES-256-GCM. Never sold or shared.</p>
                </div>
              )}

              <div className="bg-background-secondary rounded-2xl px-5 py-4 border border-burgundy/5 text-xs text-grey-medium leading-relaxed">
                On submit we instantly create your private account and assign a concierge under a persona name. Your username and password appear on a one-time identity card. <strong className="text-grey-dark">Save it.</strong>
              </div>

              {error && (
                <div className="bg-burgundy/5 border border-burgundy/20 text-burgundy text-sm rounded-xl px-4 py-3">{error}</div>
              )}

              <div className="flex gap-4">
                <button onClick={prevStep} className="flex-1 py-4 rounded-full border-2 border-burgundy/20 text-burgundy font-bold hover:bg-burgundy/5">Back</button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-[2] py-4 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all disabled:opacity-40">
                  {submitting ? "Creating your account..." : "Submit & Create Account"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5 — Confirmation */}
          {step === 5 && result && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4 space-y-6">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-grey-dark mb-2">Your account is live.</h2>
                <p className="text-grey-medium text-sm max-w-md mx-auto leading-relaxed">
                  Your concierge <span className="font-semibold text-burgundy">{result.agentPersona}</span> has been assigned. Save the card below — your password is shown only once.
                </p>
              </div>

              {identityImage && (
                <div className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-burgundy/10 bg-white">
                  <img src={identityImage} alt="Nawi Experience Confirmation" className="w-full h-auto" />
                  <div className="p-3 bg-background-secondary text-xs text-grey-medium italic">
                    Username: <strong className="text-burgundy not-italic">{result.alias}</strong> · Password: <strong className="text-grey-dark not-italic font-mono">{result.password}</strong>
                  </div>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={downloadIdentity}
                  className="px-8 py-3 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all flex items-center justify-center gap-2 text-sm">
                  Download Card
                </button>
                <button onClick={() => router.push("/dashboard")}
                  className="px-8 py-3 rounded-full border-2 border-burgundy text-burgundy font-bold hover:bg-burgundy hover:text-white transition-all text-sm">
                  Open Dashboard →
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
          <span className="text-burgundy font-semibold tracking-widest uppercase text-xs mb-4 block">Private Booking</span>
          <h1 className="text-4xl font-bold text-grey-dark mb-5 tracking-tight">
            <AnimatedText text="Design Your Experience" type="letters" />
          </h1>
          <p className="text-base text-grey-medium max-w-xl mx-auto">
            Honeymoon, birthday, proposal, or something all your own — tell us the vision and we&apos;ll bring it to life.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-20 text-burgundy font-bold animate-pulse italic text-sm">Preparing your booking form...</div>}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
