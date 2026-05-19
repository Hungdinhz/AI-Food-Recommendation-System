package com.example.backend.recipes;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public List<RecipeDTO> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<RecipeDTO> getRecipesByMealType(String mealType) {
        return recipeRepository.findByMealType(mealType).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private RecipeDTO mapToDTO(Recipe recipe) {
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
