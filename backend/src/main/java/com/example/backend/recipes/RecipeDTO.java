package com.example.backend.recipes;

import lombok.Data;
import java.util.List;

@Data
public class RecipeDTO {
    private Long id;
    private String name;
    private String description;
    private String instructions;
    private String imageUrl;
    private String mealType;
    private Double totalCalories;
    private Double protein;
    private Double carbs;
    private Double fat;
    private List<RecipeIngredientDTO> ingredients;
}
