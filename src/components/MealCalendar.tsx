import React from "react";
import { MOCK_MEAL_PLAN, MOCK_FOODS } from "@/lib/mockData";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import Image from "next/image";

export default function MealCalendar() {
  const days = Object.keys(MOCK_MEAL_PLAN);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary-100 rounded-2xl text-primary-600">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Your Weekly Plan</h2>
          <p className="text-slate-500">Stay on track with your nutrition goals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => {
          // @ts-ignore
          const mealsOfDay = MOCK_MEAL_PLAN[day] || [];
          
          return (
            <div key={day} className="flex flex-col gap-3">
              <div className="text-center font-bold text-slate-700 capitalize py-2 bg-slate-50 rounded-xl border border-slate-100">
                {day}
              </div>
              
              {mealsOfDay.length > 0 ? (
                <div className="space-y-3">
                  {mealsOfDay.map((meal: any, idx: number) => {
                    const food = MOCK_FOODS.find((f) => f.id === meal.foodId);
                    if (!food) return null;
                    return (
                      <div key={idx} className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-primary-500"></div>
                        <div className="text-xs font-semibold text-primary-600 mb-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {meal.type}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                            <Image src={food.image} alt={food.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{food.name}</div>
                            <div className="text-xs text-slate-500 mt-1">{food.calories} kcal</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center min-h-[150px] bg-slate-50/50">
                  <span className="text-slate-400 text-sm font-medium">Rest Day</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
