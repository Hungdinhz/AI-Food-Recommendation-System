package com.example.backend.recipes;

import lombok.Data;

import java.io.Serializable;

@Data
public class RecipeIngredientDTO implements Serializable {
    private IngredientDTO ingredient;
    private Double amount;
}
