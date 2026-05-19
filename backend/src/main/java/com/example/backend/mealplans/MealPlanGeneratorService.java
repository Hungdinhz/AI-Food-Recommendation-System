package com.example.backend.mealplans;

import com.example.backend.recipes.IngredientDTO;
import com.example.backend.recipes.Recipe;
import com.example.backend.recipes.RecipeDTO;
import com.example.backend.recipes.RecipeIngredientDTO;
import com.example.backend.recipes.RecipeRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class MealPlanGeneratorService {

    private final RecipeRepository recipeRepository;
    private final MealPlanRepository mealPlanRepository;
    private final Random random = new Random();

    private static final String[] MEAL_TYPES = {"Sáng", "Trưa", "Tối"};
    private static final int DAYS_IN_WEEK = 7;
    private static final int MAX_OPTIMIZATION_ATTEMPTS = 100;
    private static final double CALORIE_TOLERANCE = 0.15; // 15%

    public MealPlanGeneratorService(RecipeRepository recipeRepository,
                                    MealPlanRepository mealPlanRepository) {
        this.recipeRepository = recipeRepository;
        this.mealPlanRepository = mealPlanRepository;
    }

    @Cacheable(value = "weeklyMealPlans", key = "#userId")
    @Transactional
    public MealPlanResponseDTO generateWeeklyPlan(Long userId, Double budget, Double targetCalories) {
        List<Recipe> allRecipes = recipeRepository.findAll();
        if (allRecipes.isEmpty()) {
            throw new RuntimeException("Không có món ăn nào trong hệ thống để lập kế hoạch.");
        }

        // Tổng calo mục tiêu cho cả tuần (7 ngày)
        double weeklyTargetCalories = targetCalories * DAYS_IN_WEEK;

        // Tạo danh sách lựa chọn ban đầu (ngẫu nhiên)
        List<Recipe> selectedRecipes = generateInitialSelection(allRecipes);

        // Tối ưu hóa bằng Local Search / Heuristic
        selectedRecipes = optimizeSelection(selectedRecipes, allRecipes, budget, weeklyTargetCalories);

        // Tính tổng chi phí ước lượng
        double totalCost = calculateTotalCost(selectedRecipes);

        // Tạo entity MealPlan và lưu xuống DB
        MealPlan mealPlan = buildMealPlanEntity(userId, budget, targetCalories, totalCost, selectedRecipes);
        mealPlanRepository.save(mealPlan);

        // Map sang DTO để trả về
        return mapToResponseDTO(mealPlan, selectedRecipes);
    }

    /**
     * Sinh danh sách 21 món ăn ban đầu (7 ngày x 3 bữa) bằng cách chọn ngẫu nhiên.
     */
    private List<Recipe> generateInitialSelection(List<Recipe> allRecipes) {
        int totalSlots = DAYS_IN_WEEK * MEAL_TYPES.length; // 21
        List<Recipe> selected = new ArrayList<>();
        for (int i = 0; i < totalSlots; i++) {
            selected.add(allRecipes.get(random.nextInt(allRecipes.size())));
        }
        return selected;
    }

    /**
     * Thuật toán Heuristic / Local Search:
     * Hoán đổi ngẫu nhiên các món ăn để tìm tổ hợp tối ưu gần nhất với
     * ngân sách và mục tiêu calo. Tối đa 100 lần thử.
     */
    private List<Recipe> optimizeSelection(List<Recipe> current, List<Recipe> allRecipes,
                                           Double budget, double weeklyTargetCalories) {
        List<Recipe> bestSelection = new ArrayList<>(current);
        double bestScore = evaluateFitness(bestSelection, budget, weeklyTargetCalories);

        for (int attempt = 0; attempt < MAX_OPTIMIZATION_ATTEMPTS; attempt++) {
            List<Recipe> candidate = new ArrayList<>(bestSelection);

            // Hoán đổi ngẫu nhiên 1 slot
            int swapIndex = random.nextInt(candidate.size());
            candidate.set(swapIndex, allRecipes.get(random.nextInt(allRecipes.size())));

            double candidateScore = evaluateFitness(candidate, budget, weeklyTargetCalories);

            // Nếu tổ hợp mới tốt hơn (score thấp hơn = tốt hơn), chấp nhận
            if (candidateScore < bestScore) {
                bestSelection = candidate;
                bestScore = candidateScore;
            }

            // Dừng sớm nếu đã đạt yêu cầu
            if (isSatisfactory(bestSelection, budget, weeklyTargetCalories)) {
                break;
            }
        }
        return bestSelection;
    }

    /**
     * Hàm đánh giá chất lượng tổ hợp (fitness function).
     * Score càng thấp càng tốt. Kết hợp 2 tiêu chí: lệch calo + vượt ngân sách.
     */
    private double evaluateFitness(List<Recipe> recipes, Double budget, double weeklyTargetCalories) {
        double totalCalories = recipes.stream()
                .mapToDouble(r -> r.getTotalCalories() != null ? r.getTotalCalories() : 0)
                .sum();
        double totalCost = calculateTotalCost(recipes);

        // Penalty cho lệch calo
        double calorieDiff = Math.abs(totalCalories - weeklyTargetCalories);
        double calorieScore = calorieDiff / Math.max(weeklyTargetCalories, 1);

        // Penalty cho vượt ngân sách
        double budgetPenalty = 0;
        if (budget != null && budget > 0 && totalCost > budget) {
            budgetPenalty = (totalCost - budget) / budget;
        }

        return calorieScore + budgetPenalty * 2; // Trọng số budget penalty cao hơn
    }

    /**
     * Kiểm tra xem tổ hợp đã thỏa mãn yêu cầu chưa:
     * - Calo không lệch quá 15%
     * - Tổng chi phí không vượt ngân sách
     */
    private boolean isSatisfactory(List<Recipe> recipes, Double budget, double weeklyTargetCalories) {
        double totalCalories = recipes.stream()
                .mapToDouble(r -> r.getTotalCalories() != null ? r.getTotalCalories() : 0)
                .sum();
        double totalCost = calculateTotalCost(recipes);

        boolean calorieOk = Math.abs(totalCalories - weeklyTargetCalories) <= weeklyTargetCalories * CALORIE_TOLERANCE;
        boolean budgetOk = budget == null || budget <= 0 || totalCost <= budget;

        return calorieOk && budgetOk;
    }

    /**
     * Tính tổng chi phí nguyên liệu của tất cả các món.
     */
    private double calculateTotalCost(List<Recipe> recipes) {
        double total = 0;
        for (Recipe recipe : recipes) {
            if (recipe.getIngredients() != null) {
                total += recipe.getIngredients().stream()
                        .mapToDouble(ri -> {
                            double price = ri.getIngredient() != null && ri.getIngredient().getEstimatedPrice() != null
                                    ? ri.getIngredient().getEstimatedPrice() : 0;
                            double amount = ri.getAmount() != null ? ri.getAmount() : 0;
                            return price * amount / 1000; // Quy về đơn vị kg/lít
                        })
                        .sum();
            }
        }
        return total;
    }

    /**
     * Xây dựng entity MealPlan từ danh sách món ăn đã chọn.
     */
    private MealPlan buildMealPlanEntity(Long userId, Double budget, Double targetCalories,
                                         double totalCost, List<Recipe> selectedRecipes) {
        MealPlan mealPlan = new MealPlan();
        mealPlan.setUserId(userId);
        mealPlan.setStartDate(LocalDate.now());
        mealPlan.setEndDate(LocalDate.now().plusDays(6));
        mealPlan.setTargetCalories(targetCalories);
        mealPlan.setBudgetLimit(budget);
        mealPlan.setTotalEstimatedCost(totalCost);

        int index = 0;
        for (int day = 0; day < DAYS_IN_WEEK; day++) {
            for (String mealType : MEAL_TYPES) {
                Recipe recipe = selectedRecipes.get(index);
                DailyMeal dailyMeal = new DailyMeal();
                dailyMeal.setDate(LocalDate.now().plusDays(day));
                dailyMeal.setMealType(mealType);
                dailyMeal.setRecipeId(recipe.getId());
                dailyMeal.setMealPlan(mealPlan);
                mealPlan.getDailyMeals().add(dailyMeal);
                index++;
            }
        }
        return mealPlan;
    }

    /**
     * Map MealPlan entity sang MealPlanResponseDTO kèm thông tin chi tiết món ăn.
     */
    private MealPlanResponseDTO mapToResponseDTO(MealPlan mealPlan, List<Recipe> selectedRecipes) {
        MealPlanResponseDTO dto = new MealPlanResponseDTO();
        dto.setId(mealPlan.getId());
        dto.setUserId(mealPlan.getUserId());
        dto.setStartDate(mealPlan.getStartDate());
        dto.setEndDate(mealPlan.getEndDate());
        dto.setTargetCalories(mealPlan.getTargetCalories());
        dto.setBudgetLimit(mealPlan.getBudgetLimit());
        dto.setTotalEstimatedCost(mealPlan.getTotalEstimatedCost());

        // Map từng DailyMeal kèm thông tin chi tiết Recipe
        List<DailyMealResponseDTO> dailyMealDTOs = new ArrayList<>();
        int index = 0;
        for (DailyMeal dm : mealPlan.getDailyMeals()) {
            DailyMealResponseDTO dmDTO = new DailyMealResponseDTO();
            dmDTO.setDate(dm.getDate());
            dmDTO.setMealType(dm.getMealType());
            dmDTO.setRecipe(mapRecipeToDTO(selectedRecipes.get(index)));
            dailyMealDTOs.add(dmDTO);
            index++;
        }
        dto.setDailyMeals(dailyMealDTOs);
        return dto;
    }

    /**
     * Map Recipe entity sang RecipeDTO (tái sử dụng logic mapping).
     */
    private RecipeDTO mapRecipeToDTO(Recipe recipe) {
        RecipeDTO dto = new RecipeDTO();
        dto.setId(recipe.getId());
        dto.setName(recipe.getName());
        dto.setDescription(recipe.getDescription());
        dto.setInstructions(recipe.getInstructions());
        dto.setImageUrl(recipe.getImageUrl());
        dto.setMealType(recipe.getMealType());
        dto.setTotalCalories(recipe.getTotalCalories());
        dto.setProtein(recipe.getProtein());
        dto.setCarbs(recipe.getCarbs());
        dto.setFat(recipe.getFat());

        if (recipe.getIngredients() != null) {
            List<RecipeIngredientDTO> ingredientDTOs = recipe.getIngredients().stream().map(ri -> {
                RecipeIngredientDTO riDTO = new RecipeIngredientDTO();
                riDTO.setAmount(ri.getAmount());
                if (ri.getIngredient() != null) {
                    IngredientDTO iDTO = new IngredientDTO();
                    iDTO.setId(ri.getIngredient().getId());
                    iDTO.setName(ri.getIngredient().getName());
                    iDTO.setEstimatedPrice(ri.getIngredient().getEstimatedPrice());
                    iDTO.setUnit(ri.getIngredient().getUnit());
                    riDTO.setIngredient(iDTO);
                }
                return riDTO;
            }).collect(Collectors.toList());
            dto.setIngredients(ingredientDTOs);
        }
        return dto;
    }
}
