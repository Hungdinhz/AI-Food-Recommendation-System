import MealCalendar from "@/components/MealCalendar";
import { Sparkles } from "lucide-react";

export default function PlanPage() {
  return (
    <div className="space-y-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <MealCalendar />
      </div>

      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl gap-6">
        <div>
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-6 h-6" /> Generate Next Week's Plan
          </h3>
          <p className="text-primary-100 max-w-xl">
            Let our AI analyze your progress and create a fresh, exciting meal plan for the upcoming week based on your evolving goals.
          </p>
        </div>
        <button className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold shadow-lg hover:scale-105 transition-transform shrink-0 whitespace-nowrap">
          Generate New Plan
        </button>
      </div>
    </div>
  );
}
