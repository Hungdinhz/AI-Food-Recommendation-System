package com.example.backend.common;

import com.example.backend.recipes.Ingredient;
import com.example.backend.recipes.IngredientRepository;
import com.example.backend.recipes.Recipe;
import com.example.backend.recipes.RecipeIngredient;
import com.example.backend.recipes.RecipeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class DataSeeder implements CommandLineRunner {

    private final RecipeRepository recipeRepository;
    private final IngredientRepository ingredientRepository;

    public DataSeeder(RecipeRepository recipeRepository, IngredientRepository ingredientRepository) {
        this.recipeRepository = recipeRepository;
        this.ingredientRepository = ingredientRepository;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (recipeRepository.count() == 0) {
            // Recipe 1: Phở Bò
            Ingredient banhPho = new Ingredient();
            banhPho.setName("Bánh phở");
            banhPho.setEstimatedPrice(15000.0);
            banhPho.setUnit("g");
            
            Ingredient thitBo = new Ingredient();
            thitBo.setName("Thịt bò");
            thitBo.setEstimatedPrice(30000.0);
            thitBo.setUnit("g");

            Ingredient nuocDung = new Ingredient();
            nuocDung.setName("Nước dùng");
            nuocDung.setEstimatedPrice(10000.0);
            nuocDung.setUnit("ml");

            ingredientRepository.save(banhPho);
            ingredientRepository.save(thitBo);
            ingredientRepository.save(nuocDung);

            Recipe phoBo = new Recipe();
            phoBo.setName("Phở Bò");
            phoBo.setDescription("Món ăn truyền thống của Việt Nam, thơm ngon đậm đà.");
            phoBo.setInstructions("1. Đun nóng nước dùng. 2. Trụng bánh phở. 3. Thêm thịt bò và chan nước dùng.");
            phoBo.setMealType("Sáng");
            phoBo.setTotalCalories(450.0);
            phoBo.setProtein(30.0);
            phoBo.setCarbs(55.0);
            phoBo.setFat(12.0);

            RecipeIngredient riBanhPho = new RecipeIngredient();
            riBanhPho.setRecipe(phoBo);
            riBanhPho.setIngredient(banhPho);
            riBanhPho.setAmount(150.0);

            RecipeIngredient riThitBo = new RecipeIngredient();
            riThitBo.setRecipe(phoBo);
            riThitBo.setIngredient(thitBo);
            riThitBo.setAmount(100.0);

            RecipeIngredient riNuocDung = new RecipeIngredient();
            riNuocDung.setRecipe(phoBo);
            riNuocDung.setIngredient(nuocDung);
            riNuocDung.setAmount(500.0);

            phoBo.getIngredients().add(riBanhPho);
            phoBo.getIngredients().add(riThitBo);
            phoBo.getIngredients().add(riNuocDung);

            recipeRepository.save(phoBo);

            // Recipe 2: Cơm Tấm Sườn Bì
            Ingredient gaoTam = new Ingredient();
            gaoTam.setName("Gạo tấm");
            gaoTam.setEstimatedPrice(10000.0);
            gaoTam.setUnit("g");

            Ingredient suonCotLet = new Ingredient();
            suonCotLet.setName("Sườn cốt lết");
            suonCotLet.setEstimatedPrice(35000.0);
            suonCotLet.setUnit("g");

            ingredientRepository.save(gaoTam);
            ingredientRepository.save(suonCotLet);

            Recipe comTam = new Recipe();
            comTam.setName("Cơm Tấm Sườn Bì");
            comTam.setDescription("Món cơm đặc sản Sài Gòn với sườn nướng mật ong và bì lợn thơm lừng.");
            comTam.setInstructions("1. Nấu gạo tấm. 2. Ướp và nướng sườn cốt lết. 3. Ăn kèm nước mắm chua ngọt.");
            comTam.setMealType("Trưa");
            comTam.setTotalCalories(650.0);
            comTam.setProtein(35.0);
            comTam.setCarbs(80.0);
            comTam.setFat(22.0);

            RecipeIngredient riGaoTam = new RecipeIngredient();
            riGaoTam.setRecipe(comTam);
            riGaoTam.setIngredient(gaoTam);
            riGaoTam.setAmount(200.0);

            RecipeIngredient riSuon = new RecipeIngredient();
            riSuon.setRecipe(comTam);
            riSuon.setIngredient(suonCotLet);
            riSuon.setAmount(150.0);

            comTam.getIngredients().add(riGaoTam);
            comTam.getIngredients().add(riSuon);

            recipeRepository.save(comTam);
        }
    }
}
