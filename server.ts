/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Standard list of properties to keep the backend self-contained
const KOLKATA_PROPERTIES = [
  {
    id: "prop-1",
    title: "The Ballygunge Heritage Residency",
    price: 285,
    location: "Ballygunge",
    address: "14A, Gariahat Road, Ballygunge, Kolkata - 700019 (Near Ballygunge Phari)",
    bhk: 4,
    area: 2650,
    status: "Ready to Move",
    developer: "Imperial Bengal Developers",
    possessionDate: "Immediate",
    amenities: ["24/7 Concierge Service", "Private Banquet Hall", "Rooftop Infinity Pool", "State-of-the-art Gym", "Triple-layer Security", "Reserved Double Car Parking", "Yoga and Meditation Deck"],
    nearbyLandmarks: ["Ballygunge Circular Road (3 mins)", "Quest Mall (5 mins)", "Birla Temple (4 mins)", "South City Mall (12 mins)", "Ballygunge Junction Railway Station (5 mins)"]
  },
  {
    id: "prop-2",
    title: "Siddha Skyview Heights",
    price: 118,
    location: "New Town",
    address: "Block CC, Action Area II, New Town, Kolkata - 700156 (Opposite Eco Park Gate 4)",
    bhk: 3,
    area: 1680,
    status: "Ready to Move",
    developer: "Siddha Landmark Group",
    possessionDate: "Immediate",
    amenities: ["Kolkata's Longest Rooftop Skywalk", "Clubhouse with Mini-Theater", "Semi-Olympic Swimming Pool", "Indoor Sports Arena (Badminton & TT)", "High-speed Passenger Elevators", "Power Backup & Water Treatment Plant"],
    nearbyLandmarks: ["Eco Park Gate 4 (Just opposite, 1 min walk)", "Biswa Bangla Gate (4 mins drive)", "TCS Gitanjali Park (6 mins drive)", "Tata Medical Center (5 mins drive)", "City Centre II Mall (8 mins drive)"]
  },
  {
    id: "prop-3",
    title: "Mani Tech Vista Smart Homes",
    price: 155,
    location: "Salt Lake",
    address: "Sector V, Salt Lake, Bidhannagar, Kolkata - 700091 (Behind College More)",
    bhk: 3,
    area: 1920,
    status: "Under Construction",
    developer: "Mani Group",
    possessionDate: "December 2027",
    amenities: ["Smart IoT Home Gateway", "Co-Working Lounge with High-speed Wi-Fi", "EV Charging Bays on Each Parking Level", "E-Library & Quiet Study Pods", "Temperature Controlled Indoor Pool", "24/7 Multi-tier Digital Security Guard"],
    nearbyLandmarks: ["Sector V Metro Station (3 mins walk)", "SDF Crossing (5 mins walk)", "RDB Boulevard Cinema & Food Court (4 mins walk)", "Salt Lake Bypass Highway (2 mins drive)", "Technopolis Crossing (3 mins drive)"]
  },
  {
    id: "prop-4",
    title: "Eden Greenwoods City",
    price: 52,
    location: "Garia",
    address: "72, Garia Station Road, Garia, Kolkata - 700084 (Near Kavi Nazrul Metro)",
    bhk: 2,
    area: 980,
    status: "Ready to Move",
    developer: "Eden Group Kolkata",
    possessionDate: "Immediate",
    amenities: ["Landscaped Central Garden", "Community Hall for Festivals", "Dedicated Children's Play Zone", "Walking & Jogging Track", "24/7 Water & Electricity Supply", "Security Cabin and CCTV Guard"],
    nearbyLandmarks: ["Kavi Nazrul Metro Station (4 mins auto ride)", "Garia Crossing Market (5 mins drive)", "Woodlands Hospital Garia Clinic (5 mins)", "Peerless Hospital (8 mins drive)", "E.M. Bypass Highway Connector (3 mins drive)"]
  },
  {
    id: "prop-5",
    title: "Behala Sanskriti Garden Towers",
    price: 72,
    location: "Behala",
    address: "18/3, Diamond Harbour Road, Behala Chowrasta, Kolkata - 700034 (Behind Behala Tram Depot)",
    bhk: 3,
    area: 1350,
    status: "Under Construction",
    developer: "Sanskriti Real Estate Co.",
    possessionDate: "March 2027",
    amenities: ["Rooftop Durga Puja & Event Pavilion", "Adda Zone (Community discussion terrace)", "Traditional Swimming Pool", "Indoor Games Room with Carrom & Chess", "Fully Guarded Gate House", "Rainwater Harvesting System"],
    nearbyLandmarks: ["Behala Chowrasta Metro Station (Upcoming - 2 mins walk)", "Behala Tram Depot (3 mins walk)", "State Bank of India Behala Branch (1 min)", "Tarapan Temple (4 mins walk)", "James Long Sarani Bypass (3 mins drive)"]
  },
  {
    id: "prop-6",
    title: "Rajarhat Smart Meadows",
    price: 88,
    location: "Rajarhat",
    address: "Rajarhat Main Rd, Chinar Park Crossing, Rajarhat, Kolkata - 700136",
    bhk: 3,
    area: 1520,
    status: "Ready to Move",
    developer: "Meadows Infra Developments",
    possessionDate: "Immediate",
    amenities: ["Clubhouse with Table Tennis & Billiards", "Multipurpose Sports Hall", "Kids' Safe Splash Pool", "24/7 CCTV & Security Patrols", "RO Water Purification Plant", "Car wash bay on ground floor"],
    nearbyLandmarks: ["Chinar Park Crossing (2 mins walk)", "City Centre II Mall (4 mins drive)", "Haldirams Rajarhat Crossing (3 mins drive)", "Kolkata Airport (NSCBIA) (12 mins drive)", "New Town Major Arterial Road (4 mins drive)"]
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for body parsing
  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // API Properties fetch (optional fallback utility for client)
  app.get("/api/properties", (req, res) => {
    res.json(KOLKATA_PROPERTIES);
  });

  // Direct AI Messaging Agent API Route
  app.post("/api/chat", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { message, history, propertyId } = req.body;

      if (!message) {
        res.status(400).json({ error: "Message is required." });
        return;
      }

      // Find the specific property to build a contextual prompt
      const property = KOLKATA_PROPERTIES.find((p) => p.id === propertyId) || KOLKATA_PROPERTIES[0];

      // Formulate the customized prompt injection
      const systemInstruction = `
You are Sourav Banerjee, a highly professional, polite, and energetic senior Real Estate Consultant representing "Kolkata Nest Realty".
Your goal is to answer buyer inquiries regarding the specific property: "${property.title}" located in the ${property.location} area of Kolkata.

Property Details:
- Name: ${property.title}
- Location: ${property.location}, Kolkata
- Price: ₹${property.price} Lakhs ${property.price >= 100 ? `(₹${(property.price / 100).toFixed(2)} Crores)` : ""}
- Configuration: ${property.bhk} BHK Apartment
- Area: ${property.area} sq.ft. super built-up area
- Construction Status: ${property.status} (Estimated possession/keys: ${property.possessionDate})
- Developer: ${property.developer}
- Registered Address: ${property.address}
- Key Amenities: ${property.amenities.join(", ")}
- Strategic Landmarks & Transit: ${property.nearbyLandmarks.join(", ")}

Style & Persona Guidelines:
1. Greet the user with classic Bengali warmth and respect. Use greetings like "Namaskar!" or "Hope you are having a wonderful day!".
2. Speak with absolute pride of Kolkata's rich cultural heritage, neighborhoods, and developments.
3. Keep your response highly professional, practical, and factual based strictly on the Property Details above.
4. If the user asks about loans or financial support, mention that Kolkata Nest Realty is allied with major public and private sector banks (like SBI, HDFC, ICICI) to provide easy spot-approvals and attractive interest rates.
5. If the user asks for details not mentioned, offer to connect them with the project's site engineer or schedule a direct site tour.
6. Provide clear, scannable formatting (bullet points, brief paragraphs) to make details easy to digest.
7. Always politely invite the user to schedule a site inspection, a personal Zoom consultation, or leave their phone number for a direct call!
8. Do not break character. Do not mention that you are an AI model. You are Sourav Banerjee, professional human consultant.
`;

      // Check if API key is present
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Safe, beautiful local fallback when API key is missing
        setTimeout(() => {
          let fallbackReply = `Namaskar! Thank you for your inquiry about **${property.title}**.\n\n`;
          
          if (message.toLowerCase().includes("price") || message.toLowerCase().includes("cost") || message.toLowerCase().includes("lakh") || message.toLowerCase().includes("crore")) {
            fallbackReply += `Regarding the commercial details, **${property.title}** is valued at a premium price of **₹${property.price} Lakhs** (for the ${property.bhk} BHK layout measuring ${property.area} sq.ft.). This represents an excellent market value for a premium project in ${property.location}.\n\n`;
          } else if (message.toLowerCase().includes("location") || message.toLowerCase().includes("where") || message.toLowerCase().includes("landmark") || message.toLowerCase().includes("metro")) {
            fallbackReply += `This property is strategically located at **${property.address}**. It offers superior connectivity to key hotspots like:\n${property.nearbyLandmarks.map(landmark => `- ${landmark}`).join('\n')}\n\n`;
          } else if (message.toLowerCase().includes("amenit") || message.toLowerCase().includes("pool") || message.toLowerCase().includes("gym") || message.toLowerCase().includes("club")) {
            fallbackReply += `We offer a magnificent suite of world-class amenities to elevate your lifestyle:\n${property.amenities.map(amenity => `- ${amenity}`).join('\n')}\n\n`;
          } else {
            fallbackReply += `As your consultant, I would be absolutely delighted to schedule a personalized site tour of **${property.title}** in ${property.location} for you. It's a gorgeous ${property.bhk} BHK property built by **${property.developer}** that features top-tier construction and modular finishes.\n\n`;
          }
          
          fallbackReply += `Would you be comfortable sharing your contact details so that I can schedule a site visit or arrange a call with our relationship manager? Looking forward to assisting you in securing your dream home in Kolkata!`;
          
          res.json({ text: fallbackReply, isFallback: true });
        }, 800);
        return;
      }

      // Initialize GoogleGenAI SDK lazily as recommended
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Prepare chat history in standard Gemini format
      const formattedContents = [];
      
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          formattedContents.push({
            role: msg.sender === "user" ? "user" : "model",
            parts: [{ text: msg.text }],
          });
        }
      }
      
      // Append current user message
      formattedContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Call Gemini 3.5 Flash for the conversational response
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I apologize, I could not process that message. How can I help you find your flat in Kolkata?";
      res.json({ text: replyText });

    } catch (error: any) {
      console.error("Gemini API Error in /api/chat:", error);
      res.status(500).json({ 
        error: "Server Error during chat processing.", 
        details: error.message || error 
      });
    }
  });

  // Handle Vite Dev vs Production Static Assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Kolkata Nest Server] Running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
