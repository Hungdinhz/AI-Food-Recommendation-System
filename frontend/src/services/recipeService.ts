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
   * Falls back to mock data if the backend is unavailable.
   */
  async getRecommendations(params: RecipeFilterParams): Promise<Food[]> {
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.budget) queryParams.append("budget", params.budget.toString());
      if (params.mealType) queryParams.append("mealType", params.mealType);
      if (params.nutritionGoal) queryParams.append("goal", params.nutritionGoal);

      // Try to fetch from real backend
      const response = await fetchApi<Food[]>(`/recipes/recommend?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.warn("Backend is unavailable. Falling back to mock data.", error);
      
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Filter mock data based on basic criteria (demonstration purposes)
      let results = [...MOCK_FOODS];
      
      if (params.budget) {
        results = results.filter((food) => food.costEstimate <= params.budget!);
      }
      
      // If no results match, return all to prevent empty state in demo
      if (results.length === 0) {
        results = [...MOCK_FOODS];
      }

      return results;
    }
  },
};
