package com.example.backend.mealplans;

import lombok.Data;

@Data
public class MealPlanRequestDTO {
    private Long userId;
    private Double budget;
    private Double targetCalories;
}
