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
            seedPhoBo();
            seedComTamSuonBi();
            seedBunBoHue();
            seedGoiCuon();
            seedCaKhoTo();
            seedBanhMiThit();
            System.out.println("✅ DataSeeder: Đã seed 6 món ăn Việt Nam vào database.");
        }
    }

    private Ingredient createIngredient(String name, Double price, String unit) {
        Ingredient ing = new Ingredient();
        ing.setName(name);
        ing.setEstimatedPrice(price);
        ing.setUnit(unit);
        return ingredientRepository.save(ing);
    }

    private RecipeIngredient createRecipeIngredient(Recipe recipe, Ingredient ingredient, Double amount) {
        RecipeIngredient ri = new RecipeIngredient();
        ri.setRecipe(recipe);
        ri.setIngredient(ingredient);
        ri.setAmount(amount);
        return ri;
    }

    private void seedPhoBo() {
        Ingredient banhPho = createIngredient("Bánh phở", 15000.0, "g");
        Ingredient thitBo = createIngredient("Thịt bò", 30000.0, "g");
        Ingredient nuocDung = createIngredient("Nước dùng xương bò", 10000.0, "ml");
        Ingredient hanhLa = createIngredient("Hành lá", 5000.0, "g");

        Recipe recipe = new Recipe();
        recipe.setName("Phở Bò Hà Nội");
        recipe.setDescription("Món phở bò truyền thống Hà Nội với nước dùng trong veo, thơm ngọt từ xương bò ninh 12 tiếng, ăn kèm bánh phở mềm và thịt bò tái chín.");
        recipe.setInstructions("1. Ninh xương bò 12 tiếng với gừng nướng, hành nướng, quế, hồi, thảo quả.\n2. Lọc nước dùng thật trong, nêm nước mắm, đường phèn, muối vừa ăn.\n3. Trụng bánh phở qua nước sôi 10 giây, xếp vào tô.\n4. Thái thịt bò thật mỏng, xếp lên trên bánh phở.\n5. Chan nước dùng sôi già, rắc hành lá, ngò gai.\n6. Ăn kèm rau thơm, giá đỗ, chanh, ớt tươi.");
        recipe.setImageUrl("https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=800&auto=format&fit=crop");
        recipe.setMealType("Sáng");
        recipe.setTotalCalories(450.0);
        recipe.setProtein(30.0);
        recipe.setCarbs(55.0);
        recipe.setFat(12.0);

        recipe.getIngredients().add(createRecipeIngredient(recipe, banhPho, 150.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, thitBo, 100.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, nuocDung, 500.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, hanhLa, 20.0));
        recipeRepository.save(recipe);
    }

    private void seedComTamSuonBi() {
        Ingredient gaoTam = createIngredient("Gạo tấm", 10000.0, "g");
        Ingredient suonCotLet = createIngredient("Sườn cốt lết", 35000.0, "g");
        Ingredient bi = createIngredient("Bì lợn", 20000.0, "g");
        Ingredient nuocMam = createIngredient("Nước mắm chua ngọt", 5000.0, "ml");

        Recipe recipe = new Recipe();
        recipe.setName("Cơm Tấm Sườn Bì Chả");
        recipe.setDescription("Đặc sản Sài Gòn với cơm tấm dẻo thơm, sườn nướng mật ong vàng ươm, bì lợn giòn tan và chả trứng béo ngậy.");
        recipe.setInstructions("1. Vo gạo tấm, nấu cơm với tỉ lệ nước 1:1.2.\n2. Ướp sườn với sả, tỏi, nước mắm, mật ong, dầu hào 2 tiếng.\n3. Nướng sườn trên than hoa, phết thêm nước ướp.\n4. Trộn bì lợn với thính gạo, hành phi.\n5. Hấp chả trứng 25 phút.\n6. Xếp đĩa: cơm tấm, sườn nướng, bì, chả. Rưới nước mắm chua ngọt.");
        recipe.setImageUrl("https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=800&auto=format&fit=crop");
        recipe.setMealType("Trưa");
        recipe.setTotalCalories(650.0);
        recipe.setProtein(35.0);
        recipe.setCarbs(80.0);
        recipe.setFat(22.0);

        recipe.getIngredients().add(createRecipeIngredient(recipe, gaoTam, 200.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, suonCotLet, 150.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, bi, 50.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, nuocMam, 30.0));
        recipeRepository.save(recipe);
    }

    private void seedBunBoHue() {
        Ingredient bunTuoi = createIngredient("Bún tươi", 12000.0, "g");
        Ingredient boGac = createIngredient("Thịt bò gác", 35000.0, "g");
        Ingredient gioHeo = createIngredient("Giò heo", 25000.0, "g");
        Ingredient meTom = createIngredient("Mắm tôm", 8000.0, "ml");

        Recipe recipe = new Recipe();
        recipe.setName("Bún Bò Huế");
        recipe.setDescription("Bún bò Huế cay nồng đặc trưng với nước dùng đậm đà từ xương heo, sả, ớt và mắm tôm Huế chính hiệu.");
        recipe.setInstructions("1. Ninh xương heo và bò 4-5 tiếng cho ngọt nước.\n2. Phi sả băm với dầu điều, ớt bột tạo màu đỏ đặc trưng.\n3. Cho mắm ruốc/mắm tôm vào nước dùng, nêm nếm.\n4. Luộc giò heo chín mềm, thái lát dày.\n5. Trụng bún tươi, xếp vào tô lớn.\n6. Xếp thịt bò, giò heo, chan nước dùng sôi.\n7. Ăn kèm rau sống, bắp chuối, chanh, ớt.");
        recipe.setImageUrl("https://images.unsplash.com/photo-1576577445504-6af96477db52?q=80&w=800&auto=format&fit=crop");
        recipe.setMealType("Sáng");
        recipe.setTotalCalories(520.0);
        recipe.setProtein(32.0);
        recipe.setCarbs(60.0);
        recipe.setFat(18.0);

        recipe.getIngredients().add(createRecipeIngredient(recipe, bunTuoi, 200.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, boGac, 100.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, gioHeo, 80.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, meTom, 15.0));
        recipeRepository.save(recipe);
    }

    private void seedGoiCuon() {
        Ingredient banhTrang = createIngredient("Bánh tráng", 8000.0, "g");
        Ingredient tomSu = createIngredient("Tôm sú", 45000.0, "g");
        Ingredient bunKho = createIngredient("Bún khô", 10000.0, "g");
        Ingredient rauSong = createIngredient("Rau sống tổng hợp", 5000.0, "g");

        Recipe recipe = new Recipe();
        recipe.setName("Gỏi Cuốn Tôm Thịt");
        recipe.setDescription("Gỏi cuốn tươi mát với tôm sú hồng đào, thịt ba chỉ luộc, bún tươi và rau sống cuốn trong bánh tráng mỏng, chấm nước mắm chua ngọt.");
        recipe.setInstructions("1. Luộc tôm sú với chút muối, bóc vỏ chẻ đôi.\n2. Luộc thịt ba chỉ, thái lát mỏng.\n3. Trụng bún, để ráo.\n4. Nhúng bánh tráng vào nước ấm 2 giây.\n5. Xếp rau sống, bún, thịt, tôm lên bánh tráng.\n6. Cuốn chặt tay, gấp hai đầu vào.\n7. Pha nước chấm: nước mắm, đường, chanh, tỏi, ớt.");
        recipe.setImageUrl("https://images.unsplash.com/photo-1562967916-eb82221dfb44?q=80&w=800&auto=format&fit=crop");
        recipe.setMealType("Trưa");
        recipe.setTotalCalories(320.0);
        recipe.setProtein(25.0);
        recipe.setCarbs(35.0);
        recipe.setFat(8.0);

        recipe.getIngredients().add(createRecipeIngredient(recipe, banhTrang, 60.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, tomSu, 100.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, bunKho, 80.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, rauSong, 100.0));
        recipeRepository.save(recipe);
    }

    private void seedCaKhoTo() {
        Ingredient caBasa = createIngredient("Cá basa", 28000.0, "g");
        Ingredient nuocMau = createIngredient("Nước màu (caramel)", 5000.0, "ml");
        Ingredient thitBaRoi = createIngredient("Thịt ba rọi", 25000.0, "g");
        Ingredient tieu = createIngredient("Tiêu xay", 15000.0, "g");

        Recipe recipe = new Recipe();
        recipe.setName("Cá Kho Tộ");
        recipe.setDescription("Cá kho tộ miền Nam đậm đà với cá basa kho rim trong nước màu caramel, tiêu và nước mắm nguyên chất, ăn kèm cơm trắng nóng.");
        recipe.setInstructions("1. Cá basa cắt khúc dày 3cm, ướp nước mắm, tiêu 15 phút.\n2. Thắng nước màu (caramel) trong tộ đất.\n3. Xếp thịt ba rọi dưới đáy tộ, cá lên trên.\n4. Đổ nước mắm pha, nước dừa tươi vào.\n5. Kho lửa lớn 5 phút cho sôi, hạ lửa nhỏ kho 25-30 phút.\n6. Rắc tiêu xay, hành lá. Ăn kèm cơm trắng nóng.");
        recipe.setImageUrl("https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop");
        recipe.setMealType("Tối");
        recipe.setTotalCalories(480.0);
        recipe.setProtein(28.0);
        recipe.setCarbs(15.0);
        recipe.setFat(35.0);

        recipe.getIngredients().add(createRecipeIngredient(recipe, caBasa, 200.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, nuocMau, 20.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, thitBaRoi, 50.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, tieu, 5.0));
        recipeRepository.save(recipe);
    }

    private void seedBanhMiThit() {
        Ingredient banhMi = createIngredient("Bánh mì", 5000.0, "cái");
        Ingredient paTe = createIngredient("Pate gan", 20000.0, "g");
        Ingredient chaLua = createIngredient("Chả lụa", 25000.0, "g");
        Ingredient doChau = createIngredient("Đồ chua (cà rốt, củ cải)", 5000.0, "g");

        Recipe recipe = new Recipe();
        recipe.setName("Bánh Mì Thịt Nguội");
        recipe.setDescription("Bánh mì Sài Gòn giòn rụm với pate gan béo ngậy, chả lụa thơm, đồ chua giòn tan và nước sốt đặc biệt – món ăn đường phố nổi tiếng thế giới.");
        recipe.setInstructions("1. Nướng nóng bánh mì cho giòn vỏ (180°C, 3 phút).\n2. Bổ đôi bánh mì, phết pate gan đều hai mặt.\n3. Xếp chả lụa thái lát, thịt nguội lên trên.\n4. Cho đồ chua (cà rốt, củ cải ngâm giấm), dưa chuột, rau mùi.\n5. Rưới nước sốt Maggi, thêm ớt tươi.\n6. Gập bánh mì, ấn chặt. Ăn nóng ngay.");
        recipe.setImageUrl("https://images.unsplash.com/photo-1509722747041-616f39b57569?q=80&w=800&auto=format&fit=crop");
        recipe.setMealType("Sáng");
        recipe.setTotalCalories(380.0);
        recipe.setProtein(18.0);
        recipe.setCarbs(42.0);
        recipe.setFat(16.0);

        recipe.getIngredients().add(createRecipeIngredient(recipe, banhMi, 1.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, paTe, 30.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, chaLua, 50.0));
        recipe.getIngredients().add(createRecipeIngredient(recipe, doChau, 40.0));
        recipeRepository.save(recipe);
    }
}
