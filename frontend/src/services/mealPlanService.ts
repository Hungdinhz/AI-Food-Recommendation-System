import { fetchApi } from "./apiClient";
import { Food } from "@/lib/mockData";

export type MealType = "Sáng" | "Trưa" | "Tối";
export type DayOfWeek = "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "CN";

export interface MealEntry {
  id: string;
  food: Food;
}

export type DailyMeals = {
  [K in MealType]?: MealEntry | null;
};

export type WeeklyPlan = {
  [K in DayOfWeek]: DailyMeals;
};

export interface MealPlanSummary {
  id: number;
  startDate: string;
  endDate: string;
  targetCalories: number;
  budgetLimit: number;
  totalEstimatedCost: number;
}

export interface GeneratePlanParams {
  userId: number;
  budget: number;
  targetCalories: number;
}

// Map the backend response into our frontend WeeklyPlan structure
function mapApiResponseToWeeklyPlan(data: any): {
  plan: WeeklyPlan;
  summary: MealPlanSummary;
} {
  const days: DayOfWeek[] = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const emptyDay = (): DailyMeals => ({
    Sáng: null,
    Trưa: null,
    Tối: null,
  });

  const plan: WeeklyPlan = {
    T2: emptyDay(),
    T3: emptyDay(),
    T4: emptyDay(),
    T5: emptyDay(),
    T6: emptyDay(),
    T7: emptyDay(),
    CN: emptyDay(),
  };

  // Group daily meals by date
  const dateGroups: Record<string, any[]> = {};
  if (data.dailyMeals) {
    for (const meal of data.dailyMeals) {
      const date = meal.date;
      if (!dateGroups[date]) dateGroups[date] = [];
      dateGroups[date].push(meal);
    }
  }

  // Map each date group to a day of the week
  const sortedDates = Object.keys(dateGroups).sort();
  sortedDates.forEach((date, idx) => {
    if (idx >= 7) return;
    const dayKey = days[idx];
    const meals = dateGroups[date];

    for (const meal of meals) {
      const recipe = meal.recipe;
      if (!recipe) continue;

      const food: Food = {
        id: recipe.id?.toString() || Math.random().toString(),
        name: recipe.name || "Unknown",
        imageUrl:
          recipe.imageUrl ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
        totalCalories: recipe.totalCalories || 0,
        macros: {
          protein: recipe.protein || 0,
          carbs: recipe.carbs || 0,
          fat: recipe.fat || 0,
        },
        costEstimate: 0,
        ingredients: recipe.ingredients
          ? recipe.ingredients.map(
              (ri: any) =>
                `${ri.amount} ${ri.ingredient?.unit || ""} ${ri.ingredient?.name || ""}`
            )
          : [],
        cookingSteps: recipe.instructions
          ? recipe.instructions
              .split("\n")
              .filter((s: string) => s.trim())
              .map((step: string, i: number) => ({
                time: `Bước ${i + 1}`,
                instruction: step.replace(/^\d+\.\s*/, ""),
              }))
          : [],
        tips: [],
      };

      const mealType = meal.mealType as MealType;
      if (mealType && plan[dayKey]) {
        plan[dayKey][mealType] = {
          id: `${dayKey}-${mealType}`,
          food,
        };
      }
    }
  });

  const summary: MealPlanSummary = {
    id: data.id,
    startDate: data.startDate,
    endDate: data.endDate,
    targetCalories: data.targetCalories,
    budgetLimit: data.budgetLimit,
    totalEstimatedCost: data.totalEstimatedCost,
  };

  return { plan, summary };
}

export const mealPlanService = {
  async generateWeeklyPlan(
    params: GeneratePlanParams
  ): Promise<{ plan: WeeklyPlan; summary: MealPlanSummary }> {
    const data = await fetchApi<any>("/meal-plans/generate", {
      method: "POST",
      body: JSON.stringify(params),
    });
    return mapApiResponseToWeeklyPlan(data);
  },
};
