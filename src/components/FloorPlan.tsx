/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Compass, 
  Eye, 
  Info, 
  Layout, 
  Maximize2, 
  Bed, 
  Sofa, 
  Utensils, 
  Bath, 
  Sun, 
  Sparkles, 
  Layers, 
  Ruler, 
  RotateCw,
  Check,
  Building2,
  X,
  Grid,
  CheckCircle2,
  Tv,
  Coffee,
  Palette
} from "lucide-react";
import { FloorPlanRoom } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface FloorPlanProps {
  rooms: FloorPlanRoom[];
  propertyName: string;
}

// Room category helper for styling, icons & furniture
function getRoomMeta(roomName: string) {
  const lower = roomName.toLowerCase();
  if (lower.includes("living") || lower.includes("lounge") || lower.includes("hall") || lower.includes("adda")) {
    return { 
      type: "living", 
      label: "Living & Dining", 
      icon: Sofa, 
      colorHex: "#3b82f6", 
      bgLight: "#eff6ff", 
      borderLight: "#bfdbfe",
      vastu: "NE / Center - Ideal Energy Flow"
    };
  }
  if (lower.includes("bed") || lower.includes("suite") || lower.includes("room")) {
    return { 
      type: "bedroom", 
      label: "Bedroom Suite", 
      icon: Bed, 
      colorHex: "#8b5cf6", 
      bgLight: "#f5f3ff", 
      borderLight: "#ddd6fe",
      vastu: "SW / West - Vastu Compliant"
    };
  }
  if (lower.includes("kitchen") || lower.includes("chef")) {
    return { 
      type: "kitchen", 
      label: "Modular Kitchen", 
      icon: Utensils, 
      colorHex: "#f59e0b", 
      bgLight: "#fffbeb", 
      borderLight: "#fde68a",
      vastu: "SE (Agneya) - Perfect Vastu Zone"
    };
  }
  if (lower.includes("bath") || lower.includes("ensuite") || lower.includes("toilet")) {
    return { 
      type: "bathroom", 
      label: "Ensuite Bath", 
      icon: Bath, 
      colorHex: "#06b6d4", 
      bgLight: "#ecfeff", 
      borderLight: "#a5f3fc",
      vastu: "NW / East - Well Ventilated"
    };
  }
  if (lower.includes("balcony") || lower.includes("deck") || lower.includes("promenade") || lower.includes("terrace")) {
    return { 
      type: "balcony", 
      label: "Balcony Deck", 
      icon: Sun, 
      colorHex: "#10b981", 
      bgLight: "#f0fdf4", 
      borderLight: "#bbf7d0",
      vastu: "North / East - Abundant Morning Light"
    };
  }
  return { 
    type: "general", 
    label: "Utility Space", 
    icon: Building2, 
    colorHex: "#64748b", 
    bgLight: "#f8fafc", 
    borderLight: "#e2e8f0",
    vastu: "East Facing - Well Lit"
  };
}

// Compute clean SVG box geometry in viewBox 0 0 800 520
function computeRoomBoxes(rooms: FloorPlanRoom[]) {
  const count = rooms.length;
  
  return rooms.map((room, idx) => {
    const meta = getRoomMeta(room.name);
    let box = { x: 40, y: 40, w: 350, h: 220 };

    if (count >= 5) {
      if (idx === 0) box = { x: 40, y: 40, w: 260, h: 260 };       // Top Left (Master Bed)
      else if (idx === 1) box = { x: 300, y: 40, w: 260, h: 260 };   // Top Mid (Living & Dining)
      else if (idx === 2) box = { x: 560, y: 40, w: 200, h: 260 };   // Top Right (Bed 2)
      else if (idx === 3) box = { x: 40, y: 300, w: 260, h: 180 };   // Bottom Left (Bath & Utility)
      else box = { x: 300, y: 300, w: 460, h: 180 };                  // Bottom Right (Balcony & Kitchen)
    } else if (count === 4) {
      if (idx === 0) box = { x: 40, y: 40, w: 350, h: 230 };
      else if (idx === 1) box = { x: 390, y: 40, w: 370, h: 230 };
      else if (idx === 2) box = { x: 40, y: 270, w: 350, h: 210 };
      else box = { x: 390, y: 270, w: 370, h: 210 };
    } else if (count === 3) {
      if (idx === 0) box = { x: 40, y: 40, w: 440, h: 260 };        // Living
      else if (idx === 1) box = { x: 480, y: 40, w: 280, h: 260 };   // Master Bed
      else box = { x: 40, y: 300, w: 720, h: 180 };                  // Kitchen & Deck
    } else {
      // 2 rooms
      if (idx === 0) box = { x: 40, y: 40, w: 360, h: 440 };
      else box = { x: 400, y: 40, w: 360, h: 440 };
    }

    return {
      ...room,
      box,
      meta,
      index: idx
    };
  });
}

