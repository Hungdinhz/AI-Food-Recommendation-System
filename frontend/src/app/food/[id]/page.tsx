"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Flame,
  Droplets,
  Wheat,
  DollarSign,
  ChefHat,
  Info,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import KitchenTimeline from "@/components/KitchenTimeline";
import { recipeService } from "@/services/recipeService";
import { Food } from "@/lib/mockData";

export default function FoodDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [food, setFood] = useState<Food | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFood = async () => {
      const id = params.id as string;
      try {
        const result = await recipeService.getRecipeById(id);
        setFood(result);
      } catch (error) {
        console.error("Failed to fetch recipe", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFood();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-primary-500">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="font-semibold">Đang tải chi tiết món ăn...</p>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-500 text-lg">Không tìm thấy món ăn này.</p>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Quay về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      {/* Hero Header */}
      <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl">
        <Image
          src={food.imageUrl}
          alt={food.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{food.name}</h1>
          <div className="flex flex-wrap gap-4 items-center text-sm font-medium">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" />{" "}
              {food.totalCalories} kcal
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-green-300">
              <DollarSign className="w-4 h-4" />{" "}
              {food.costEstimate.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-primary-500" /> Cách nấu
            </h2>
            <KitchenTimeline steps={food.cookingSteps} />
          </section>

          {/* Tips */}
          {food.tips.length > 0 && (
            <section className="bg-primary-50 rounded-3xl p-8 border border-primary-100">
              <h3 className="text-xl font-bold text-primary-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" /> Mô tả
              </h3>
              <ul className="space-y-3">
                {food.tips.map((tip, idx) => (
                  <li key={idx} className="flex gap-3 text-primary-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-2 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Macros Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Thông tin dinh dưỡng
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Flame className="w-4 h-4 text-red-500" /> Protein
                </span>
                <span className="font-bold text-slate-800">
                  {food.macros.protein}g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Wheat className="w-4 h-4 text-yellow-500" /> Carbs
                </span>
                <span className="font-bold text-slate-800">
                  {food.macros.carbs}g
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Droplets className="w-4 h-4 text-blue-500" /> Fat
                </span>
                <span className="font-bold text-slate-800">
                  {food.macros.fat}g
                </span>
              </div>
            </div>
          </div>

          {/* Ingredients Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Nguyên liệu
            </h3>
            <ul className="space-y-3">
              {food.ingredients.map((ing, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-slate-600"
                >
                  <div className="w-2 h-2 rounded-full bg-secondary-400" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
