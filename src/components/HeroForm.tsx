"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Utensils, Target, DollarSign, Sparkles } from "lucide-react";

export default function HeroForm() {
  const [budget, setBudget] = useState<number>(15);
  const [mealType, setMealType] = useState<string>("Lunch");
  const [goal, setGoal] = useState<string>("Balanced");

  const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
  const goals = ["Weight Loss", "Muscle Gain", "Balanced", "Vegetarian"];

  return (
    <section className="relative w-full py-20 px-6 overflow-hidden bg-white/50 backdrop-blur-3xl rounded-[2rem] border border-white/20 shadow-2xl">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-500/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 font-medium text-sm mb-6 border border-primary-100">
            <Sparkles className="w-4 h-4" />
            AI-Powered Meal Planning
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Perfect Meal</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tell our AI what you crave, your nutrition goals, and budget. We'll craft the perfect recipe and meal plan just for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/50 text-left grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Budget Slider */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 font-semibold text-slate-800">
              <DollarSign className="w-5 h-5 text-primary-500" />
              Budget per Meal: <span className="text-primary-600">${budget}</span>
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>$5</span>
              <span>$50</span>
            </div>
          </div>

          {/* Meal Type Selection */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 font-semibold text-slate-800">
              <Utensils className="w-5 h-5 text-secondary-500" />
              Meal Type
            </label>
            <div className="flex flex-wrap gap-2">
              {mealTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setMealType(type)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                    mealType === type
                      ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Nutrition Goal */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 font-semibold text-slate-800">
              <Target className="w-5 h-5 text-accent-500" />
              Nutrition Goal
            </label>
            <div className="flex flex-wrap gap-2">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                    goal === g
                      ? "bg-accent-500 text-white shadow-md shadow-accent-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="md:col-span-3 pt-6 flex justify-center">
            <button className="px-8 py-4 bg-foreground text-white rounded-full font-semibold text-lg hover:bg-slate-800 hover:scale-105 transition-all duration-200 shadow-xl flex items-center gap-2">
              Generate My Meal
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
