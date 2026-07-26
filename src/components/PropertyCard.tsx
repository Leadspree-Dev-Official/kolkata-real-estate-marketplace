/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, KeyRound, Maximize, Landmark, MessageSquare, ArrowUpRight } from "lucide-react";
import { Property } from "../types";
import { motion } from "motion/react";

interface PropertyCardProps {
  key?: string;
  property: Property;
  isSelected: boolean;
  onSelect: () => void;
  onInquire: () => void;
}

export default function PropertyCard({ property, isSelected, onSelect, onInquire }: PropertyCardProps) {
  // Convert price to Crore/Lakh representation
  const formattedPriceVal = property.price >= 100 
    ? `₹${(property.price / 100).toFixed(2)}` 
    : `₹${property.price}`;
  const priceSuffix = property.price >= 100 ? "Cr" : "Lakh";

  return (
    <motion.div
      className={`group bg-white rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col h-full cursor-pointer ${
        isSelected 
          ? "border-orange-600 ring-2 ring-orange-500/10 shadow-lg" 
          : "border-stone-200 hover:border-stone-400 hover:shadow-md"
      }`}
      onClick={onSelect}
      whileHover={{ y: -4 }}
      id={`property-card-${property.id}`}
    >
      {/* Property Thumbnail Image */}
      <div className="relative overflow-hidden aspect-video bg-stone-100" id={`property-card-img-container-${property.id}`}>
        <img
          src={property.images[0].url}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          id={`property-card-img-${property.id}`}
        />
        
        {/* BHK Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-stone-900/90 text-white text-[9px] sm:text-xs font-bold font-mono px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-xs flex items-center space-x-1 shadow-xs">
          <span>{property.bhk} BHK</span>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-[9px] sm:text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-xs shadow-xs ${
          property.status === "Ready to Move"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-amber-50 text-amber-800 border border-amber-200"
        }`}>
          <span className="sm:inline hidden">{property.status}</span>
          <span className="inline sm:hidden">{property.status === "Ready to Move" ? "Ready" : "Under Const."}</span>
        </div>
        
        {/* Overlay gradient for dark-to-light effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent pointer-events-none" />
      </div>

      {/* Card Content details */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between" id={`property-card-details-${property.id}`}>
        <div>
          {/* Price Tag & Location */}
          <div className="flex justify-between items-center mb-1.5 sm:mb-2.5 gap-1.5">
            <span className="text-sm sm:text-lg lg:text-xl font-black font-mono text-orange-700 tracking-tight whitespace-nowrap" id={`property-card-price-${property.id}`}>
              {formattedPriceVal}
              <span className="text-[10px] sm:text-xs font-bold font-sans text-orange-600 ml-0.5">{priceSuffix}</span>
            </span>
            <span className="text-[9px] sm:text-xs font-bold text-stone-500 flex items-center space-x-0.5 font-mono shrink-0">
              <Maximize className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-stone-400 shrink-0" />
              <span>{property.area} sqft</span>
            </span>
          </div>

          {/* Title & Developer */}
          <h3 className="text-xs sm:text-base font-extrabold text-stone-900 truncate group-hover:text-orange-700 transition-colors mb-0.5 sm:mb-1" id={`property-card-title-${property.id}`}>
            {property.title}
          </h3>
          <p className="text-[10px] sm:text-xs font-medium text-stone-500 mb-2 sm:mb-3 flex items-center space-x-1">
            <Landmark className="h-3 w-3 text-stone-400 shrink-0" />
            <span className="truncate">by {property.developer}</span>
          </p>

          {/* Location details */}
          <p className="text-[10px] sm:text-xs text-stone-600 flex items-center space-x-1 sm:space-x-1.5 mb-3 sm:mb-4 font-sans">
            <MapPin className="h-3.5 w-3.5 text-orange-600 shrink-0" />
            <span className="truncate block w-full">{property.address}</span>
          </p>
        </div>

        {/* Action Controls Footer */}
        <div className="pt-2.5 sm:pt-4 border-t border-stone-100 flex items-center justify-between gap-2" id={`property-card-footer-${property.id}`}>
          {/* Quick Info text - hidden on mobile for cleaner spacing */}
          <span className="hidden sm:flex text-[11px] font-bold text-stone-400 items-center space-x-1 shrink-0">
            <KeyRound className="h-3.5 w-3.5 text-stone-300" />
            <span>Keys: {property.possessionDate}</span>
          </span>

          {/* Action buttons */}
          <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInquire();
              }}
              className="p-1.5 sm:p-2 bg-stone-50 hover:bg-orange-50 hover:text-orange-700 text-stone-600 rounded-lg border border-stone-200 hover:border-orange-200 transition-all focus:outline-none cursor-pointer"
              title="Message Agent Sourav"
              id={`property-card-chat-btn-${property.id}`}
            >
              <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center space-x-1 text-[10px] sm:text-xs font-black px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-all border focus:outline-none cursor-pointer ${
                isSelected 
                  ? "bg-orange-600 text-white border-orange-600 hover:bg-orange-700" 
                  : "bg-white text-stone-800 border-stone-200 hover:border-stone-400"
              }`}
              id={`property-card-select-btn-${property.id}`}
            >
              <span>Explore</span>
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
