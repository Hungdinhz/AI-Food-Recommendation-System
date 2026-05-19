package com.example.backend.recipes;

import lombok.Data;

import java.io.Serializable;

@Data
public class IngredientDTO implements Serializable {
    private Long id;
    private String name;
    private Double estimatedPrice;
    private String unit;
}
