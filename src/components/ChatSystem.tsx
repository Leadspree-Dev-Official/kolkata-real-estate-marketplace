/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Mail, Phone, ArrowRight, Loader2, HelpCircle, PhoneCall, CalendarDays, Receipt } from "lucide-react";
import { ChatMessage, Property } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface ChatSystemProps {
  property: Property;
  onInquiryCreated: () => void;
}

export default function ChatSystem({ property, onInquiryCreated }: ChatSystemProps) {
  // Check if contact info exists in localStorage
  const [userName, setUserName] = useState(() => localStorage.getItem("kn_user_name") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("kn_user_email") || "");
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem("kn_user_phone") || "");
  const [isContactSaved, setIsContactSaved] = useState(() => !!localStorage.getItem("kn_user_name"));

  // Chat conversation state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`kn_chat_${property.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) { return []; }
    }
    // Return initial greeting
    return [
      {
        id: "greet",
        sender: "agent",
        text: `Namaskar! I am Sourav Banerjee, senior consultant for Kolkata Nest Realty.\n\nI am personally handling bookings and structural inquiries for the gorgeous **${property.title}** here in ${property.location}.\n\nHow can I assist you with prices, bank approvals, or scheduling a tour today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [errorText, setErrorText] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  // Persist chat history
  useEffect(() => {
    localStorage.setItem(`kn_chat_${property.id}`, JSON.stringify(chatHistory));
  }, [chatHistory, property.id]);

  // Save contact information
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !userPhone.trim()) {
      setErrorText("Please fill out all the fields to connect with the agent.");
      return;
    }
    localStorage.setItem("kn_user_name", userName);
    localStorage.setItem("kn_user_email", userEmail);
    localStorage.setItem("kn_user_phone", userPhone);
    setIsContactSaved(true);
    setErrorText("");
    onInquiryCreated(); // Notify parent of active lead
  };

  // Send message
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);
    setErrorText("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          propertyId: property.id,
          history: chatHistory.slice(-10) // Limit history payload size
        })
      });

      if (!response.ok) {
        throw new Error("Failed to reach server agent.");
      }

      const data = await response.json();
      
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory((prev) => [...prev, agentMsg]);
    } catch (err: any) {
      console.error(err);
      
      // Gracious fallback offline offline message if network is fully stuck
      const fallbackMsg: ChatMessage = {
        id: `agent-error-${Date.now()}`,
        sender: "agent",
        text: `Thank you for your question. I am currently offline checking the ledger keys. Let me arrange an immediate callback to your number **${userPhone}** or write an email to **${userEmail}** within 10 minutes to resolve your query regarding **${property.title}**!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatHistory((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Fast-prompt chips
  const QUICK_PROMPTS = [
    { text: "Schedule a physical site visit 🚗", prompt: "I would like to schedule a physical site visit for this weekend. Can you arrange it?" },
    { text: "What are the bank loan options? 🏦", prompt: "Which banks are offering home loans for this project, and is there an pre-approved subsidy?" },
    { text: "Get price breakdown details 📊", prompt: "Could you send me the detailed cost break-up including car parking, registration, and GST?" },
    { text: "Are discounts available? 🏷️", prompt: "Is there any festive or early-booking discount available on this flat right now?" }
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col h-[520px]" id="chat-system-panel">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 mb-3" id="chat-header-section">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {/* Simulated Agent Avatar */}
            <div className="h-10 w-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-extrabold text-sm border-2 border-white shadow-xs">
              SB
            </div>
            {/* Pulse Indicator */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-950 font-sans flex items-center">
              Sourav Banerjee
              <span className="ml-1.5 bg-orange-50 text-orange-700 text-[9px] font-bold px-1.5 py-0.5 rounded-md">Senior Advisor</span>
            </h4>
            <p className="text-[11px] font-medium text-stone-400">Kolkata Nest Realty • Online</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-stone-400 block uppercase font-bold tracking-widest">Inquiring On</span>
          <span className="text-xs font-bold text-stone-800 line-clamp-1 max-w-[150px]">{property.title}</span>
        </div>
      </div>

      {/* LEAD ACQUISITION SIGNUP FORM (Shown first if info missing) */}
      {!isContactSaved ? (
        <div className="flex-1 flex flex-col justify-center px-2" id="chat-lead-signup-form">
          <div className="text-center mb-5">
            <span className="bg-stone-100 text-stone-800 p-2 rounded-xl inline-flex mb-2">
              <HelpCircle className="h-5 w-5 text-orange-600" />
            </span>
            <h5 className="text-sm font-bold text-stone-900 font-sans">
              Connect with Senior Advisory
            </h5>
            <p className="text-xs text-stone-500 max-w-xs mx-auto mt-1">
              Please secure your profile below to open direct messaging with Sourav Banerjee.
            </p>
          </div>

          <form onSubmit={handleSaveContact} className="space-y-3.5">
            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-xl text-xs outline-none transition-all font-sans font-medium"
              />
            </div>
            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-xl text-xs outline-none transition-all font-sans font-medium"
              />
            </div>
            {/* Phone */}
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
              <input
                type="tel"
                required
                placeholder="Phone Number (e.g. +91 98300...)"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-xl text-xs outline-none transition-all font-sans font-medium"
              />
            </div>

            {errorText && (
              <p className="text-[11px] font-bold text-red-600 text-center">{errorText}</p>
            )}

            <button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 focus:outline-none"
            >
              <span>Unlock Direct Messaging</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      ) : (
        /* CHAT ROOM WINDOW */
        <div className="flex-1 flex flex-col justify-between overflow-hidden" id="chat-room-stage">
          {/* Messages window */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin pb-2" id="chat-messages-scroll-area">
            {chatHistory.map((msg) => {
              const isAgent = msg.sender === "agent";
              return (
                <div
                  key={msg.id}
                  className={`flex ${isAgent ? "justify-start" : "justify-end"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl p-3 shadow-2xs relative group ${
                    isAgent 
                      ? "bg-stone-100 text-stone-900 rounded-tl-none border border-stone-200/50" 
                      : "bg-orange-600 text-white rounded-tr-none"
                  }`}>
                    {/* Message Body */}
                    <p className="text-xs leading-relaxed font-sans font-medium whitespace-pre-wrap">{msg.text}</p>
                    {/* Timestamp */}
                    <span className={`text-[9px] font-bold mt-1.5 block text-right font-mono ${
                      isAgent ? "text-stone-400" : "text-white/60"
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Is Typing Animation */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-stone-100 rounded-2xl rounded-tl-none p-3 border border-stone-200/50 flex items-center space-x-2">
                  <Loader2 className="h-3.5 w-3.5 text-orange-600 animate-spin" />
                  <span className="text-[11px] text-stone-500 font-bold font-sans">Sourav is typing...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Questions prompts box (Hide if typing or history is long) */}
          {chatHistory.length < 5 && (
            <div className="my-2 border-t border-stone-100 pt-2" id="chat-quick-suggestions">
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block mb-1">Click to Ask Sourav:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scroll-smooth whitespace-nowrap">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    disabled={isTyping}
                    onClick={() => handleSendMessage(qp.prompt)}
                    className="bg-stone-50 border border-stone-200 hover:border-orange-200 hover:bg-orange-50 text-stone-700 hover:text-orange-800 text-[10px] font-bold px-3 py-1.5 rounded-full transition-all focus:outline-none cursor-pointer inline-block shrink-0"
                  >
                    {qp.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Box and trigger */}
          <div className="border-t border-stone-100 pt-3 flex items-center space-x-2" id="chat-input-row">
            <input
              type="text"
              disabled={isTyping}
              placeholder="Ask Sourav anything about the flat..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage(inputMessage)}
              className="flex-1 bg-stone-50 border border-stone-200 focus:border-stone-400 rounded-xl px-3.5 py-2.5 text-xs outline-none transition-colors font-sans font-medium"
              id="chat-user-text-input"
            />
            <button
              onClick={() => handleSendMessage(inputMessage)}
              disabled={!inputMessage.trim() || isTyping}
              className={`p-2.5 rounded-xl transition-all shadow-xs focus:outline-none shrink-0 ${
                inputMessage.trim() && !isTyping
                  ? "bg-stone-900 text-white hover:bg-stone-800"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
              id="chat-send-btn"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
