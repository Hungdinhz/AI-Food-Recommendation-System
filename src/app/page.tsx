import HeroForm from "@/components/HeroForm";
import FoodCard from "@/components/FoodCard";
import { MOCK_FOODS } from "@/lib/mockData";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section>
        <HeroForm />
      </section>

      {/* Recommended Meals */}
      <section>
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-primary-500" />
          <h2 className="text-3xl font-bold text-slate-800">Recommended for You</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_FOODS.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </section>
    </div>
  );
}
