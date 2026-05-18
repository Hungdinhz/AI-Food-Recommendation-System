"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import FoodCard from "./FoodCard";
import { Food, MOCK_FOODS } from "@/lib/mockData";

type MessageNode = 
  | { type: "text"; content: string }
  | { type: "food_recommendation"; data: Food };

interface Message {
  role: "user" | "assistant";
  nodes: MessageNode[];
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      nodes: [{ type: "text", content: "Hi there! I'm your AI Food Planner. What are you craving today or what is your nutrition goal?" }]
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", nodes: [{ type: "text", content: userMsg }] }]);
    setInput("");
    setIsLoading(true);

    // Simulate AI parsing and responding
    setTimeout(() => {
      // Mock logic: If user mentions 'salmon' or 'salad', show Salmon Salad. Otherwise show a default.
      const lowerMsg = userMsg.toLowerCase();
      let recommendedFood = MOCK_FOODS[1]; // default Quinoa Bowl
      if (lowerMsg.includes("salmon") || lowerMsg.includes("salad") || lowerMsg.includes("fish")) {
        recommendedFood = MOCK_FOODS[0];
      } else if (lowerMsg.includes("vegan") || lowerMsg.includes("tofu")) {
        recommendedFood = MOCK_FOODS[2];
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          nodes: [
            { type: "text", content: "Based on your request, here is a great recommendation for you:" },
            { type: "food_recommendation", data: recommendedFood },
            { type: "text", content: "Would you like me to add this to your meal plan?" }
          ]
        }
      ]);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">NutriAI Assistant</h2>
          <p className="text-xs text-green-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            className={`flex gap-4 max-w-4xl mx-auto ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "user" ? "bg-primary-600 text-white" : "bg-white text-primary-600 border border-slate-100"}`}>
              {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Content */}
            <div className={`flex flex-col gap-3 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
              {msg.nodes.map((node, nodeIdx) => {
                if (node.type === "text") {
                  return (
                    <div 
                      key={nodeIdx}
                      className={`px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        msg.role === "user" 
                          ? "bg-primary-600 text-white rounded-tr-sm" 
                          : "bg-white text-slate-700 border border-slate-100 rounded-tl-sm"
                      }`}
                    >
                      {node.content}
                    </div>
                  );
                } else if (node.type === "food_recommendation") {
                  return (
                    <div key={nodeIdx} className="w-full max-w-[350px]">
                      <FoodCard food={node.data} />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 max-w-4xl mx-auto">
            <div className="w-10 h-10 rounded-full bg-white text-primary-600 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div className="px-5 py-4 bg-white border border-slate-100 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g., I want a high protein vegan meal under $10..."
            className="w-full bg-slate-100/50 border border-slate-200 px-6 py-4 rounded-full text-[15px] outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all pr-16"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 w-10 bg-primary-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-primary-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
