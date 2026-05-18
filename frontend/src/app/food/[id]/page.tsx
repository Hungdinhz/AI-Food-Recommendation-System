import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MOCK_FOODS } from "@/lib/mockData";
import { Flame, Droplets, Wheat, DollarSign, ChefHat, Info } from "lucide-react";
import KitchenTimeline from "@/components/KitchenTimeline";

export default async function FoodDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const food = MOCK_FOODS.find((f) => f.id === resolvedParams.id);
  
  if (!food) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="relative h-[400px] rounded-[3rem] overflow-hidden shadow-2xl">
        <Image src={food.image} alt={food.name} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{food.name}</h1>
          <div className="flex flex-wrap gap-4 items-center text-sm font-medium">
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-orange-400" /> {food.calories} kcal
            </span>
            <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-green-300">
              <DollarSign className="w-4 h-4" /> {food.costEstimate.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-primary-500" /> Let's get cooking
            </h2>
            <KitchenTimeline steps={food.cookingSteps} />
          </section>

          {/* Kitchen Tips */}
          <section className="bg-primary-50 rounded-3xl p-8 border border-primary-100">
            <h3 className="text-xl font-bold text-primary-800 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5" /> Chef's Tips
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
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Macros Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Nutrition Facts</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Flame className="w-4 h-4 text-red-500" /> Protein
                </span>
                <span className="font-bold text-slate-800">{food.macros.protein}g</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Wheat className="w-4 h-4 text-yellow-500" /> Carbs
                </span>
                <span className="font-bold text-slate-800">{food.macros.carbs}g</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Droplets className="w-4 h-4 text-blue-500" /> Fat
                </span>
                <span className="font-bold text-slate-800">{food.macros.fat}g</span>
              </div>
            </div>
          </div>

          {/* Ingredients Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Ingredients</h3>
            <ul className="space-y-3">
              {food.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-600">
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
