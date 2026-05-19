package com.example.backend.mealplans;

import com.example.backend.recipes.RecipeDTO;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;

@Data
public class DailyMealResponseDTO implements Serializable {
    private LocalDate date;
    private String mealType;
    private RecipeDTO recipe;
}