export default function FloorPlan({ rooms, propertyName }: FloorPlanProps) {
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);
  const [theme, setTheme] = useState<"cad" | "navy">("cad"); // CAD Warm Paper vs Royal Blueprint Navy
  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [showFurniture, setShowFurniture] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredRoomIndex, setHoveredRoomIndex] = useState<number | null>(null);

  const roomBoxes = computeRoomBoxes(rooms);
  const activeRoom = roomBoxes[selectedRoomIndex] || roomBoxes[0];
  const ActiveIcon = activeRoom.meta.icon;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-6 shadow-xs font-sans" id="floor-plan-interactive-root">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="bg-orange-100 text-orange-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1 border border-orange-200">
              <Layout className="h-3.5 w-3.5 text-orange-600" />
              <span>Architectural Blueprint</span>
            </span>
            <span className="text-xs text-stone-500 font-mono font-bold">
              1:50 Standard Scale
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight font-sans">
            {propertyName} — Interactive Layout
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Furniture Overlay Toggle */}
          <button
            onClick={() => setShowFurniture(!showFurniture)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border flex items-center space-x-1.5 cursor-pointer ${
              showFurniture 
                ? "bg-amber-50 text-amber-900 border-amber-200" 
                : "bg-stone-50 text-stone-600 border-stone-200"
            }`}
            title="Toggle Furnished vs Unfurnished Layout"
          >
            <Sofa className={`h-3.5 w-3.5 ${showFurniture ? "text-amber-600" : "text-stone-400"}`} />
            <span>{showFurniture ? "Furnished" : "Unfurnished"}</span>
          </button>

          {/* Theme Switcher */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200">
            <button
              onClick={() => setTheme("cad")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                theme === "cad"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Ruler className="h-3.5 w-3.5 text-orange-600" />
              <span>CAD Paper</span>
            </button>
            <button
              onClick={() => setTheme("navy")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                theme === "navy"
                  ? "bg-slate-900 text-cyan-300 shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              <span>Blueprint Navy</span>
            </button>
          </div>

          {/* 2D / 3D Isometric Switcher */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200">
            <button
              onClick={() => setViewMode("2d")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                viewMode === "2d"
                  ? "bg-stone-900 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>2D Plan</span>
            </button>
            <button
              onClick={() => setViewMode("3d")}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 cursor-pointer ${
                viewMode === "3d"
                  ? "bg-orange-600 text-white shadow-xs"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <RotateCw className="h-3.5 w-3.5" />
              <span>3D Isometric</span>
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl border border-stone-200 transition-colors cursor-pointer"
            title="Expand Fullscreen Blueprint"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Room Quick Selection Chips */}
      <div className="mb-4 flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-extrabold text-stone-500 uppercase tracking-wider shrink-0 mr-1 font-mono">
          Interactive Rooms:
        </span>
        {roomBoxes.map((room) => {
          const RoomIconComponent = room.meta.icon;
          const isSelected = room.index === selectedRoomIndex;
          return (
            <button
              key={room.index}
              onClick={() => setSelectedRoomIndex(room.index)}
              onMouseEnter={() => setHoveredRoomIndex(room.index)}
              onMouseLeave={() => setHoveredRoomIndex(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-2 cursor-pointer border ${
                isSelected
                  ? "bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-orange-500/20"
                  : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
              }`}
            >
              <RoomIconComponent className={`h-3.5 w-3.5 ${isSelected ? "text-orange-400" : "text-stone-500"}`} />
              <span>{room.name}</span>
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                isSelected ? "bg-stone-800 text-stone-300" : "bg-stone-200 text-stone-600"
              }`}>
                {room.size}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Blueprint Canvas (Left 7 Cols) & Room Details Desk (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* SVG Blueprint Canvas Container */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div 
            className={`relative aspect-4/3 w-full rounded-2xl overflow-hidden border transition-all duration-300 shadow-md select-none ${
              theme === "cad"
                ? "bg-[#faf8f5] border-stone-300"
                : "bg-[#080d1a] border-cyan-900"
            }`}
            style={{
              perspective: viewMode === "3d" ? "1200px" : "none"
            }}
            id="blueprint-canvas-box"
          >
            {/* Grid Pattern Background */}
            {theme === "cad" ? (
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)`,
                  backgroundSize: "24px 24px"
                }}
              />
            ) : (
              <div 
                className="absolute inset-0 opacity-25 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(#0284c7 1px, transparent 1px), linear-gradient(90deg, #0284c7 1px, transparent 1px)`,
                  backgroundSize: "24px 24px"
                }}
              />
            )}

            {/* Top Legend Bar */}
            <div className={`absolute top-3 left-3 text-[10px] font-mono font-bold tracking-wider uppercase z-30 flex items-center space-x-2 ${
              theme === "cad" ? "text-stone-700" : "text-cyan-400"
            }`}>
              <span className="bg-stone-200/90 px-2 py-0.5 rounded text-stone-900 shadow-xs">
                NET AREA: {rooms.reduce((acc, _) => acc + 380, 1100)} SQ.FT
              </span>
              <span className="hidden sm:inline bg-orange-100 text-orange-900 px-2 py-0.5 rounded border border-orange-200">
                VASTU COMPLIANT
              </span>
            </div>

            {/* Compass Rose */}
            <div className={`absolute top-3 right-3 z-30 flex items-center space-x-1 text-[11px] font-mono font-bold px-2 py-1 rounded-xl backdrop-blur-md shadow-xs ${
              theme === "cad" 
                ? "bg-white/90 text-stone-800 border border-stone-200" 
                : "bg-slate-900/90 text-cyan-300 border border-cyan-800"
            }`}>
              <Compass className={`h-4 w-4 ${theme === "cad" ? "text-orange-600" : "text-cyan-400"}`} />
              <span>N ⬆</span>
            </div>

            {/* SVG Architectural Canvas */}
            <div 
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{
                transform: viewMode === "3d" ? "rotateX(42deg) rotateZ(-18deg) scale(0.85) translateY(-25px)" : "none",
                transformStyle: "preserve-3d"
              }}
            >
              <svg 
                viewBox="0 0 800 520" 
                className="w-full h-full" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Defs for gradients & patterns */}
                <defs>
                  <pattern id="woodDeckPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                    <line x1="0" y1="0" x2="0" y2="10" stroke="#10b981" strokeWidth="0.5" opacity="0.25" />
                  </pattern>
                  <pattern id="tilePattern" width="12" height="12" patternUnits="userSpaceOnUse">
                    <rect width="12" height="12" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.2" />
                  </pattern>
                </defs>

                {/* Outer Perimeter Wall Shadow / Border */}
                <rect
                  x="36"
                  y="36"
                  width="728"
                  height="448"
                  fill="none"
                  stroke={theme === "cad" ? "#0f172a" : "#38bdf8"}
                  strokeWidth="10"
                  rx="6"
                />

                {/* Room Fills & Boundaries */}
                {roomBoxes.map((room) => {
                  const isSelected = room.index === selectedRoomIndex;
                  const isHovered = room.index === hoveredRoomIndex;
                  const box = room.box;

                  let fillColor = theme === "cad" ? room.meta.bgLight : "#0f172a";
                  let strokeColor = theme === "cad" ? room.meta.borderLight : "#1e293b";

                  if (isSelected) {
                    fillColor = theme === "cad" ? `${room.meta.colorHex}22` : `${room.meta.colorHex}44`;
                    strokeColor = room.meta.colorHex;
                  } else if (isHovered) {
                    fillColor = theme === "cad" ? `${room.meta.colorHex}11` : `${room.meta.colorHex}22`;
                  }

                  return (
                    <g 
                      key={room.index}
                      onClick={() => setSelectedRoomIndex(room.index)}
                      onMouseEnter={() => setHoveredRoomIndex(room.index)}
                      onMouseLeave={() => setHoveredRoomIndex(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      {/* Room Area Fill Rect */}
                      <rect
                        x={box.x}
                        y={box.y}
                        width={box.w}
                        height={box.h}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? "3" : "1.5"}
                        rx="4"
                      />

                      {/* Room Pattern Overlay (Tile/Deck) */}
                      {room.meta.type === "balcony" && (
                        <rect
                          x={box.x}
                          y={box.y}
                          width={box.w}
                          height={box.h}
                          fill="url(#woodDeckPattern)"
                        />
                      )}
                      {room.meta.type === "bathroom" && (
                        <rect
                          x={box.x}
                          y={box.y}
                          width={box.w}
                          height={box.h}
                          fill="url(#tilePattern)"
                        />
                      )}

                      {/* FURNITURE OVERLAY GRAPHICS */}
                      {showFurniture && (
                        <g opacity={theme === "cad" ? "0.75" : "0.9"}>
                          {/* Bedroom Furniture (Bed + Pillows + Blanket) */}
                          {room.meta.type === "bedroom" && (
                            <g transform={`translate(${box.x + 20}, ${box.y + 20})`}>
                              {/* Bed Frame */}
                              <rect x="0" y="0" width="70" height="90" fill={theme === "cad" ? "#f1f5f9" : "#1e293b"} stroke={room.meta.colorHex} strokeWidth="1.5" rx="4" />
                              {/* Pillows */}
                              <rect x="6" y="6" width="26" height="16" fill={room.meta.colorHex} rx="2" opacity="0.8" />
                              <rect x="38" y="6" width="26" height="16" fill={room.meta.colorHex} rx="2" opacity="0.8" />
                              {/* Folded Blanket */}
                              <rect x="4" y="32" width="62" height="52" fill={room.meta.colorHex} opacity="0.2" rx="2" />
                              {/* Nightstands */}
                              <circle cx="-10" cy="14" r="6" fill="#94a3b8" />
                              <circle cx="80" cy="14" r="6" fill="#94a3b8" />
                            </g>
                          )}

                          {/* Living Room Furniture (Sofa + Coffee Table + TV Console) */}
                          {room.meta.type === "living" && (
                            <g transform={`translate(${box.x + 25}, ${box.y + 25})`}>
                              {/* L-Sofa */}
                              <path d="M 0 0 L 100 0 L 100 30 L 30 30 L 30 80 L 0 80 Z" fill={theme === "cad" ? "#e2e8f0" : "#334155"} stroke={room.meta.colorHex} strokeWidth="1.5" rx="3" />
                              {/* Coffee Table */}
                              <rect x="42" y="42" width="40" height="26" fill={room.meta.colorHex} opacity="0.3" rx="4" stroke={room.meta.colorHex} strokeWidth="1" />
                              {/* TV Unit Console */}
                              <rect x="120" y="10" width="12" height="70" fill={theme === "cad" ? "#475569" : "#64748b"} rx="2" />
                            </g>
                          )}

                          {/* Kitchen Furniture (Counter + Burners + Sink) */}
                          {room.meta.type === "kitchen" && (
                            <g transform={`translate(${box.x + 15}, ${box.y + 15})`}>
                              {/* Countertop */}
                              <rect x="0" y="0" width="120" height="25" fill={theme === "cad" ? "#cbd5e1" : "#334155"} stroke={room.meta.colorHex} strokeWidth="1.5" rx="2" />
                              {/* Gas Stove Burner Rings */}
                              <circle cx="25" cy="12" r="6" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                              <circle cx="45" cy="12" r="6" fill="none" stroke="#ef4444" strokeWidth="1.5" />
                              {/* Kitchen Sink */}
                              <rect x="80" y="5" width="28" height="15" fill="none" stroke="#0ea5e9" strokeWidth="1.5" rx="2" />
                            </g>
                          )}

                          {/* Bathroom Furniture (Bathtub + Toilet + Sink) */}
                          {room.meta.type === "bathroom" && (
                            <g transform={`translate(${box.x + 15}, ${box.y + 15})`}>
                              {/* Tub / Shower Enclosure */}
                              <rect x="0" y="0" width="50" height="35" fill="none" stroke="#06b6d4" strokeWidth="1.5" rx="4" />
                              <ellipse cx="25" cy="17" rx="20" ry="12" fill="#e0f2fe" opacity="0.6" />
                              {/* Toilet */}
                              <circle cx="80" cy="15" r="10" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
                            </g>
                          )}

                          {/* Balcony Deck Furniture (Chairs + Plants) */}
                          {room.meta.type === "balcony" && (
                            <g transform={`translate(${box.x + 20}, ${box.y + 20})`}>
                              {/* Patio Chair 1 */}
                              <circle cx="20" cy="20" r="12" fill="#10b981" opacity="0.4" />
                              {/* Patio Chair 2 */}
                              <circle cx="60" cy="20" r="12" fill="#10b981" opacity="0.4" />
                              {/* Potted Plants */}
                              <circle cx="120" cy="15" r="8" fill="#22c55e" />
                              <circle cx="140" cy="15" r="6" fill="#15803d" />
                            </g>
                          )}
                        </g>
                      )}

                      {/* Room Label & Size Pill */}
                      <g transform={`translate(${box.x + box.w / 2}, ${box.y + (showFurniture ? box.h - 22 : box.h / 2)})`}>
                        {/* Background pill */}
                        <rect
                          x="-65"
                          y="-13"
                          width="130"
                          height="26"
                          fill={isSelected ? room.meta.colorHex : theme === "cad" ? "#ffffff" : "#0f172a"}
                          stroke={isSelected ? "#ffffff" : theme === "cad" ? "#cbd5e1" : "#334155"}
                          strokeWidth="1.5"
                          rx="13"
                        />
                        {/* Room Name */}
                        <text
                          x="0"
                          y="-1"
                          textAnchor="middle"
                          fill={isSelected ? "#ffffff" : theme === "cad" ? "#0f172a" : "#f8fafc"}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {room.name.length > 18 ? room.name.substring(0, 16) + "…" : room.name}
                        </text>
                        {/* Size subtext */}
                        <text
                          x="0"
                          y="9"
                          textAnchor="middle"
                          fill={isSelected ? "#fef08a" : theme === "cad" ? "#64748b" : "#38bdf8"}
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {room.size}
                        </text>
                      </g>

                      {/* Room Selection Badge Dot */}
                      <circle
                        cx={box.x + 16}
                        cy={box.y + 16}
                        r="10"
                        fill={isSelected ? room.meta.colorHex : theme === "cad" ? "#e2e8f0" : "#1e293b"}
                        stroke={isSelected ? "#ffffff" : "#94a3b8"}
                        strokeWidth="1.5"
                      />
                      <text
                        x={box.x + 16}
                        y={box.y + 19.5}
                        textAnchor="middle"
                        fill={isSelected ? "#ffffff" : theme === "cad" ? "#334155" : "#cbd5e1"}
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {room.index + 1}
                      </text>
                    </g>
                  );
                })}

                {/* Exterior Window Panes (Glass Lines in Blue) */}
                <g stroke="#0284c7" strokeWidth="4" strokeLinecap="round">
                  <line x1="120" y1="36" x2="220" y2="36" />
                  <line x1="580" y1="36" x2="680" y2="36" />
                  <line x1="120" y1="484" x2="680" y2="484" strokeDasharray="8,4" />
                </g>

                {/* Door Opening Arcs */}
                <g stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" fill="none">
                  <path d="M 300 160 A 30 30 0 0 1 300 220" />
                  <path d="M 560 160 A 30 30 0 0 0 560 220" />
                </g>
              </svg>
            </div>

            {/* Bottom Legend Footer Bar */}
            <div className={`absolute bottom-3 left-3 right-3 p-2 rounded-xl flex flex-wrap items-center justify-between text-[11px] font-mono font-bold z-30 backdrop-blur-md border ${
              theme === "cad"
                ? "bg-white/90 text-stone-700 border-stone-200 shadow-xs"
                : "bg-slate-900/90 text-slate-300 border-slate-800"
            }`}>
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                  <span>Main Wall</span>
                </span>
                <span className="flex items-center space-x-1 text-sky-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <span>Window</span>
                </span>
                <span className="flex items-center space-x-1 text-orange-600">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span>Active Room</span>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span>0</span>
                <span className="h-2 w-10 border-b-2 border-stone-500 relative">
                  <span className="absolute -top-1 left-0 h-2 w-0.5 bg-stone-700" />
                  <span className="absolute -top-1 right-0 h-2 w-0.5 bg-stone-700" />
                </span>
                <span>10 FT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Room Details Desk (Right 5 Cols) */}
        <div className="lg:col-span-5 border border-stone-200 rounded-2xl bg-stone-50 p-5 flex flex-col justify-between shadow-xs" id="room-details-inspection-card">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRoomIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full justify-between"
            >
              <div>
                {/* Room Photo Showcase */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-stone-200 shadow-xs bg-stone-200 group">
                  <img
                    src={activeRoom.image}
                    alt={activeRoom.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-lg uppercase font-mono flex items-center space-x-1.5 shadow-md">
                    <Eye className="h-3.5 w-3.5 text-amber-400" />
                    <span>Real Finished Photo</span>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-bold px-2.5 py-1 rounded-md font-mono shadow-md border border-stone-200">
                    {activeRoom.size}
                  </div>
                </div>

                {/* Title & Category Badge */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="p-1.5 rounded-lg text-white shadow-xs"
                      style={{ backgroundColor: activeRoom.meta.colorHex }}
                    >
                      <ActiveIcon className="h-4 w-4" />
                    </div>
                    <h4 className="text-lg font-extrabold text-stone-900 font-sans tracking-tight">
                      {activeRoom.name}
                    </h4>
                  </div>
                  <span className="bg-stone-200 text-stone-800 text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                    Room #{selectedRoomIndex + 1}
                  </span>
                </div>

                <p className="text-stone-600 text-xs leading-relaxed mb-4 font-sans font-medium">
                  {activeRoom.description}
                </p>

                {/* Vastu & Architectural Highlights */}
                <div className="space-y-2.5 mb-4">
                  <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block font-mono">
                    Architectural & Vastu Specs:
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white border border-stone-200 p-2.5 rounded-xl flex flex-col shadow-2xs">
                      <span className="text-[10px] text-stone-400 font-extrabold uppercase">Flooring</span>
                      <span className="text-stone-900 font-bold">Italian Marble / Teak</span>
                    </div>

                    <div className="bg-white border border-stone-200 p-2.5 rounded-xl flex flex-col shadow-2xs">
                      <span className="text-[10px] text-stone-400 font-extrabold uppercase">Ceiling Height</span>
                      <span className="text-stone-900 font-bold">10' 6" Clear Ceiling</span>
                    </div>

                    <div className="bg-white border border-stone-200 p-2.5 rounded-xl flex flex-col shadow-2xs">
                      <span className="text-[10px] text-stone-400 font-extrabold uppercase">Ventilation</span>
                      <span className="text-stone-900 font-bold">Dual Cross Breeze</span>
                    </div>

                    <div className="bg-white border border-stone-200 p-2.5 rounded-xl flex flex-col shadow-2xs">
                      <span className="text-[10px] text-stone-400 font-extrabold uppercase">Electrical Points</span>
                      <span className="text-stone-900 font-bold">6 Modular Sockets</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vastu Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-[11px] font-medium text-emerald-900 flex items-start space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block mb-0.5">Vastu Certified Zone:</span>
                  <span>{activeRoom.meta.vastu}. Certified against West Bengal RERA filed architectural drawings.</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fullscreen Expanded Modal View */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md p-4 sm:p-8 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-white mb-4">
              <div>
                <h2 className="text-xl font-extrabold">{propertyName} — Fullscreen Blueprint</h2>
                <p className="text-xs text-stone-400 font-mono">Precision CAD Architectural Walkthrough</p>
              </div>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-stone-800 hover:bg-stone-700 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Expanded Canvas Display */}
            <div className="relative flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-center overflow-hidden">
              <div className="w-full max-w-4xl aspect-4/3 relative">
                <div className="absolute inset-0 bg-[#0b132b] rounded-2xl border border-cyan-900 p-6 flex flex-col justify-between">
                  <div className="text-cyan-400 font-mono text-xs mb-2 font-bold">SCALE 1:25 ENLARGED ARCHITECTURAL VIEW</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full pt-2">
                    {roomBoxes.map((room) => (
                      <div 
                        key={room.index}
                        onClick={() => setSelectedRoomIndex(room.index)}
                        className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between ${
                          room.index === selectedRoomIndex 
                            ? "bg-cyan-500/30 border-cyan-400 text-white shadow-lg" 
                            : "bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{room.name}</span>
                          <span className="bg-slate-900 px-2 py-0.5 rounded text-xs font-mono font-bold">{room.size}</span>
                        </div>
                        <img src={room.image} alt={room.name} className="h-32 object-cover rounded-lg my-2" />
                        <p className="text-xs opacity-80 line-clamp-2">{room.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
