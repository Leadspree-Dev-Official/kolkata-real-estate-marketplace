import { VisitorProfile, SiteSettings } from "../types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  businessName: "Kolkata Nest",
  contactName: "Sourav Banerjee",
  phone: "+91 98310 12345",
  address: "Diamond Harbour Road, Behala, Kolkata - 700034",
  primaryColor: "#ea580c", // Kolkata Orange
  reraId: "WBRERA/P/KOL/2026/000412",
};

export const DEFAULT_VISITOR_PROFILE: VisitorProfile = {
  businessName: "Kolkata Nest",
  contactName: "Sourav Banerjee",
  phone: "+91 98310 12345",
  address: "Diamond Harbour Road, Behala, Kolkata - 700034",
  themeColor: "#ea580c",
  submittedAt: Date.now(),
};

export const COLOR_PRESETS = [
  { name: "Kolkata Sunburst", hex: "#ea580c" },
  { name: "Royal Emerald", hex: "#059669" },
  { name: "Sapphire Bengal", hex: "#2563eb" },
  { name: "Imperial Purple", hex: "#7c3aed" },
  { name: "Crimson Rose", hex: "#dc2626" },
  { name: "Golden Amber", hex: "#d97706" },
  { name: "Charcoal Slate", hex: "#334155" },
  { name: "Teal Horizon", hex: "#0d9488" },
];

export const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export function applyBrandTheme(colorHex: string) {
  if (!colorHex) colorHex = "#ea580c";
  
  const root = document.documentElement;
  root.style.setProperty("--brand-color", colorHex);
  
  // Calculate darkened hover shade
  const hoverHex = adjustHexBrightness(colorHex, -15);
  root.style.setProperty("--brand-color-hover", hoverHex);
  
  // Light background & border
  root.style.setProperty("--brand-color-light", `${colorHex}15`);
  root.style.setProperty("--brand-color-border", `${colorHex}35`);
}

function adjustHexBrightness(hex: string, percent: number): string {
  let num = parseInt(hex.replace("#", ""), 16);
  if (isNaN(num)) return hex;
  let r = (num >> 16) + percent;
  if (r > 255) r = 255; else if (r < 0) r = 0;
  let b = ((num >> 8) & 0x00FF) + percent;
  if (b > 255) b = 255; else if (b < 0) b = 0;
  let g = (num & 0x0000FF) + percent;
  if (g > 255) g = 255; else if (g < 0) g = 0;
  return "#" + (g | (b << 8) | (r << 16)).toString(16).padStart(6, "0");
}

export function generateDemoToken(profile: Partial<VisitorProfile>): string {
  try {
    const data = {
      bn: profile.businessName || "Kolkata Nest",
      cn: profile.contactName || "Sourav Banerjee",
      ph: profile.phone || "+91 98310 12345",
      ad: profile.address || "Kolkata",
      tc: profile.themeColor || "#ea580c",
      ts: Date.now()
    };
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (e) {
    console.error("Failed to generate token", e);
    return "";
  }
}

export function parseDemoToken(token: string): VisitorProfile | null {
  try {
    const decoded = decodeURIComponent(atob(token));
    const data = JSON.parse(decoded);
    if (data && data.bn) {
      return {
        businessName: data.bn,
        contactName: data.cn || "Advisor",
        phone: data.ph || "",
        address: data.ad || "",
        themeColor: data.tc || "#ea580c",
        submittedAt: data.ts || Date.now()
      };
    }
  } catch (e) {
    console.error("Invalid token", e);
  }
  return null;
}

export function formatTimeRemaining(remainingMs: number): string {
  if (remainingMs <= 0) return "0m 0s";
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }
  return `${minutes}m ${seconds}s`;
}
