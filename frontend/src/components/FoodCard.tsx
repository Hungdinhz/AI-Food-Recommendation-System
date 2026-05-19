import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, Droplets, Wheat, DollarSign } from "lucide-react";
import { Food } from "@/lib/mockData";

interface FoodCardProps {
  food: Food;
}

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <Link href={`/food/${food.id}`} className="group block">
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={food.imageUrl}
            alt={food.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-sm text-slate-700">
            <Flame className="w-4 h-4 text-orange-500" />
            {food.totalCalories} kcal
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-800 line-clamp-2">{food.name}</h3>
            <span className="flex items-center text-primary-600 font-bold bg-primary-50 px-2 py-1 rounded-lg">
              <DollarSign className="w-4 h-4" />
              {food.costEstimate.toFixed(2)}
            </span>
          </div>

          {/* Macros */}
          <div className="flex gap-4">
            <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-red-500" /> Protein
              </div>
              <div className="font-semibold text-slate-700">{food.macros.protein}g</div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                <Wheat className="w-3 h-3 text-yellow-500" /> Carbs
              </div>
              <div className="font-semibold text-slate-700">{food.macros.carbs}g</div>
            </div>
            <div className="flex-1 bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                <Droplets className="w-3 h-3 text-blue-500" /> Fat
              </div>
              <div className="font-semibold text-slate-700">{food.macros.fat}g</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
