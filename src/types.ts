/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FloorPlanRoom {
  name: string;
  size: string;
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  image: string;
  description: string;
}

export interface PropertyImage {
  url: string;
  caption: string;
}

export interface Property {
  id: string;
  title: string;
  price: number; // in Lakhs (e.g. 75 = 75 Lakhs, 150 = 1.5 Crores)
  location: "New Town" | "Salt Lake" | "Ballygunge" | "Garia" | "Behala" | "Rajarhat" | "Jadavpur";
  address: string;
  bhk: number;
  area: number; // in sq.ft
  status: "Ready to Move" | "Under Construction";
  developer: string;
  possessionDate: string;
  description: string;
  amenities: string[];
  nearbyLandmarks: string[];
  images: PropertyImage[];
  floorPlanRooms: FloorPlanRoom[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  text: string;
  timestamp: string;
}

export type InquiryStatus = "New" | "Confirmed" | "Out for Delivery" | "Completed" | "Active" | "Scheduled" | "Closed";

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyName: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  messages: ChatMessage[];
  status: InquiryStatus;
  createdAt: string;
}

export interface VisitorProfile {
  businessName: string;
  contactName: string;
  phone: string;
  address: string;
  themeColor: string; // Hex code e.g. #ea580c
  submittedAt: number; // Unix timestamp in ms
}

export interface SiteSettings {
  businessName: string;
  contactName: string;
  phone: string;
  address: string;
  primaryColor: string;
  reraId: string;
}
