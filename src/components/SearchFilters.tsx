/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, MapPin, SlidersHorizontal, IndianRupee, RotateCcw, Home, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  selectedBhk: string;
  setSelectedBhk: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  onReset: () => void;
}

const KOLKATA_NEIGHBORHOODS = [
  { value: "all", label: "All Neighborhoods" },
  { value: "Ballygunge", label: "Ballygunge (South Kolkata)" },
  { value: "New Town", label: "New Town (IT Hub & Eco Park)" },
  { value: "Salt Lake", label: "Salt Lake (Sector V & IT)" },
  { value: "Garia", label: "Garia (Metro Connected)" },
  { value: "Behala", label: "Behala (South West Hub)" },
  { value: "Rajarhat", label: "Rajarhat (Upcoming Meadows)" },
];

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  selectedLocation,
  setSelectedLocation,
  selectedBhk,
  setSelectedBhk,
  selectedStatus,
  setSelectedStatus,
  maxPrice,
  setMaxPrice,
  onReset
}: SearchFiltersProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Calculate active filter count
  const activeFiltersCount = 
    (selectedLocation !== "all" ? 1 : 0) +
    (selectedBhk !== "all" ? 1 : 0) +
    (selectedStatus !== "all" ? 1 : 0) +
    (maxPrice !== 300 ? 1 : 0);

  const handleClearAll = () => {
    onReset();
    setShowMobileFilters(false);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs max-w-7xl mx-auto my-6" id="search-filter-container">
      {/* Search Bar & Simple Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
        {/* Keyword Input */}
        <div className="relative flex-1" id="filter-keyword-container">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search flats, builders, or keyword details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-xl text-stone-900 placeholder-stone-400 font-sans text-sm outline-none transition-colors"
            id="filter-keyword-input"
          />
        </div>

        {/* Action Controls for Mobile vs Desktop */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`lg:hidden flex-1 sm:flex-initial flex items-center justify-center space-x-2 border px-4 py-3 rounded-xl text-xs font-bold transition-all focus:outline-none ${
              showMobileFilters || activeFiltersCount > 0
                ? "bg-orange-50 border-orange-200 text-orange-700"
                : "bg-white border-stone-200 text-stone-700"
            }`}
            id="filter-toggle-mobile-btn"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-orange-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            {showMobileFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center justify-center space-x-1 text-stone-500 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 border border-stone-200 px-4 py-3 rounded-xl text-xs font-bold transition-all focus:outline-none"
              id="filter-reset-btn"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Specialized Filters - Collapsible on Mobile, always open on Desktop */}
      <div className={`mt-5 lg:block ${showMobileFilters ? "block" : "hidden"}`} id="filter-options-wrapper">
        <div className="h-px bg-stone-150 w-full mb-5 lg:block hidden" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="filter-options-grid">
          {/* Neighborhood Selector */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-stone-700 tracking-wider uppercase flex items-center space-x-1">
              <MapPin className="h-3.5 w-3.5 text-stone-400" />
              <span>Kolkata Location</span>
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 focus:border-stone-400 text-stone-800 text-sm rounded-xl px-3 py-3 outline-none transition-colors font-sans cursor-pointer"
              id="filter-location-select"
            >
              {KOLKATA_NEIGHBORHOODS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* BHK Configuration */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-stone-700 tracking-wider uppercase flex items-center space-x-1">
              <Home className="h-3.5 w-3.5 text-stone-400" />
              <span>Room Config (BHK)</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-stone-50 p-1 border border-stone-200 rounded-xl" id="bhk-tabs">
              {["all", "2", "3", "4"].map((bhk) => (
                <button
                  key={bhk}
                  onClick={() => setSelectedBhk(bhk)}
                  className={`py-2 text-xs font-extrabold rounded-lg transition-all focus:outline-none cursor-pointer ${
                    selectedBhk === bhk
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {bhk === "all" ? "All" : `${bhk}B`}
                </button>
              ))}
            </div>
          </div>

          {/* Construction Status */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-stone-700 tracking-wider uppercase flex items-center space-x-1">
              <SlidersHorizontal className="h-3.5 w-3.5 text-stone-400" />
              <span>Possession Status</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-stone-50 p-1 border border-stone-200 rounded-xl" id="status-tabs">
              {[
                { value: "all", label: "All" },
                { value: "Ready to Move", label: "Ready" },
                { value: "Under Construction", label: "Under" }
              ].map((st) => (
                <button
                  key={st.value}
                  onClick={() => setSelectedStatus(st.value)}
                  className={`py-2 text-xs font-extrabold rounded-lg transition-all truncate focus:outline-none cursor-pointer ${
                    selectedStatus === st.value
                      ? "bg-white text-stone-900 shadow-xs"
                      : "text-stone-500 hover:text-stone-800"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Limit Slider */}
          <div className="flex flex-col space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-stone-700 tracking-wider uppercase">
              <span className="flex items-center space-x-1">
                <IndianRupee className="h-3.5 w-3.5 text-stone-400" />
                <span>Max Budget</span>
              </span>
              <span className="text-orange-700 font-mono text-sm tracking-normal font-bold">
                {maxPrice >= 300 ? "Any Budget" : maxPrice >= 100 ? `₹${(maxPrice / 100).toFixed(2)} Cr` : `₹${maxPrice} Lakhs`}
              </span>
            </div>
            <div className="flex items-center space-x-3 py-1.5">
              <input
                type="range"
                min="40"
                max="300"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-orange-600 h-1.5 bg-stone-100 rounded-lg cursor-pointer"
                id="filter-price-slider"
              />
            </div>
            <div className="flex justify-between text-[10px] text-stone-400 font-bold font-mono">
              <span>₹40L</span>
              <span>₹1.5Cr</span>
              <span>₹3.0Cr+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
