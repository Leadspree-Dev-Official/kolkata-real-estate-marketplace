import { useState, useEffect } from "react";
import { 
  Building, 
  MapPin, 
  Maximize2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Building2, 
  PhoneCall, 
  MessageCircle,
  Clock,
  Compass,
  ArrowUpRight,
  Info,
  Layers,
  MapIcon,
  KeyRound,
  Palette,
  ShieldCheck,
  Star,
  Search,
  CheckCircle2,
  Award
} from "lucide-react";
import Header from "./components/Header";
import SearchFilters from "./components/SearchFilters";
import PropertyCard from "./components/PropertyCard";
import PropertyGallery from "./components/PropertyGallery";
import FloorPlan from "./components/FloorPlan";
import ChatSystem from "./components/ChatSystem";
import OnboardingModal from "./components/OnboardingModal";
import AdminConsole from "./components/AdminConsole";
import Toast, { ToastMessage } from "./components/Toast";

import { KOLKATA_PROPERTIES } from "./data/listings";
import { Property, VisitorProfile, SiteSettings, Inquiry } from "./types";
import { 
  DEFAULT_VISITOR_PROFILE, 
  DEFAULT_SITE_SETTINGS, 
  THREE_HOURS_MS, 
  applyBrandTheme, 
  parseDemoToken 
} from "./utils/brand";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // --- Persistent Storage State ---
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem("kn_properties");
      return saved ? JSON.parse(saved) : KOLKATA_PROPERTIES;
    } catch {
      return KOLKATA_PROPERTIES;
    }
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem("kn_site_settings");
      return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });

  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile>(() => {
    try {
      // Check URL search parameters for shared demo token ?token=...
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        const parsed = parseDemoToken(token);
        if (parsed) {
          localStorage.setItem("kn_visitor_profile", JSON.stringify(parsed));
          return parsed;
        }
      }

      const saved = localStorage.getItem("kn_visitor_profile");
      return saved ? JSON.parse(saved) : DEFAULT_VISITOR_PROFILE;
    } catch {
      return DEFAULT_VISITOR_PROFILE;
    }
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem("kn_inquiries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & UI Views
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true); // Opens on every visit/refresh
  const [showAdmin, setShowAdmin] = useState<boolean>(() => {
    return window.location.hash === "#admin" || window.location.pathname === "/admin";
  });
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Helper Toast notification display
  const showToast = (message: string, type: "success" | "warning" | "info" = "info") => {
    setToast({ id: `toast-${Date.now()}`, message, type });
  };

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedBhk, setSelectedBhk] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [maxPrice, setMaxPrice] = useState(300); // Max 3.0 Crores (300 Lakhs)

  // View state: 'browse' vs 'detail'
  const [view, setView] = useState<"browse" | "detail">("browse");

  // Selected Property State
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(() => {
    return properties[0]?.id || "prop-1";
  });
  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0] || KOLKATA_PROPERTIES[0];

  // Tab State for Property Details Desk
  const [activeTab, setActiveTab] = useState<"floor" | "specs" | "chat">("floor");

  // Inquiries State tracker
  const [activeInquiriesCount, setActiveInquiriesCount] = useState(0);

  // Mobile layout check
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hash listener for admin route #admin
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#admin" || window.location.pathname === "/admin") {
        setShowAdmin(true);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Apply Theme CSS Custom Properties whenever visitor profile or theme color changes
  useEffect(() => {
    if (visitorProfile && visitorProfile.themeColor) {
      applyBrandTheme(visitorProfile.themeColor);
    }
  }, [visitorProfile]);

  // 3-Hour Session Auto-Reset Policy continuous background polling
  useEffect(() => {
    const checkSessionExpiration = () => {
      if (visitorProfile && visitorProfile.submittedAt) {
        const elapsed = Date.now() - visitorProfile.submittedAt;
        if (elapsed >= THREE_HOURS_MS) {
          // Session expired!
          localStorage.removeItem("kn_visitor_profile");
          const resetProf: VisitorProfile = {
            businessName: "",
            contactName: "",
            phone: "",
            address: "",
            themeColor: "#ea580c",
            submittedAt: Date.now()
          };
          setVisitorProfile(resetProf);
          setShowOnboarding(true);
          showToast("🕒 3 hours completed! Your form was reset to blank automatically.", "warning");
        }
      }
    };

    checkSessionExpiration();
    const interval = setInterval(checkSessionExpiration, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [visitorProfile]);

  // Sync state to LocalStorage
  const handleUpdateVisitorProfile = (newProfile: VisitorProfile) => {
    setVisitorProfile(newProfile);
    localStorage.setItem("kn_visitor_profile", JSON.stringify(newProfile));
    applyBrandTheme(newProfile.themeColor);
  };

  const handleUpdateProperties = (newProps: Property[]) => {
    setProperties(newProps);
    localStorage.setItem("kn_properties", JSON.stringify(newProps));
  };

  const handleUpdateInquiries = (newInqs: Inquiry[]) => {
    setInquiries(newInqs);
    localStorage.setItem("kn_inquiries", JSON.stringify(newInqs));
  };

  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setSiteSettings(newSettings);
    localStorage.setItem("kn_site_settings", JSON.stringify(newSettings));
  };

  const handleResetAllDemoData = () => {
    localStorage.removeItem("kn_visitor_profile");
    localStorage.removeItem("kn_properties");
    localStorage.removeItem("kn_site_settings");
    localStorage.removeItem("kn_inquiries");

    setVisitorProfile({
      businessName: "",
      contactName: "",
      phone: "",
      address: "",
      themeColor: "#ea580c",
      submittedAt: Date.now()
    });
    setProperties(KOLKATA_PROPERTIES);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setInquiries([]);

    applyBrandTheme("#ea580c");
    setShowOnboarding(true);
  };

  // Carousel State for Hero Showcase
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isHoveringCarousel, setIsHoveringCarousel] = useState(false);

  const CAROUSEL_PROPERTIES = properties.slice(0, 4);

  useEffect(() => {
    if (isHoveringCarousel || CAROUSEL_PROPERTIES.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % CAROUSEL_PROPERTIES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isHoveringCarousel, CAROUSEL_PROPERTIES.length]);

  // Recalculate active inquiries count
  useEffect(() => {
    let count = inquiries.length;
    properties.forEach(p => {
      if (localStorage.getItem(`kn_chat_${p.id}`)) {
        count++;
      }
    });
    setActiveInquiriesCount(count);
  }, [inquiries, properties]);

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("all");
    setSelectedBhk("all");
    setSelectedStatus("all");
    setMaxPrice(300);
  };

  // Filter computation logic
  const filteredProperties = properties.filter((property) => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.amenities.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation = selectedLocation === "all" || property.location === selectedLocation;
    const matchesBhk = selectedBhk === "all" || property.bhk.toString() === selectedBhk;
    const matchesStatus = selectedStatus === "all" || property.status === selectedStatus;
    const matchesPrice = property.price <= maxPrice;

    return matchesSearch && matchesLocation && matchesBhk && matchesStatus && matchesPrice;
  });

  // Handler when clicking Quick Inquiry on a card
  const handleQuickInquiry = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setActiveTab("chat");
    setView("detail");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Select property handler
  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setView("detail");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  // Scroll to inquiries
  const handleInquiriesDeskScroll = () => {
    setView("detail");
    setActiveTab("chat");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-orange-500/20 selection:text-orange-950" id="main-layout-root">
      {/* Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Visitor Onboarding Modal ("Design Your Brand Demo" Engine) */}
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onSubmit={handleUpdateVisitorProfile}
        initialProfile={visitorProfile}
        onShowToast={showToast}
        onResetSession={() => {
          localStorage.removeItem("kn_visitor_profile");
          const blankProf: VisitorProfile = {
            businessName: "",
            contactName: "",
            phone: "",
            address: "",
            themeColor: "#ea580c",
            submittedAt: Date.now()
          };
          setVisitorProfile(blankProf);
          showToast("Session reset! All form fields cleared to blank.", "info");
        }}
      />

      {/* Admin Control Panel Modal */}
      <AdminConsole
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        properties={properties}
        onUpdateProperties={handleUpdateProperties}
        inquiries={inquiries}
        onUpdateInquiries={handleUpdateInquiries}
        siteSettings={siteSettings}
        onUpdateSiteSettings={handleUpdateSiteSettings}
        onResetAllDemoData={handleResetAllDemoData}
        onShowToast={showToast}
      />

      {/* Top Banner Navigation */}
      <Header 
        businessName={visitorProfile.businessName || siteSettings.businessName}
        contactName={visitorProfile.contactName || siteSettings.contactName}
        themeColor={visitorProfile.themeColor || siteSettings.primaryColor}
        onContactClick={handleInquiriesDeskScroll} 
        activeInquiriesCount={activeInquiriesCount} 
        onLogoClick={() => setView("browse")}
        onOpenOnboarding={() => setShowOnboarding(true)}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      <AnimatePresence mode="wait">
        {view === "browse" ? (
          <motion.div
            key="browse-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col flex-1"
          >
            {/* Grand & Expansive Real Estate Hero Banner */}
            <section className="bg-stone-950 text-white pt-14 pb-20 lg:pt-20 lg:pb-28 px-4 sm:px-6 lg:px-8 border-b border-orange-950/30 relative overflow-hidden min-h-[640px] lg:min-h-[720px] flex flex-col justify-center" id="hero-banner">
              {/* Cinematic architecture backdrop image & ambient layer stack */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1800&auto=format&fit=crop&q=80" 
                  alt="Kolkata luxury estate architectural view" 
                  className="w-full h-full object-cover object-center opacity-30 select-none pointer-events-none scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-stone-950/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(249,115,22,0.18),transparent_50%)]" />
                <div className="absolute -top-24 -left-24 h-96 w-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 h-96 w-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
              </div>

              <div className="max-w-7xl mx-auto relative z-10 w-full flex flex-col space-y-12">
                {/* Main Hero Top Grid */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-14">
                  
                  {/* Hero Left Content */}
                  <div className="text-center lg:text-left max-w-2xl flex flex-col items-center lg:items-start">
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/15 to-amber-500/15 border border-orange-500/30 px-4 py-2 rounded-full text-xs font-bold text-orange-300 mb-5 shadow-xs backdrop-blur-md"
                    >
                      <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                      <span>{visitorProfile.businessName || "Kolkata Nest"} • WB-RERA Verified Estates</span>
                    </motion.div>
                    
                    <motion.h1 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-sans leading-[1.08]"
                    >
                      Find Your Dream Flat in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-amber-500">City of Joy</span>
                    </motion.h1>

                    <motion.p 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-base sm:text-lg text-stone-300 mt-5 leading-relaxed font-medium"
                    >
                      Handcrafted luxury residences & verified high-rises across New Town, Salt Lake, South Kolkata & Rajarhat. Connect directly with senior advisor <strong className="text-white font-bold">{visitorProfile.contactName}</strong> ({visitorProfile.phone}).
                    </motion.p>

                    {/* Quick Neighborhood Location Chips */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-2"
                    >
                      <span className="text-xs font-bold text-stone-400 mr-1 uppercase tracking-wider hidden sm:inline">Top Hubs:</span>
                      {[
                        { id: "all", label: "All Kolkata" },
                        { id: "New Town", label: "New Town" },
                        { id: "Salt Lake", label: "Salt Lake Sec V" },
                        { id: "Ballygunge", label: "South Kolkata" },
                        { id: "Rajarhat", label: "Rajarhat" },
                      ].map((chip) => (
                        <button
                          key={chip.id}
                          onClick={() => {
                            setSelectedLocation(chip.id);
                            document.getElementById("listings-main-section")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                            selectedLocation === chip.id
                              ? "bg-orange-500 text-white border-orange-400 shadow-md scale-105"
                              : "bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-white/10 hover:border-white/20"
                          }`}
                        >
                          📍 {chip.label}
                        </button>
                      ))}
                    </motion.div>

                    {/* Trust Badges Bar */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-8 text-xs text-stone-300 font-bold border-t border-white/10 pt-5 w-full"
                    >
                      <span className="flex items-center space-x-1.5"><Building className="h-4 w-4 text-orange-400" /> <span>Direct Builder Connect</span></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-700 hidden sm:inline" />
                      <span className="flex items-center space-x-1.5"><ShieldCheck className="h-4 w-4 text-amber-400" /> <span>₹0 Brokerage Fee</span></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-stone-700 hidden sm:inline" />
                      <span className="flex items-center space-x-1.5"><Clock className="h-4 w-4 text-emerald-400" /> <span>Vastu Compliant Layouts</span></span>
                    </motion.div>
                  </div>

                  {/* Dynamic Image Carousel Showcase - Expanded & Taller */}
                  {CAROUSEL_PROPERTIES.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-full lg:w-[460px] h-[380px] sm:h-[420px] lg:h-[440px] bg-stone-900/60 border border-white/15 rounded-3xl shadow-2xl overflow-hidden relative shrink-0 self-stretch lg:self-auto group backdrop-blur-md"
                      id="hero-carousel"
                      onMouseEnter={() => setIsHoveringCarousel(true)}
                      onMouseLeave={() => setIsHoveringCarousel(false)}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={carouselIndex}
                          initial={{ opacity: 0, scale: 1.03 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 w-full h-full cursor-pointer"
                          onClick={() => handleSelectProperty(CAROUSEL_PROPERTIES[carouselIndex].id)}
                        >
                          {/* Slide Image */}
                          <img 
                            src={CAROUSEL_PROPERTIES[carouselIndex]?.images[0]?.url} 
                            alt={CAROUSEL_PROPERTIES[carouselIndex]?.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          {/* Dark gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
                          
                          {/* Top Badge Overlay */}
                          <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                            <span className="bg-gradient-to-r from-orange-600 to-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1 border border-white/20">
                              <Sparkles className="h-3 w-3" /> Featured Residence
                            </span>
                            <span className="bg-stone-950/80 backdrop-blur-md text-stone-200 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                              {CAROUSEL_PROPERTIES[carouselIndex]?.location}
                            </span>
                          </div>

                          {/* Slide Content Overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end text-left z-10">
                            <div className="flex items-center gap-3 text-xs text-amber-300 font-bold mb-1">
                              <span>{CAROUSEL_PROPERTIES[carouselIndex]?.bhk} BHK Premium Apartment</span>
                              <span>•</span>
                              <span>{CAROUSEL_PROPERTIES[carouselIndex]?.sqft} Sq.Ft</span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-extrabold font-sans tracking-tight text-white leading-snug line-clamp-1">
                              {CAROUSEL_PROPERTIES[carouselIndex]?.title}
                            </h3>
                            
                            <p className="text-xs text-stone-300 mt-1 line-clamp-2 font-medium">
                              {CAROUSEL_PROPERTIES[carouselIndex]?.description}
                            </p>

                            <div className="pt-4 mt-4 border-t border-white/15 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-wider">Starting At</span>
                                <span className="text-base sm:text-lg font-black font-mono text-amber-400">
                                  {CAROUSEL_PROPERTIES[carouselIndex]?.price >= 100 
                                    ? `₹${(CAROUSEL_PROPERTIES[carouselIndex].price / 100).toFixed(2)} Crores` 
                                    : `₹${CAROUSEL_PROPERTIES[carouselIndex]?.price} Lakhs`}
                                </span>
                              </div>
                              
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectProperty(CAROUSEL_PROPERTIES[carouselIndex].id);
                                }}
                                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all flex items-center space-x-1.5 shadow-md hover:scale-105 cursor-pointer"
                              >
                                <span>View Property</span>
                                <ArrowUpRight className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {/* Manual Arrow Buttons */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCarouselIndex((prev) => (prev - 1 + CAROUSEL_PROPERTIES.length) % CAROUSEL_PROPERTIES.length);
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/60 backdrop-blur-md text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-orange-500 cursor-pointer z-20 focus:outline-none flex items-center justify-center shadow-lg"
                        aria-label="Previous Slide"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCarouselIndex((prev) => (prev + 1) % CAROUSEL_PROPERTIES.length);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-950/60 backdrop-blur-md text-white border border-white/15 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-orange-500 cursor-pointer z-20 focus:outline-none flex items-center justify-center shadow-lg"
                        aria-label="Next Slide"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      {/* Dot Indicator Bullets */}
                      <div className="absolute bottom-4 right-6 flex items-center space-x-1.5 z-20 bg-stone-950/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                        {CAROUSEL_PROPERTIES.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarouselIndex(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                              carouselIndex === idx ? "w-5 bg-orange-500" : "w-1.5 bg-white/40 hover:bg-white/75"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Hero Stats Strip */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 sm:p-6 bg-stone-900/70 border border-white/10 rounded-2xl backdrop-blur-md shadow-xl"
                >
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-r border-white/10 pr-2 last:border-0">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">250+</span>
                    <span className="text-xs text-stone-300 font-medium mt-0.5">Verified Kolkata Flats</span>
                  </div>
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-r border-white/10 pr-2 last:border-0">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">₹0</span>
                    <span className="text-xs text-stone-300 font-medium mt-0.5">Brokerage Fee</span>
                  </div>
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left border-r border-white/10 pr-2 last:border-0">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">100%</span>
                    <span className="text-xs text-stone-300 font-medium mt-0.5">WB-RERA Approved</span>
                  </div>
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400 flex items-center gap-1">
                      4.9 <Star className="h-5 w-5 fill-amber-400 text-amber-400 inline" />
                    </span>
                    <span className="text-xs text-stone-300 font-medium mt-0.5">Client Rating (500+ Deals)</span>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* Sticky Search & Filter block */}
            <section className="px-4 sm:px-6 lg:px-8 mt-[-24px] relative z-20" id="filter-wrapper">
              <SearchFilters
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedBhk={selectedBhk}
                setSelectedBhk={setSelectedBhk}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                onReset={handleResetFilters}
              />
            </section>

            {/* Main Listings Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16 flex-1 w-full" id="listings-main-section">
              <div className="flex flex-col space-y-5">
                <div className="flex justify-between items-center px-1">
                  <div>
                    <h2 className="text-xl font-extrabold text-stone-900 font-sans tracking-tight">
                      Available Gated Communities ({filteredProperties.length})
                    </h2>
                    <p className="text-xs text-stone-500 font-medium">Click on any flat to view fully interactive blueprints & chat with advisory</p>
                  </div>
                  {filteredProperties.length !== properties.length && (
                    <span className="bg-stone-200 text-stone-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      Filtered
                    </span>
                  )}
                </div>

                {/* Zero Results Handle */}
                {filteredProperties.length === 0 ? (
                  <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
                    <p className="text-stone-500 text-sm font-semibold mb-2">No properties match your active search filters.</p>
                    <p className="text-xs text-stone-400 mb-4">Try clearing filters or raising your max budget slider.</p>
                    <button
                      onClick={handleResetFilters}
                      className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors focus:outline-none"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  /* Elegant 3-column Grid for browse - 2 columns in a row on mobile view */
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6" id="listings-cards-grid">
                    {filteredProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        isSelected={prop.id === selectedPropertyId}
                        onSelect={() => handleSelectProperty(prop.id)}
                        onInquire={() => handleQuickInquiry(prop.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        ) : (
          /* DEDICATED INTERIOR PAGE FOR SELECTED PROPERTY */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full space-y-6 pb-28 lg:pb-12"
            id="property-detail-page"
          >
            {/* Top Navigation Bar for Interior Page */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <button
                onClick={() => setView("browse")}
                className="inline-flex items-center space-x-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer border border-stone-200 shrink-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>← Back to All Listings</span>
              </button>

              <div className="flex items-center space-x-3 text-xs font-bold text-stone-500 overflow-x-auto py-1">
                <span className="text-stone-900 dark:text-stone-100 font-black">{selectedProperty.developer}</span>
                <span>•</span>
                <span>{selectedProperty.location}</span>
                <span>•</span>
                <span className="text-orange-600">{selectedProperty.status}</span>
              </div>
            </div>

            {/* Title & Overview Header */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-stone-900 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    {selectedProperty.location}
                  </span>
                  <span className="bg-orange-100 text-orange-900 text-[10px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-orange-200">
                    {selectedProperty.status}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-sans">
                  {selectedProperty.title}
                </h1>
                <p className="text-xs sm:text-sm text-stone-500 font-semibold mt-1 flex items-center space-x-1">
                  <MapPin className="h-3.5 w-3.5 text-stone-400 shrink-0" />
                  <span>{selectedProperty.address}</span>
                </p>
              </div>

              <div className="text-left md:text-right shrink-0">
                <span className="text-xs text-stone-400 block font-bold uppercase tracking-wider">Listing Price</span>
                <span className="text-2xl sm:text-3xl font-black font-mono text-orange-600">
                  {selectedProperty.price >= 100 
                    ? `₹${(selectedProperty.price / 100).toFixed(2)} Cr` 
                    : `₹${selectedProperty.price} Lakhs`}
                </span>
                <span className="text-[11px] text-stone-500 block font-bold">
                  ₹{Math.round((selectedProperty.price * 100000) / selectedProperty.area)} / sq.ft
                </span>
              </div>
            </div>

            {/* Photo Gallery Showcase */}
            <PropertyGallery images={selectedProperty.images} propertyName={selectedProperty.title} />

            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white border border-stone-200 p-4 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Configuration</span>
                <span className="text-base font-extrabold text-stone-900">{selectedProperty.bhk} BHK Premium</span>
              </div>
              <div className="bg-white border border-stone-200 p-4 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Super Built-up Area</span>
                <span className="text-base font-extrabold text-stone-900">{selectedProperty.area} sq.ft</span>
              </div>
              <div className="bg-white border border-stone-200 p-4 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Developer</span>
                <span className="text-base font-extrabold text-stone-900 truncate block">{selectedProperty.developer}</span>
              </div>
              <div className="bg-white border border-stone-200 p-4 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Possession Date</span>
                <span className="text-base font-extrabold text-stone-900">{selectedProperty.possessionDate}</span>
              </div>
            </div>

            {/* Interactive Details Desk Section Tabs */}
            <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden" id="details-tab-header">
              <div className="border-b border-stone-200 bg-stone-50/80 px-4 pt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab("floor")}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === "floor"
                      ? "bg-white text-stone-900 border-t-2 border-orange-600 shadow-xs"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <Maximize2 className="h-4 w-4 text-orange-600" />
                  <span>Interactive Blueprint Floorplan</span>
                </button>

                <button
                  onClick={() => setActiveTab("specs")}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === "specs"
                      ? "bg-white text-stone-900 border-t-2 border-orange-600 shadow-xs"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <Info className="h-4 w-4 text-orange-600" />
                  <span>Amenities & Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab("chat")}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer relative ${
                    activeTab === "chat"
                      ? "bg-white text-stone-900 border-t-2 border-orange-600 shadow-xs"
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <MessageCircle className="h-4 w-4 text-orange-600" />
                  <span>Inquiries & Advisor Chat</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="p-4 sm:p-6">
                {activeTab === "floor" && (
                  <FloorPlan rooms={selectedProperty.floorPlanRooms} propertyName={selectedProperty.title} />
                )}

                {activeTab === "specs" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-400 mb-2">Property Description</h3>
                      <p className="text-sm text-stone-700 leading-relaxed font-medium bg-stone-50 p-4 rounded-xl border border-stone-200">
                        {selectedProperty.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-400 mb-3">Amenities & Infrastructure</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {selectedProperty.amenities.map((amenity, idx) => (
                          <div key={idx} className="bg-stone-50 border border-stone-200 p-3 rounded-xl text-xs font-bold text-stone-800 flex items-center space-x-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-stone-400 mb-3">Nearby Landmarks & Transit</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedProperty.nearbyLandmarks.map((landmark, idx) => (
                          <div key={idx} className="bg-amber-50/60 border border-amber-200/80 p-3 rounded-xl text-xs font-bold text-amber-900 flex items-center space-x-2">
                            <Compass className="h-4 w-4 text-amber-600 shrink-0" />
                            <span>{landmark}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "chat" && (
                  <ChatSystem 
                    property={selectedProperty} 
                    onInquiryCreated={() => setActiveInquiriesCount(prev => prev + 1)} 
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Bottom Bar for Mobile Devices in Property Detail View */}
      <AnimatePresence>
        {view === "detail" && isMobile && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 z-30 shadow-2xl flex items-center justify-between gap-3 lg:hidden"
            id="mobile-sticky-action-bar"
          >
            <div>
              <span className="text-[10px] uppercase font-extrabold text-stone-400 block leading-tight">Price</span>
              <span className="text-base font-black font-mono text-orange-600">
                {selectedProperty.price >= 100 
                  ? `₹${(selectedProperty.price / 100).toFixed(2)} Cr` 
                  : `₹${selectedProperty.price} Lakhs`}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`tel:${visitorProfile.phone || siteSettings.phone}`}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold p-2.5 rounded-xl border border-stone-200 transition-colors flex items-center justify-center shrink-0"
                title="Call Advisor"
              >
                <PhoneCall className="h-4 w-4 text-emerald-600" />
              </a>

              <button
                onClick={() => {
                  setActiveTab("chat");
                  const el = document.getElementById("details-tab-header");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Message Advisor</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aesthetic Footer block */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-10 mt-auto" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <Building2 className="h-5 w-5 text-orange-500" />
              <span className="text-white font-bold text-sm tracking-tight">
                {visitorProfile.businessName || siteSettings.businessName} Realty Pvt Ltd
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 font-medium">
              Licensed Brokers Registry • RERA ID: {siteSettings.reraId}
            </p>
            <p className="text-[11px] text-stone-600 mt-0.5 font-medium">
              Head Advisor: {visitorProfile.contactName || siteSettings.contactName} • {visitorProfile.phone || siteSettings.phone} • {visitorProfile.address || siteSettings.address}
            </p>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2">
            {/* Admin Console Trigger Button */}
            <button
              onClick={() => setShowAdmin(true)}
              className="text-xs font-extrabold text-amber-400 hover:text-amber-300 bg-stone-800 hover:bg-stone-700 border border-stone-700 px-3 py-1.5 rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>🔑 Admin Console</span>
            </button>

            <p className="text-xs text-stone-500 font-bold font-mono">
              © {new Date().getFullYear()} {visitorProfile.businessName || siteSettings.businessName}. All Rights Reserved.
            </p>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-stone-500">
          <p>
            Developer: <span className="font-semibold">Aniruddha Das</span> | Developed by{" "}
            <a href="https://leadspree.in" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">
              LeadSpree Business Solutions
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
