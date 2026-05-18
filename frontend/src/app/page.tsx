"use client";

import { useState, useEffect } from "react";
import HeroForm from "@/components/HeroForm";
import FoodCard from "@/components/FoodCard";
import { Sparkles, ChefHat } from "lucide-react";
import { recipeService, RecipeFilterParams } from "@/services/recipeService";
import { Food } from "@/lib/mockData";

export default function Home() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Initial load
  useEffect(() => {
    const fetchInitial = async () => {
      const initialFoods = await recipeService.getRecommendations({});
      setFoods(initialFoods);
    };
    fetchInitial();
  }, []);

  const handleGenerate = async (params: RecipeFilterParams) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await recipeService.getRecommendations(params);
      setFoods(results);
      
      // Scroll down slightly to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      console.error("Failed to fetch recipes", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section>
        <HeroForm onGenerate={handleGenerate} isLoading={isLoading} />
      </section>

      {/* Recommended Meals */}
      <section id="results" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-8">
          {hasSearched ? (
            <>
              <ChefHat className="w-6 h-6 text-primary-500" />
              <h2 className="text-3xl font-bold text-slate-800">Your Custom Menu</h2>
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-primary-500" />
              <h2 className="text-3xl font-bold text-slate-800">Recommended for You</h2>
            </>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 animate-pulse rounded-[2rem]"></div>
            ))}
          </div>
        ) : foods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {foods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
            <p className="text-slate-500">No recipes found matching your criteria. Try adjusting your budget or goals.</p>
          </div>
        )}
      </section>
    </div>
  );
}
