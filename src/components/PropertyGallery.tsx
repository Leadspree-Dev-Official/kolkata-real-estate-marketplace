/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from "lucide-react";
import { PropertyImage } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface PropertyGalleryProps {
  images: PropertyImage[];
  propertyName: string;
}

export default function PropertyGallery({ images, propertyName }: PropertyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[activeIndex] || images[0];

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs" id="property-gallery-container">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-bold text-stone-500 tracking-wider uppercase flex items-center space-x-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-stone-400" />
          <span>Real-Life Property Gallery ({images.length} Photos)</span>
        </span>
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="text-stone-500 hover:text-stone-800 text-xs font-bold flex items-center space-x-1 focus:outline-none"
        >
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Fullscreen</span>
        </button>
      </div>

      {/* Main Image Stage */}
      <div 
        className="relative aspect-video rounded-xl overflow-hidden bg-stone-900 group cursor-pointer border border-stone-100"
        onClick={() => setIsLightboxOpen(true)}
        id="gallery-main-stage"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={currentImage.url}
            alt={currentImage.caption}
            referrerPolicy="no-referrer"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
            id="gallery-main-img"
          />
        </AnimatePresence>

        {/* Carousel Overlay Navigation controls */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-md backdrop-blur-xs transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 opacity-0 group-hover:opacity-100 duration-200"
          id="gallery-prev-btn"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-stone-800 p-2 rounded-full shadow-md backdrop-blur-xs transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 opacity-0 group-hover:opacity-100 duration-200"
          id="gallery-next-btn"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Static Title Caption Overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white">
          <p className="text-sm font-semibold tracking-wide drop-shadow-xs">{currentImage.caption}</p>
        </div>
      </div>

      {/* Thumbnails strip */}
      <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-thin" id="gallery-thumbnails">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`relative rounded-lg overflow-hidden shrink-0 w-20 aspect-video border-2 transition-all focus:outline-none ${
              idx === activeIndex
                ? "border-orange-600 scale-[1.02] shadow-xs"
                : "border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={img.url}
              alt={img.caption}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* LIGHTBOX FULLSCREEN MODAL */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-950/95 z-50 flex flex-col justify-between p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
            id="gallery-lightbox-modal"
          >
            {/* Lightbox Header */}
            <div className="flex justify-between items-center text-white z-10" onClick={(e) => e.stopPropagation()}>
              <div>
                <h4 className="text-base font-bold font-sans">{propertyName}</h4>
                <p className="text-xs text-stone-400 font-medium">Image {activeIndex + 1} of {images.length} • {currentImage.caption}</p>
              </div>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                id="gallery-close-lightbox-btn"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Lightbox Stage */}
            <div className="flex-1 flex items-center justify-center relative my-4" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={activeIndex}
                src={currentImage.url}
                alt={currentImage.caption}
                referrerPolicy="no-referrer"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 180 }}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              />

              {/* Chevrons */}
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-4 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-4 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Lightbox Footer Thumbnails */}
            <div className="flex gap-2 overflow-x-auto justify-center pb-2 z-10" onClick={(e) => e.stopPropagation()}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative rounded-md overflow-hidden shrink-0 w-16 md:w-20 aspect-video border-2 transition-all focus:outline-none ${
                    idx === activeIndex
                      ? "border-orange-500 scale-[1.04]"
                      : "border-stone-800 opacity-50 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.caption}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
