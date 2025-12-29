'use client';

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedText from "../_components/animated-text";
import QRCode from "qrcode";

interface FormData {
    type: string;
    theme: string;
    venue: string;
    date: string;
    addons: string[];
}

function BookingForm() {
    const searchParams = useSearchParams();
    const initialTheme = searchParams.get('theme') || "";

    const [step, setStep] = useState(1);
    const [alias, setAlias] = useState("");
    const [assignedAgent, setAssignedAgent] = useState("");
    const [identityImage, setIdentityImage] = useState<string>("");
    const [formData, setFormData] = useState<FormData>({
        type: "ROMANTIC",
        theme: initialTheme,
        venue: "EXTERNAL",
        date: "",
        addons: [] as string[]
    });

    const nextStep = () => setStep((s: number) => s + 1);
    const prevStep = () => setStep((s: number) => s - 1);

    const generateIdentityCard = async (newAlias: string, agentAlias: string) => {
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 420; // Slightly taller for more info
        const ctx = canvas.getContext("2d");
        if (!ctx) return "";

        // Background (Rounded)
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear to ensure transparency if needed

        // Main Card Shape
        ctx.beginPath();
        const radius = 40;
        ctx.moveTo(radius, 0);
        ctx.lineTo(canvas.width - radius, 0);
        ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
        ctx.lineTo(canvas.width, canvas.height - radius);
        ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
        ctx.lineTo(radius, canvas.height);
        ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
        ctx.lineTo(0, radius);
        ctx.quadraticCurveTo(0, 0, radius, 0);
        ctx.closePath();
        ctx.fillStyle = "#FFFFFF";
        ctx.fill();

        // Inner Border (Soft Burgundy)
        ctx.beginPath();
        const innerGap = 20;
        const innerRadius = 30;
        ctx.moveTo(innerGap + innerRadius, innerGap);
        ctx.lineTo(canvas.width - innerGap - innerRadius, innerGap);
        ctx.quadraticCurveTo(canvas.width - innerGap, innerGap, canvas.width - innerGap, innerGap + innerRadius);
        ctx.lineTo(canvas.width - innerGap, canvas.height - innerGap - innerRadius);
        ctx.quadraticCurveTo(canvas.width - innerGap, canvas.height - innerGap, canvas.width - innerGap - innerRadius, canvas.height - innerGap);
        ctx.lineTo(innerGap + innerRadius, canvas.height - innerGap);
        ctx.quadraticCurveTo(innerGap, canvas.height - innerGap, innerGap, canvas.height - innerGap - innerRadius);
        ctx.lineTo(innerGap, innerGap + innerRadius);
        ctx.quadraticCurveTo(innerGap, innerGap, innerGap + innerRadius, innerGap);
        ctx.closePath();
        ctx.strokeStyle = "#80002015"; // Very faint burgundy
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Header: IDENTITY CARD
        ctx.fillStyle = "#333333";
        ctx.font = "600 12px sans-serif";
        ctx.textAlign = "center";
        ctx.letterSpacing = "4px";
        ctx.fillText("IDENTITY CARD", canvas.width / 2, 70);

        // Subtext: NAWI
        ctx.fillStyle = "#800020";
        ctx.font = "italic 700 18px serif";
        ctx.letterSpacing = "2px";
        ctx.fillText("NAWI", canvas.width / 2, 100);

        // Divider
        ctx.beginPath();
        ctx.moveTo(250, 110);
        ctx.lineTo(350, 110);
        ctx.strokeStyle = "#80002030";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Alias Label
        ctx.textAlign = "center";
        ctx.fillStyle = "#666666";
        ctx.font = "600 9px sans-serif";
        ctx.letterSpacing = "1px";
        ctx.fillText("ALLOCATED ALIAS", canvas.width / 2, 135);

        // Actual Alias
        ctx.fillStyle = "#800020";
        ctx.font = "italic 40px serif";
        ctx.fillText(newAlias, canvas.width / 2, 185);

        // Assigned Personnel Section
        const agentTop = 230;
        ctx.beginPath();
        ctx.moveTo(150, agentTop - 10);
        ctx.lineTo(450, agentTop - 10);
        ctx.strokeStyle = "#80002010";
        ctx.stroke();

        ctx.fillStyle = "#999999";
        ctx.font = "600 8px sans-serif";
        ctx.fillText("ASSIGNED SHADOW", canvas.width / 2, agentTop + 10);

        ctx.fillStyle = "#333333";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(agentAlias, canvas.width / 2, agentTop + 30);

        ctx.fillStyle = "#800020";
        ctx.font = "500 10px sans-serif";
        ctx.fillText("contact@nawi.design  •  +1 555 NAWI SHDW", canvas.width / 2, agentTop + 50);

        // QR Code and Info Grid
        const gridTop = 330;

        // QR Code (Encoded details)
        const qrSize = 60;
        const qrData = JSON.stringify({
            alias: newAlias,
            agent: agentAlias,
            theme: formData.theme,
            type: formData.type,
            date: formData.date
        });

        try {
            const qrDataUrl = await QRCode.toDataURL(qrData, {
                margin: 0,
                color: {
                    dark: '#800020',
                    light: '#FFFFFF00' // Transparent
                }
            });
            const qrImg = new Image();
            qrImg.src = qrDataUrl;
            await new Promise((resolve) => { qrImg.onload = resolve; });
            ctx.drawImage(qrImg, canvas.width - 100, gridTop - 15, qrSize, qrSize);
        } catch (e) {
            console.error("QR fail", e);
        }

        ctx.textAlign = "left";

        // Theme
        ctx.fillStyle = "#999999";
        ctx.font = "600 8px sans-serif";
        ctx.fillText("THEME", 80, gridTop);
        ctx.fillStyle = "#333333";
        ctx.font = "600 12px sans-serif";
        ctx.fillText(formData.theme.toUpperCase(), 80, gridTop + 20);

        // Category
        ctx.fillStyle = "#999999";
        ctx.font = "600 8px sans-serif";
        ctx.fillText("CATEGORY", 240, gridTop);
        ctx.fillStyle = "#333333";
        ctx.font = "600 12px sans-serif";
        ctx.fillText(formData.type, 240, gridTop + 20);

        // Date
        ctx.fillStyle = "#999999";
        ctx.font = "600 8px sans-serif";
        ctx.fillText("DATE", 400, gridTop);
        ctx.fillStyle = "#333333";
        ctx.font = "600 12px sans-serif";
        ctx.fillText(formData.date, 400, gridTop + 20);

        return canvas.toDataURL("image/png");
    };

    const handleSubmit = async () => {
        // Mock alias generation
        const prefixes = ["Hidden", "Silent", "Secret", "Amber", "Velvet", "Dark", "Golden"];
        const suffixes = ["Fox", "Shadow", "Moon", "Rose", "Onyx", "Willow", "Jasper"];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const randomNumber = Math.floor(Math.random() * 99) + 1;

        const newAlias = `${randomPrefix}${randomSuffix}_${randomNumber}`;
        setAlias(newAlias);

        // Mock Agent assignment
        const agents = ["SilverPhantom", "CrimsonMist", "OnyxEdge", "EtherealPulse", "SilentSiren"];
        const agentAlias = agents[Math.floor(Math.random() * agents.length)];
        setAssignedAgent(agentAlias);

        // Generate the card image immediately
        const imageData = await generateIdentityCard(newAlias, agentAlias);
        setIdentityImage(imageData);

        setStep(4);
    };

    const downloadIdentity = () => {
        if (!identityImage) return;

        const fileName = `nawi-shadow-${(alias || 'identity').toLowerCase()}.png`;

        try {
            // Convert data URL to blob for more reliable download naming
            const parts = identityImage.split(';base64,');
            const contentType = parts[0].split(':')[1] || 'image/png';
            const raw = window.atob(parts[1]);
            const rawLength = raw.length;
            const uInt8Array = new Uint8Array(rawLength);

            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }

            const blob = new Blob([uInt8Array], { type: contentType });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.style.display = 'none';
            document.body.appendChild(link);
            link.download = fileName;
            link.href = url;
            link.click();

            // Cleanup
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(link);
            }, 100);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback to simple data URL download if blob fails
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
            <div className="h-1 bg-background-secondary w-full">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((step / 3) * 100, 100)}%` }}
                    className="h-full bg-burgundy"
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>

            <div className="p-8 md:p-12">
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-grey-dark mb-2">Step 1: Choose Your Vibe</h2>
                                <p className="text-grey-medium">Select the foundational nature of your experience.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {["ROMANTIC", "FANTASY", "EXPERIMENTAL"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFormData({ ...formData, type })}
                                        className={`p-6 rounded-2xl border-2 transition-all text-center ${formData.type === type
                                            ? "border-burgundy bg-burgundy/5 text-burgundy shadow-inner"
                                            : "border-grey-light hover:border-burgundy/20 text-grey-medium"
                                            }`}
                                    >
                                        <span className="text-sm font-bold tracking-widest">{type}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-grey-dark">Selected Theme (or describe yours)</label>
                                <input
                                    type="text"
                                    value={formData.theme}
                                    onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                                    placeholder="e.g. Forest Sanctuary or a custom idea..."
                                    className="w-full px-6 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none transition-colors"
                                    required
                                />
                            </div>

                            <button
                                onClick={nextStep}
                                className="w-full py-5 rounded-full bg-burgundy text-white font-bold text-lg shadow-lg hover:bg-burgundy-light transition-all"
                            >
                                Next Step
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-grey-dark mb-2">Step 2: Logistics</h2>
                                <p className="text-grey-medium">Where and when shall the magic happen?</p>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-grey-dark">Venue Preference</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: "EXTERNAL", label: "Book a new venue for us", sub: "Airbnb, Hotel, etc." },
                                        { id: "CLIENT", label: "My existing space", sub: "Home, private location" }
                                    ].map((v) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setFormData({ ...formData, venue: v.id })}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.venue === v.id
                                                ? "border-burgundy bg-burgundy/5 text-burgundy"
                                                : "border-grey-light hover:border-burgundy/10 text-grey-medium"
                                                }`}
                                        >
                                            <span className="block font-bold mb-1">{v.label}</span>
                                            <span className="text-xs opacity-70">{v.sub}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-grey-dark">Experience Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-6 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-5 rounded-full border-2 border-burgundy/20 text-burgundy font-bold transition-all hover:bg-burgundy/5">Back</button>
                                <button
                                    onClick={nextStep}
                                    disabled={!formData.date}
                                    className="flex-[2] py-5 rounded-full bg-burgundy text-white font-bold text-lg shadow-lg hover:bg-burgundy-light hover:disabled:bg-burgundy/50 disabled:opacity-50 transition-all"
                                >
                                    Almost There
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="space-y-8"
                        >
                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-grey-dark mb-2">Step 3: Enhance</h2>
                                <p className="text-grey-medium">The finishing touches for absolute perfection.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Stealth Pickup", "Professional Massages", "The Honey Moon Special", "Private Photographer", "Silent Setup (No Contact)"
                                ].map((addon) => (
                                    <button
                                        key={addon}
                                        onClick={() => {
                                            const exists = formData.addons.includes(addon);
                                            setFormData({
                                                ...formData,
                                                addons: exists
                                                    ? formData.addons.filter((a: string) => a !== addon)
                                                    : [...formData.addons, addon]
                                            });
                                        }}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${formData.addons.includes(addon)
                                            ? "border-burgundy bg-burgundy/5 text-burgundy"
                                            : "border-grey-light hover:border-burgundy/10 text-grey-medium"
                                            }`}
                                    >
                                        <span className="font-bold text-sm">{addon}</span>
                                        {formData.addons.includes(addon) && (
                                            <div className="w-5 h-5 rounded-full bg-burgundy text-white flex items-center justify-center">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-burgundy/10">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h4 className="font-bold text-grey-dark">Anonymous Booking</h4>
                                        <p className="text-xs text-grey-medium">You will be assigned an alias (e.g. AmberFox_27) after submission.</p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full border-2 border-burgundy/20 flex items-center justify-center text-burgundy italic font-serif">N</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={prevStep} className="flex-1 py-5 rounded-full border-2 border-burgundy/20 text-burgundy font-bold transition-all hover:bg-burgundy/5">Back</button>
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-[2] py-5 rounded-full bg-burgundy text-white font-bold text-lg shadow-lg hover:bg-burgundy-light transition-all"
                                    >
                                        Submit Fantasy
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6 space-y-6"
                        >
                            <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-2">
                                <svg className="w-8 h-8 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-grey-dark mb-2">Fantasy Submitted</h2>
                                <p className="text-grey-medium max-w-md mx-auto text-sm">
                                    Your request has been sent into the shadows. Our designers are already crafting your portal.
                                </p>
                            </div>

                            {identityImage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-burgundy/10 bg-white"
                                >
                                    <img
                                        src={identityImage}
                                        alt="Nawi Shadow Identity"
                                        className="w-full h-auto"
                                    />
                                    <div className="p-4 bg-background-secondary border-t border-burgundy/5 text-xs text-grey-medium italic">
                                        Your discreet credentials. Save this image for your records.
                                    </div>
                                </motion.div>
                            )}

                            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={downloadIdentity}
                                    className="px-8 py-3 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    Download PNG
                                </button>
                                <button
                                    onClick={() => window.location.href = "/"}
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
                <div className="text-center mb-16 px-4">
                    <motion.span
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="text-burgundy font-semibold tracking-widest uppercase text-sm mb-4 block"
                    >
                        Reservation
                    </motion.span>
                    <h1 className="text-5xl font-bold text-grey-dark mb-6 tracking-tighter">
                        <AnimatedText text="Submit Your Fantasy" type="letters" />
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-lg text-grey-medium max-w-2xl mx-auto italic"
                    >
                        Step into the shadows. We'll handle the logistics, you live the experience.
                    </motion.p>
                </div>

                <Suspense fallback={<div className="text-center py-20 text-burgundy font-bold animate-pulse italic">Connecting to the Shadows...</div>}>
                    <BookingForm />
                </Suspense>
            </div>
        </div>
    );
}
