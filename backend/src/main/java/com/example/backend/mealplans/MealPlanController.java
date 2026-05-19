package com.example.backend.mealplans;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/meal-plans")
public class MealPlanController {

    private final MealPlanGeneratorService mealPlanGeneratorService;

    public MealPlanController(MealPlanGeneratorService mealPlanGeneratorService) {
        this.mealPlanGeneratorService = mealPlanGeneratorService;
    }

    @PostMapping("/generate")
    public ResponseEntity<MealPlanResponseDTO> generateMealPlan(@RequestBody MealPlanRequestDTO request) {
        MealPlanResponseDTO result = mealPlanGeneratorService.generateWeeklyPlan(
                request.getUserId(),
                request.getBudget(),
                request.getTargetCalories()
        );
        return ResponseEntity.ok(result);
    }
}
