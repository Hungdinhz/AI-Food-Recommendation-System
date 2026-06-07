"use client";

import React, { useState } from "react";
import {
  WeeklyPlan,
  DayOfWeek,
  MealType,
  MealPlanSummary,
  mealPlanService,
} from "@/services/mealPlanService";
import {
  Calendar as CalendarIcon,
  Eye,
  Loader2,
  Sparkles,
  DollarSign,
  Flame,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const DAYS: DayOfWeek[] = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MEALS: MealType[] = ["Sáng", "Trưa", "Tối"];

interface MealCalendarProps {
  onPlanGenerated?: () => void;
}

export default function MealCalendar({ onPlanGenerated }: MealCalendarProps) {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [summary, setSummary] = useState<MealPlanSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [budget, setBudget] = useState(200000);
  const [targetCalories, setTargetCalories] = useState(2000);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await mealPlanService.generateWeeklyPlan({
        userId: 1,
        budget,
        targetCalories,
      });
      setWeeklyPlan(result.plan);
      setSummary(result.summary);
      setHasGenerated(true);
      onPlanGenerated?.();
    } catch (err) {
      console.error("Failed to generate meal plan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Generate Form */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Lập Kế Hoạch Ăn Uống</h2>
            <p className="text-white/80 text-sm">
              AI sẽ tạo thực đơn 7 ngày phù hợp với ngân sách và mục tiêu calo
              của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-sm">
              <DollarSign className="w-4 h-4" /> Ngân sách tuần:{" "}
              {budget.toLocaleString("vi-VN")}đ
            </label>
            <input
              type="range"
              min="100000"
              max="1000000"
              step="50000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-white"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-white/60">
              <span>100K</span>
              <span>1M</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 font-semibold text-sm">
              <Flame className="w-4 h-4" /> Calo mục tiêu/ngày:{" "}
              {targetCalories} kcal
            </label>
            <input
              type="range"
              min="1200"
              max="3500"
              step="100"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              className="w-full accent-white"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-white/60">
              <span>1200</span>
              <span>3500</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang tạo thực đơn...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {hasGenerated ? "Tạo Lại Thực Đơn" : "Tạo Thực Đơn 7 Ngày"}
            </>
          )}
        </button>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <p className="text-xs text-slate-500 mb-1">Ngày bắt đầu</p>
            <p className="font-bold text-slate-800">{summary.startDate}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <p className="text-xs text-slate-500 mb-1">Ngày kết thúc</p>
            <p className="font-bold text-slate-800">{summary.endDate}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <p className="text-xs text-slate-500 mb-1">Calo mục tiêu/ngày</p>
            <p className="font-bold text-orange-600">
              {summary.targetCalories} kcal
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
            <p className="text-xs text-slate-500 mb-1">Chi phí ước lượng</p>
            <p className="font-bold text-green-600">
              {summary.totalEstimatedCost.toLocaleString("vi-VN")}đ
            </p>
          </div>
        </div>
      )}

      {/* Weekly Grid */}
      {weeklyPlan && (
        <div className="w-full overflow-x-auto">
          <div className="flex items-center gap-3 mb-8 min-w-[800px]">
            <div className="p-3 bg-primary-100 rounded-2xl text-primary-600">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Thực Đơn Tuần
              </h2>
              <p className="text-slate-500">
                Thực đơn 7 ngày được tối ưu bởi AI
              </p>
            </div>
          </div>

          <div className="min-w-[900px]">
            {/* Header Row (Days) */}
            <div className="grid grid-cols-8 gap-3 mb-4">
              <div className="w-20"></div>
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center font-bold text-slate-700 bg-slate-100 py-3 rounded-2xl border border-slate-200 shadow-sm"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Matrix Rows (Meals) */}
            <div className="space-y-3">
              {MEALS.map((mealType) => (
                <div
                  key={mealType}
                  className="grid grid-cols-8 gap-3 items-stretch"
                >
                  {/* Row Label */}
                  <div className="flex items-center justify-end pr-2">
                    <span className="font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl shadow-inner border border-slate-100 text-sm whitespace-nowrap">
                      {mealType}
                    </span>
                  </div>

                  {/* Cells */}
                  {DAYS.map((day) => {
                    const entry = weeklyPlan[day]?.[mealType];
                    return (
                      <div
                        key={`${day}-${mealType}`}
                        className="relative h-full flex flex-col group min-h-[120px]"
                      >
                        {entry ? (
                          <div className="bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-primary-500"></div>
                            <div className="relative w-full h-14 rounded-lg overflow-hidden mb-2 shrink-0">
                              <Image
                                src={entry.food.imageUrl}
                                alt={entry.food.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div
                                className="font-bold text-slate-800 text-[11px] leading-tight line-clamp-2"
                                title={entry.food.name}
                              >
                                {entry.food.name}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1 font-medium">
                                {entry.food.totalCalories} kcal
                              </div>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border border-slate-200 rounded-2xl">
                              <Link
                                href={`/food/${entry.food.id}`}
                                className="p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50/50">
                            <span className="text-slate-300 text-sm">—</span>
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
      )}

      {/* Empty State */}
      {!weeklyPlan && !isLoading && (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100">
          <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">
            Chưa có thực đơn nào
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Điều chỉnh ngân sách và calo mục tiêu, sau đó bấm "Tạo Thực Đơn"
          </p>
        </div>
      )}
    </div>
  );
}
