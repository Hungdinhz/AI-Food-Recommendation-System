import { fetchApi } from "./apiClient";
import { Food } from "@/lib/mockData";

export interface RecipeFilterParams {
  budget?: number;
  mealType?: string;
  nutritionGoal?: string;
}

// Map backend DTO to frontend Food interface
function mapDtoToFood(dto: any): Food {
  return {
    id: dto.id?.toString() || Math.random().toString(),
    name: dto.name || "Unknown Recipe",
    imageUrl:
      dto.imageUrl ||
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    totalCalories: dto.totalCalories || 0,
    macros: {
      protein: dto.protein || 0,
      carbs: dto.carbs || 0,
      fat: dto.fat || 0,
    },
    costEstimate: dto.ingredients
      ? dto.ingredients.reduce(
          (total: number, ri: any) =>
            total +
            ((ri.amount || 0) * (ri.ingredient?.estimatedPrice || 0)) / 1000,
          0
        )
      : 0,
    ingredients: dto.ingredients
      ? dto.ingredients.map(
          (ri: any) =>
            `${ri.amount} ${ri.ingredient?.unit || ""} ${ri.ingredient?.name || ""}`
        )
      : [],
    cookingSteps: dto.instructions
      ? dto.instructions
          .split("\n")
          .filter((s: string) => s.trim())
          .map((step: string, idx: number) => ({
            time: `Bước ${idx + 1}`,
            instruction: step.replace(/^\d+\.\s*/, ""),
          }))
      : [],
    tips: dto.description ? [dto.description] : [],
  };
}

export const recipeService = {
  /**
   * Fetch recipes based on user preferences.
   */
  async getRecommendations(params: RecipeFilterParams): Promise<Food[]> {
    const queryParams = new URLSearchParams();
    if (params.mealType) queryParams.append("mealType", params.mealType);

    const response = await fetchApi<any[]>(
      `/recipes?${queryParams.toString()}`
    );
    return response.map(mapDtoToFood);
  },

  /**
   * Fetch a single recipe by ID.
   */
  async getRecipeById(id: string): Promise<Food | null> {
    try {
      const dto = await fetchApi<any>(`/recipes/${id}`);
      return mapDtoToFood(dto);
    } catch {
      return null;
    }
  },
};
