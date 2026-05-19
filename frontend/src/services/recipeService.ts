import { fetchApi } from "./apiClient";
import { MOCK_FOODS, Food } from "@/lib/mockData";

export interface RecipeFilterParams {
  budget?: number;
  mealType?: string;
  nutritionGoal?: string;
}

export const recipeService = {
  /**
   * Fetch recipes based on user preferences.
   */
  async getRecommendations(params: RecipeFilterParams): Promise<Food[]> {
    // Build query string
    const queryParams = new URLSearchParams();
    if (params.budget) queryParams.append("budget", params.budget.toString());
    if (params.mealType) queryParams.append("mealType", params.mealType);
    if (params.nutritionGoal) queryParams.append("goal", params.nutritionGoal);

    // Call real backend endpoint
    const response = await fetchApi<any[]>(`/recipes?${queryParams.toString()}`);
    
    // Map Backend DTO to Frontend Food interface
    return response.map((dto) => ({
      id: dto.id?.toString() || Math.random().toString(),
      name: dto.name || "Unknown Recipe",
      imageUrl: dto.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
      totalCalories: dto.totalCalories || 0,
      macros: {
        protein: dto.protein || 0,
        carbs: dto.carbs || 0,
        fat: dto.fat || 0,
      },
      costEstimate: dto.ingredients 
        ? dto.ingredients.reduce((total: number, ri: any) => total + ((ri.amount || 0) * (ri.ingredient?.estimatedPrice || 0)), 0) 
        : 0,
      ingredients: dto.ingredients 
        ? dto.ingredients.map((ri: any) => `${ri.amount} ${ri.ingredient?.unit || ''} ${ri.ingredient?.name || ''}`) 
        : [],
      cookingSteps: dto.instructions 
        ? [{ time: "Total", instruction: dto.instructions }] 
        : [],
      tips: [],
    }));
  },
};
