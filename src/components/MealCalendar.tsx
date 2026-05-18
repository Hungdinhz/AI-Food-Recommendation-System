"use client";

import React, { useEffect, useState } from "react";
import { WeeklyPlan, DayOfWeek, MealType, mealPlanService } from "@/services/mealPlanService";
import { Calendar as CalendarIcon, Trash2, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DAYS: DayOfWeek[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MEALS: MealType[] = ["Breakfast", "Lunch", "Dinner", "Snack"];

export default function MealCalendar() {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plan = await mealPlanService.getWeeklyPlan("user-1");
        setWeeklyPlan(plan);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlan();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px] text-primary-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-semibold">Loading your meal plan...</p>
      </div>
    );
  }

  if (!weeklyPlan) return null;

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-3 mb-8 min-w-[800px]">
        <div className="p-3 bg-primary-100 rounded-2xl text-primary-600">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Your Weekly Matrix</h2>
          <p className="text-slate-500">Drag, drop, and refine your nutrition plan</p>
        </div>
      </div>

      <div className="min-w-[1000px]">
        {/* Header Row (Days) */}
        <div className="grid grid-cols-8 gap-4 mb-4">
          <div className="w-24"></div> {/* Empty corner */}
          {DAYS.map((day) => (
            <div key={day} className="text-center font-bold text-slate-700 bg-slate-100 py-3 rounded-2xl border border-slate-200 shadow-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Matrix Rows (Meals) */}
        <div className="space-y-4">
          {MEALS.map((mealType) => (
            <div key={mealType} className="grid grid-cols-8 gap-4 items-stretch">
              {/* Row Label */}
              <div className="flex items-center justify-end pr-4 text-right">
                <span className="font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl shadow-inner border border-slate-100 w-full whitespace-nowrap text-sm">
                  {mealType}
                </span>
              </div>

              {/* Cells */}
              {DAYS.map((day) => {
                const entry = weeklyPlan[day][mealType];
                return (
                  <div key={`${day}-${mealType}`} className="relative h-full flex flex-col group min-h-[120px]">
                    {entry ? (
                      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                        <div className="relative w-full h-16 rounded-lg overflow-hidden mb-2 shrink-0">
                          <Image src={entry.food.image} alt={entry.food.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-800 text-xs leading-tight line-clamp-2" title={entry.food.name}>{entry.food.name}</div>
                          <div className="text-[10px] text-slate-500 mt-1 font-medium">{entry.food.calories} kcal</div>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 border border-slate-200 rounded-2xl">
                          <Link href={`/food/${entry.foodId}`} className="p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors" title="View details">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors" title="Remove">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50/50 hover:bg-primary-50/50 hover:border-primary-200 transition-colors cursor-pointer group/add">
                        <span className="text-slate-400 text-2xl group-hover/add:text-primary-400 group-hover/add:scale-110 transition-transform">+</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
