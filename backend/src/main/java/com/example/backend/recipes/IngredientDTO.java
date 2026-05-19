package com.example.backend.recipes;

import lombok.Data;

@Data
public class IngredientDTO {
    private Long id;
    private String name;
    private Double estimatedPrice;
    private String unit;
}
