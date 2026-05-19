package com.example.backend.recipes;

import lombok.Data;

@Data
public class RecipeIngredientDTO {
    private IngredientDTO ingredient;
    private Double amount;
}
