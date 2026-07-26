import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  KeyRound, 
  Lock, 
  Unlock, 
  Building2, 
  Layers, 
  CheckCircle2, 
  MessageSquare, 
  Settings, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Sparkles, 
  Phone, 
  MapPin, 
  Tag, 
  Save, 
  Eye, 
  Clock,
  Send,
  AlertCircle
} from "lucide-react";
import { Property, Inquiry, SiteSettings, InquiryStatus } from "../types";
import { COLOR_PRESETS } from "../utils/brand";

interface AdminConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  onUpdateProperties: (props: Property[]) => void;
  inquiries: Inquiry[];
  onUpdateInquiries: (inquiries: Inquiry[]) => void;
  siteSettings: SiteSettings;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onResetAllDemoData: () => void;
  onShowToast: (msg: string, type?: "success" | "warning" | "info") => void;
}

export default function AdminConsole({
  isOpen,
  onClose,
  properties,
  onUpdateProperties,
  inquiries,
  onUpdateInquiries,
  siteSettings,
  onUpdateSiteSettings,
  onResetAllDemoData,
  onShowToast
}: AdminConsoleProps) {
  // Login State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries" | "settings" | "reset">("listings");

  // Listing Editor Form State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "1234") {
      setIsAuthenticated(true);
      setPinError(false);
      onShowToast("🔑 Authenticated as Administrator", "success");
    } else {
      setPinError(true);
      onShowToast("❌ Incorrect PIN. Default is 1234", "warning");
    }
  };

  // Property CRUD
  const handleSaveProperty = (propertyToSave: Property) => {
    const exists = properties.some((p) => p.id === propertyToSave.id);
    let updated: Property[];
    if (exists) {
      updated = properties.map((p) => (p.id === propertyToSave.id ? propertyToSave : p));
      onShowToast(`Updated property: ${propertyToSave.title}`, "success");
    } else {
      updated = [propertyToSave, ...properties];
      onShowToast(`Added new property: ${propertyToSave.title}`, "success");
    }
    onUpdateProperties(updated);
    setEditingProperty(null);
    setIsAddingNew(false);
  };

  const handleDeleteProperty = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      const updated = properties.filter((p) => p.id !== id);
      onUpdateProperties(updated);
      onShowToast(`Deleted property: ${title}`, "warning");
    }
  };

  // Inquiry Status Update
  const handleUpdateInquiryStatus = (id: string, newStatus: InquiryStatus) => {
    const updated = inquiries.map((inq) =>
      inq.id === id ? { ...inq, status: newStatus } : inq
    );
    onUpdateInquiries(updated);
    onShowToast(`Inquiry status updated to ${newStatus}`, "info");
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm("Delete this inquiry record?")) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      onUpdateInquiries(updated);
      onShowToast("Inquiry deleted", "warning");
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings(settingsForm);
    onShowToast("Global Site Settings updated successfully!", "success");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md">
          {/* Backdrop Click */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0"
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-5xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto"
          >
            {/* Top Bar Header */}
            <div className="bg-stone-900 text-stone-100 p-4 sm:p-5 flex items-center justify-between border-b border-stone-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-orange-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-md">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <span>🔑 Executive Admin Console</span>
                    {isAuthenticated && (
                      <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                        Authorized Session
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-stone-400 font-medium">
                    Manage real-time property listings, track incoming client inquiries, and adjust global settings.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* UNAUTHENTICATED: LOGIN PIN PROMPT */}
            {!isAuthenticated ? (
              <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto flex flex-col items-center">
                <div className="h-16 w-16 bg-orange-100 dark:bg-orange-950/60 text-orange-600 rounded-full flex items-center justify-center mb-4">
                  <Lock className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-black text-stone-900 dark:text-stone-100 mb-1">
                  Administrator Access
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-6 font-medium">
                  Please enter the security PIN to unlock the control panel. <br />
                  <span className="text-orange-600 font-bold">Default PIN: 1234</span>
                </p>

                <form onSubmit={handleLogin} className="w-full space-y-4">
                  <div>
                    <input
                      type="password"
                      maxLength={6}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Enter PIN (1234)"
                      className={`w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border text-center font-mono font-bold text-lg text-stone-900 dark:text-stone-100 rounded-2xl focus:outline-none transition-all ${
                        pinError ? "border-red-500 ring-2 ring-red-500/20" : "border-stone-200 dark:border-stone-700"
                      }`}
                      autoFocus
                    />
                    {pinError && (
                      <p className="text-xs font-bold text-red-500 mt-1.5 flex items-center justify-center gap-1">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <span>Incorrect PIN. Try 1234</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Unlock className="h-4 w-4 text-orange-400" />
                    <span>Unlock Admin Console</span>
                  </button>
                </form>
              </div>
            ) : (
              /* AUTHENTICATED ADMIN DASHBOARD */
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Admin Navigation Tabs */}
                <div className="bg-stone-100 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800 px-4 pt-3 flex flex-wrap gap-2 shrink-0">
                  <button
                    onClick={() => { setActiveTab("listings"); setEditingProperty(null); setIsAddingNew(false); }}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                      activeTab === "listings"
                        ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-t-2 border-orange-600 shadow-xs"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    <Building2 className="h-4 w-4 text-orange-600" />
                    <span>Property Listings ({properties.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("inquiries"); setEditingProperty(null); setIsAddingNew(false); }}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer relative ${
                      activeTab === "inquiries"
                        ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-t-2 border-orange-600 shadow-xs"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 text-orange-600" />
                    <span>Order & Inquiry Tracker ({inquiries.length})</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("settings"); setEditingProperty(null); setIsAddingNew(false); }}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                      activeTab === "settings"
                        ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-t-2 border-orange-600 shadow-xs"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    <Settings className="h-4 w-4 text-orange-600" />
                    <span>Site & Brand Settings</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab("reset"); setEditingProperty(null); setIsAddingNew(false); }}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold transition-all flex items-center space-x-2 cursor-pointer ${
                      activeTab === "reset"
                        ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 border-t-2 border-orange-600 shadow-xs"
                        : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                    }`}
                  >
                    <RotateCcw className="h-4 w-4 text-red-500" />
                    <span>Reset Demo Cache</span>
                  </button>
                </div>

                {/* TAB CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-50 dark:bg-stone-900">
                  {/* TAB 1: PROPERTY LISTINGS EDITOR */}
                  {activeTab === "listings" && (
                    <div>
                      {/* Header + Add New Button */}
                      {!editingProperty && !isAddingNew ? (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                                Live Property Content Editor
                              </h4>
                              <p className="text-xs text-stone-500">
                                Add, edit, or remove properties. All changes update on the live site instantly.
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                setIsAddingNew(true);
                                setEditingProperty({
                                  id: `prop-${Date.now()}`,
                                  title: "New Luxury Apartment",
                                  price: 85,
                                  location: "New Town",
                                  address: "Action Area I, New Town, Kolkata - 700156",
                                  bhk: 3,
                                  area: 1400,
                                  status: "Ready to Move",
                                  developer: "Kolkata Nest Developers",
                                  possessionDate: "Immediate",
                                  description: "Spacious modern apartment with top amenities.",
                                  amenities: ["Swimming Pool", "Gym", "Clubhouse", "24x7 Security"],
                                  nearbyLandmarks: ["Metro Station (5 mins)", "Eco Park"],
                                  images: [
                                    { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", caption: "Exterior View" }
                                  ],
                                  floorPlanRooms: []
                                });
                              }}
                              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                            >
                              <Plus className="h-4 w-4" />
                              <span>Add New Property</span>
                            </button>
                          </div>

                          {/* Table / Grid of properties */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {properties.map((prop) => (
                              <div
                                key={prop.id}
                                className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-2xl shadow-xs flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center space-x-3 overflow-hidden">
                                  <img
                                    src={prop.images[0]?.url}
                                    alt={prop.title}
                                    className="h-14 w-14 rounded-xl object-cover shrink-0 border border-stone-200"
                                  />
                                  <div className="overflow-hidden">
                                    <h5 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 truncate">
                                      {prop.title}
                                    </h5>
                                    <p className="text-xs text-stone-500 truncate">
                                      {prop.location} • ₹{prop.price} Lakhs • {prop.bhk} BHK
                                    </p>
                                    <span className="inline-block text-[10px] font-bold text-orange-600 mt-0.5">
                                      {prop.status}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-1.5 shrink-0">
                                  <button
                                    onClick={() => setEditingProperty(prop)}
                                    className="p-2 text-stone-600 hover:text-orange-600 dark:text-stone-300 bg-stone-100 hover:bg-orange-50 dark:bg-stone-700 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Property"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProperty(prop.id, prop.title)}
                                    className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                    title="Delete Property"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* EDIT / ADD PROPERTY FORM */
                        <PropertyEditorForm
                          property={editingProperty!}
                          onSave={handleSaveProperty}
                          onCancel={() => { setEditingProperty(null); setIsAddingNew(false); }}
                        />
                      )}
                    </div>
                  )}

                  {/* TAB 2: INQUIRIES & ORDERS TRACKER */}
                  {activeTab === "inquiries" && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                            Incoming Client Inquiries & Tour Requests
                          </h4>
                          <p className="text-xs text-stone-500">
                            Track client leads in real-time. Update status between New, Confirmed, Out for Delivery, or Completed.
                          </p>
                        </div>
                      </div>

                      {inquiries.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                          <MessageSquare className="h-10 w-10 text-stone-400 mx-auto mb-2" />
                          <p className="text-sm font-bold text-stone-600 dark:text-stone-300">No client inquiries received yet.</p>
                          <p className="text-xs text-stone-400 mt-1">Clients sending messages on the Inquiries Desk will appear here.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {inquiries.map((inq) => (
                            <div
                              key={inq.id}
                              className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-4 rounded-2xl shadow-xs space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 dark:border-stone-700/50 pb-2">
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
                                      {inq.userName || "Client"}
                                    </span>
                                    <span className="text-xs text-stone-500 font-mono">
                                      {inq.userPhone}
                                    </span>
                                  </div>
                                  <p className="text-xs font-semibold text-orange-600">
                                    Property: {inq.propertyName}
                                  </p>
                                </div>

                                {/* Status Switcher */}
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-bold text-stone-500">Status:</span>
                                  <select
                                    value={inq.status}
                                    onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as InquiryStatus)}
                                    className={`text-xs font-extrabold px-3 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                                      inq.status === "New"
                                        ? "bg-amber-100 text-amber-900 border-amber-300"
                                        : inq.status === "Confirmed"
                                        ? "bg-sky-100 text-sky-900 border-sky-300"
                                        : inq.status === "Out for Delivery"
                                        ? "bg-purple-100 text-purple-900 border-purple-300"
                                        : "bg-emerald-100 text-emerald-900 border-emerald-300"
                                    }`}
                                  >
                                    <option value="New">🟢 New Inquiry</option>
                                    <option value="Confirmed">🔵 Confirmed</option>
                                    <option value="Out for Delivery">🚚 Out for Delivery / Tour</option>
                                    <option value="Completed">✅ Completed</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteInquiry(inq.id)}
                                    className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
                                    title="Delete Inquiry"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Chat Log Preview */}
                              <div className="bg-stone-50 dark:bg-stone-900 p-3 rounded-xl max-h-36 overflow-y-auto space-y-1.5 text-xs">
                                {inq.messages.map((m) => (
                                  <div key={m.id} className="flex items-start space-x-2">
                                    <span className={`font-bold shrink-0 ${m.sender === "user" ? "text-stone-700 dark:text-stone-300" : "text-orange-600"}`}>
                                      {m.sender === "user" ? "Client:" : "Advisor:"}
                                    </span>
                                    <span className="text-stone-600 dark:text-stone-400">{m.text}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: SITE & BRAND SETTINGS */}
                  {activeTab === "settings" && (
                    <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl mx-auto">
                      <div>
                        <h4 className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                          Global Site & Portal Settings
                        </h4>
                        <p className="text-xs text-stone-500">
                          Configure default brand name, contact phone, business address, and default primary color.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-stone-700 dark:text-stone-300 mb-1">
                          Default Business Name
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.businessName}
                          onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-extrabold text-stone-700 dark:text-stone-300 mb-1">
                            Head Advisor Name
                          </label>
                          <input
                            type="text"
                            required
                            value={settingsForm.contactName}
                            onChange={(e) => setSettingsForm({ ...settingsForm, contactName: e.target.value })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold text-stone-700 dark:text-stone-300 mb-1">
                            Inquiry Hotline Phone
                          </label>
                          <input
                            type="text"
                            required
                            value={settingsForm.phone}
                            onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                            className="w-full px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-stone-700 dark:text-stone-300 mb-1">
                          Corporate Address
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.address}
                          onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-stone-700 dark:text-stone-300 mb-1">
                          RERA Registration ID
                        </label>
                        <input
                          type="text"
                          required
                          value={settingsForm.reraId}
                          onChange={(e) => setSettingsForm({ ...settingsForm, reraId: e.target.value })}
                          className="w-full px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold text-stone-900 dark:text-stone-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-stone-700 dark:text-stone-300 mb-1">
                          Default Primary Brand Color (Hex)
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={settingsForm.primaryColor}
                            onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                            className="h-9 w-12 rounded-lg cursor-pointer border-0"
                          />
                          <input
                            type="text"
                            value={settingsForm.primaryColor}
                            onChange={(e) => setSettingsForm({ ...settingsForm, primaryColor: e.target.value })}
                            className="flex-1 px-3.5 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-sm font-bold text-stone-900 dark:text-stone-100"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <Save className="h-4 w-4 text-orange-400" />
                        <span>Save Global Settings</span>
                      </button>
                    </form>
                  )}

                  {/* TAB 4: RESET DEMO DATA & CACHE */}
                  {activeTab === "reset" && (
                    <div className="space-y-6 max-w-xl mx-auto text-center py-6">
                      <div className="h-16 w-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                        <RotateCcw className="h-8 w-8" />
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-stone-900 dark:text-stone-100">
                          Reset Demo Cache & Session State
                        </h4>
                        <p className="text-xs text-stone-500 mt-1">
                          Quickly flush saved visitor profile cache, reset the 3-hour timer, or revert all property listings back to original Kolkata Nest defaults.
                        </p>
                      </div>

                      <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 p-5 rounded-2xl space-y-4 text-left">
                        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700 pb-3">
                          <div>
                            <h5 className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                              3-Hour Session Cache
                            </h5>
                            <p className="text-[11px] text-stone-500">
                              Flushes saved visitor profile and re-opens Onboarding Modal.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              onResetAllDemoData();
                              onShowToast("🧹 Session cache flushed!", "info");
                            }}
                            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                          >
                            Flush Cache
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-xs font-extrabold text-red-600">
                              Revert All Property Listings
                            </h5>
                            <p className="text-[11px] text-stone-500">
                              Restores original Kolkata Nest properties & settings.
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm("Reset all properties and settings to default?")) {
                                onResetAllDemoData();
                                onShowToast("🔄 Site restored to factory defaults!", "success");
                              }
                            }}
                            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
                          >
                            Reset Defaults
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

{/* Sub-component: Property Editor Form */}
function PropertyEditorForm({
  property,
  onSave,
  onCancel
}: {
  property: Property;
  onSave: (p: Property) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Property>(property);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700">
      <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-700 pb-3">
        <h5 className="text-sm font-extrabold text-stone-900 dark:text-stone-100">
          Edit Property: {form.title}
        </h5>
        <button
          type="button"
          onClick={onCancel}
          className="text-stone-400 hover:text-stone-600 text-xs font-bold"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">Title</label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">Price (in Lakhs)</label>
          <input
            type="number"
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">Location</label>
          <select
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value as any })}
            className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
          >
            <option value="Ballygunge">Ballygunge</option>
            <option value="New Town">New Town</option>
            <option value="Salt Lake">Salt Lake</option>
            <option value="Rajarhat">Rajarhat</option>
            <option value="Behala">Behala</option>
            <option value="Garia">Garia</option>
            <option value="Jadavpur">Jadavpur</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">BHK</label>
          <input
            type="number"
            required
            value={form.bhk}
            onChange={(e) => setForm({ ...form, bhk: Number(e.target.value) })}
            className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">Area (sqft)</label>
          <input
            type="number"
            required
            value={form.area}
            onChange={(e) => setForm({ ...form, area: Number(e.target.value) })}
            className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
            className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
          >
            <option value="Ready to Move">Ready to Move</option>
            <option value="Under Construction">Under Construction</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 mb-1">Developer</label>
          <input
            type="text"
            required
            value={form.developer}
            onChange={(e) => setForm({ ...form, developer: e.target.value })}
            className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-bold text-stone-500 mb-1">Full Address</label>
        <input
          type="text"
          required
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-bold text-stone-900 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-stone-500 mb-1">Main Image URL</label>
        <input
          type="text"
          required
          value={form.images[0]?.url || ""}
          onChange={(e) => {
            const newImgs = [...form.images];
            if (newImgs[0]) newImgs[0].url = e.target.value;
            else newImgs.push({ url: e.target.value, caption: "Main" });
            setForm({ ...form, images: newImgs });
          }}
          className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-mono font-bold text-stone-900 dark:text-stone-100"
        />
      </div>

      <div>
        <label className="block text-[11px] font-bold text-stone-500 mb-1">Description</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-1.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg text-xs font-medium text-stone-900 dark:text-stone-100"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow-xs"
        >
          Save Property Changes
        </button>
      </div>
    </form>
  );
}
