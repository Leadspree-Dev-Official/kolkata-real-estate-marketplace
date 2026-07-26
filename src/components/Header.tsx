/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Building2, Sparkles, MessageCircleCode, CheckCircle2, Palette, KeyRound } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  businessName?: string;
  contactName?: string;
  themeColor?: string;
  onContactClick: () => void;
  activeInquiriesCount: number;
  onLogoClick?: () => void;
  onOpenOnboarding?: () => void;
  onOpenAdmin?: () => void;
}

export default function Header({
  businessName = "Kolkata Nest",
  contactName = "Sourav B.",
  themeColor = "#ea580c",
  onContactClick,
  activeInquiriesCount,
  onLogoClick,
  onOpenOnboarding,
  onOpenAdmin
}: HeaderProps) {
  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-md shadow-xs sticky top-0 z-40" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Brand */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 cursor-pointer select-none shrink-0" 
            onClick={onLogoClick}
          >
            <motion.div 
              className="text-white p-2 sm:p-2.5 rounded-xl shadow-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: themeColor }}
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              id="header-logo-icon"
            >
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </motion.div>
            <div className="leading-tight">
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="text-base sm:text-xl font-extrabold tracking-tight text-stone-900 font-sans whitespace-nowrap" id="header-brand-name">
                  {businessName}
                </span>
                <span className="hidden sm:flex bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200 items-center shrink-0">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5 text-amber-600" />
                  Premium Flats
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 tracking-wide font-bold whitespace-nowrap">Authentic Joyful Living</p>
            </div>
          </div>

          {/* Quick Stats & Demo Customize Trigger (Desktop) */}
          <div className="hidden lg:flex items-center space-x-6 text-xs font-medium text-stone-600">
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl font-extrabold flex items-center space-x-1.5 shadow-2xs transition-all cursor-pointer"
                title="Design & Personalize Your Brand Demo"
              >
                <Palette className="h-3.5 w-3.5 text-amber-600" />
                <span>Customize Brand Demo</span>
              </button>
            )}

            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>100% Verified</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 flex items-center space-x-2">
              <span className="text-stone-400">Advisor:</span>
              <span className="font-bold text-stone-800 flex items-center">
                {contactName}
                <span className="h-1.5 w-1.5 ml-1.5 rounded-full bg-emerald-500" />
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Mobile / Small screen brand demo trigger */}
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="lg:hidden p-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl font-bold text-xs flex items-center space-x-1 cursor-pointer"
                title="Design Brand Demo"
              >
                <Palette className="h-4 w-4 text-amber-600" />
                <span className="hidden sm:inline">Brand Demo</span>
              </button>
            )}

            <motion.button
              onClick={onContactClick}
              className="relative inline-flex items-center space-x-1.5 sm:space-x-2 bg-stone-900 hover:bg-stone-800 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 shrink-0 cursor-pointer"
              whileTap={{ scale: 0.97 }}
              id="header-contact-btn"
            >
              <MessageCircleCode className="h-4 w-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Inquiries Desk</span>
              <span className="inline sm:hidden">Inquiries</span>
              {activeInquiriesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-white text-[10px] sm:text-[11px] font-bold h-4.5 w-4.5 sm:h-5 sm:w-5 rounded-full flex items-center justify-center animate-bounce border border-white" style={{ backgroundColor: themeColor }}>
                  {activeInquiriesCount}
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
}
