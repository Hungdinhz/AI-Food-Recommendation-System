package com.example.backend.mealplans;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Data
public class MealPlanResponseDTO implements Serializable {
    private Long id;
    private Long userId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double targetCalories;
    private Double budgetLimit;
    private Double totalEstimatedCost;
    private List<DailyMealResponseDTO> dailyMeals;
}
