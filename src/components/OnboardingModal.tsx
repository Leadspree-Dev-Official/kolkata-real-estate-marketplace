import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  Sparkles, 
  Paintbrush, 
  Share2, 
  Clock, 
  Check, 
  Phone, 
  MapPin, 
  User, 
  RotateCcw,
  X,
  Palette,
  ExternalLink
} from "lucide-react";
import { VisitorProfile } from "../types";
import { COLOR_PRESETS, THREE_HOURS_MS, formatTimeRemaining, generateDemoToken } from "../utils/brand";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (profile: VisitorProfile) => void;
  initialProfile: VisitorProfile;
  onShowToast: (msg: string, type?: "success" | "warning" | "info") => void;
  onResetSession?: () => void;
}

export default function OnboardingModal({
  isOpen,
  onClose,
  onSubmit,
  initialProfile,
  onShowToast,
  onResetSession
}: OnboardingModalProps) {
  const [businessName, setBusinessName] = useState(initialProfile?.businessName ?? "");
  const [contactName, setContactName] = useState(initialProfile?.contactName ?? "");
  const [phone, setPhone] = useState(initialProfile?.phone ?? "");
  const [address, setAddress] = useState(initialProfile?.address ?? "");
  const [themeColor, setThemeColor] = useState(initialProfile?.themeColor || "#ea580c");

  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync state when initialProfile changes
  useEffect(() => {
    if (initialProfile) {
      setBusinessName(initialProfile.businessName ?? "");
      setContactName(initialProfile.contactName ?? "");
      setPhone(initialProfile.phone ?? "");
      setAddress(initialProfile.address ?? "");
      setThemeColor(initialProfile.themeColor || "#ea580c");
    }
  }, [initialProfile]);

  // Live timer countdown for 3-hour session
  useEffect(() => {
    const updateCountdown = () => {
      if (initialProfile && initialProfile.submittedAt) {
        const elapsed = Date.now() - initialProfile.submittedAt;
        const remaining = THREE_HOURS_MS - elapsed;
        setTimeRemaining(remaining > 0 ? remaining : 0);
      } else {
        setTimeRemaining(THREE_HOURS_MS);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [initialProfile]);

  const handleResetForm = () => {
    setBusinessName("");
    setContactName("");
    setPhone("");
    setAddress("");
    setThemeColor("#ea580c");
    if (onResetSession) {
      onResetSession();
    }
    onShowToast("🧹 Form reset! All fields cleared to blank.", "info");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newProfile: VisitorProfile = {
      businessName: businessName.trim(),
      contactName: contactName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      themeColor: themeColor || "#ea580c",
      submittedAt: Date.now()
    };

    onSubmit(newProfile);
    onShowToast(`🎉 Brand settings updated!`, "success");
    onClose();
  };

  const handleShareDemo = () => {
    const tempProfile = {
      businessName,
      contactName,
      phone,
      address,
      themeColor,
      submittedAt: Date.now()
    };
    const token = generateDemoToken(tempProfile);
    const origin = window.location.origin + window.location.pathname;
    const shareUrl = `${origin}?token=${token}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      onShowToast("📋 Personalized demo link copied to clipboard! Share it with your clients.", "success");
      setTimeout(() => setCopiedLink(false), 3000);
    }).catch(() => {
      onShowToast("Copied link URL: " + shareUrl, "info");
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-stone-950/70 backdrop-blur-md">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={onClose}
          />

          {/* Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-2xl border border-stone-200/80 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
          >
            {/* Header Gradient Top Bar */}
            <div 
              className="h-2 w-full transition-colors duration-300"
              style={{ backgroundColor: themeColor }}
            />

            <div className="p-6 sm:p-8">
              {/* Top Controls & Status Pills */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    <Sparkles className="h-3 w-3 text-amber-600 shrink-0" />
                    <span>Brand Demo Engine</span>
                  </span>

                  {/* Countdown Live Pill */}
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-stone-100 text-stone-700 border border-stone-200">
                    <Clock className="h-3 w-3 text-stone-500 animate-spin-slow shrink-0" />
                    <span>Resets in {formatTimeRemaining(timeRemaining)}</span>
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer ml-auto"
                  title="Close Modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Title & Subtitle */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
                  <span>🎨 Design Your Brand Demo</span>
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 font-medium">
                  Personalize this real estate portal instantly. All changes update live across listings, contact desks, and headers.
                </p>
                
                {/* Session Policy Banner */}
                <div className="mt-3 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 p-2.5 rounded-xl flex items-center justify-between text-stone-600 dark:text-stone-300 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-600 shrink-0" />
                    <span>Session Policy: Form opens on visit & auto-resets every 3 hours.</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="text-[11px] font-bold text-red-600 hover:text-red-700 underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reset Form to Blank</span>
                  </button>
                </div>
              </div>

              {/* Form inputs */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Business Name */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-stone-400" />
                      <span>Business Name</span>
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Kolkata Nest Realty"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>

                  {/* Contact Name */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-stone-400" />
                      <span>Advisor / Contact Name</span>
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Sourav Banerjee"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Phone Number / WhatsApp */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-stone-400" />
                      <span>Phone / WhatsApp</span>
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98310 12345"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>

                  {/* Business Address */}
                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-stone-400" />
                      <span>Business Address</span>
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Park Street, Kolkata 700016"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>

                {/* Primary Brand Theme Color Selector */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-stone-400" />
                      <span>Primary Brand Theme Color</span>
                    </span>
                    <span className="font-mono font-bold text-stone-500 text-[11px]">{themeColor}</span>
                  </label>

                  {/* Color Presets */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {COLOR_PRESETS.map((preset) => {
                      const isSelected = themeColor.toLowerCase() === preset.hex.toLowerCase();
                      return (
                        <button
                          key={preset.hex}
                          type="button"
                          onClick={() => setThemeColor(preset.hex)}
                          className={`group relative h-8 px-3 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                            isSelected 
                              ? "ring-2 ring-stone-900 dark:ring-white ring-offset-2 scale-105 border-transparent text-white" 
                              : "border-stone-200 dark:border-stone-700 hover:scale-102 text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800"
                          }`}
                          style={{
                            backgroundColor: isSelected ? preset.hex : undefined
                          }}
                        >
                          <span 
                            className="h-3 w-3 rounded-full border border-black/10 shrink-0" 
                            style={{ backgroundColor: preset.hex }}
                          />
                          <span>{preset.name}</span>
                          {isSelected && <Check className="h-3 w-3 ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Hex Picker Input */}
                  <div className="flex items-center space-x-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-2 rounded-xl">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="h-9 w-12 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <div className="flex-1">
                      <p className="text-[10px] uppercase font-bold text-stone-400">Custom Color Picker / Hex</p>
                      <input
                        type="text"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        placeholder="#ea580c"
                        className="w-full bg-transparent font-mono font-bold text-sm text-stone-900 dark:text-stone-100 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleShareDemo}
                    className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-stone-200 dark:border-stone-700"
                  >
                    <Share2 className="h-4 w-4 text-orange-600" />
                    <span>{copiedLink ? "Link Copied!" : "Share Personalized Demo Link"}</span>
                  </button>

                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2.5 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Skip / Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-2.5 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all transform active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5"
                      style={{ backgroundColor: themeColor }}
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Apply & Save Brand Demo</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
