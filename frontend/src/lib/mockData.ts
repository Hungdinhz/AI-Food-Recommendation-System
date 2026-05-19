export interface Food {
  id: string;
  name: string;
  imageUrl: string;
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  costEstimate: number;
  ingredients: string[];
  cookingSteps: { time: string; instruction: string }[];
  tips: string[];
}

export const MOCK_FOODS: Food[] = [
  {
    id: "1",
    name: "Grilled Salmon Salad",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop",
    totalCalories: 450,
    macros: { protein: 42, carbs: 12, fat: 28 },
    costEstimate: 12.5,
    ingredients: [
      "200g Fresh Salmon Filet",
      "2 cups Mixed Greens",
      "1/2 Avocado, sliced",
      "Cherry Tomatoes",
      "Olive Oil Dressing",
    ],
    cookingSteps: [
      { time: "0:00", instruction: "Preheat grill to medium-high heat." },
      { time: "0:05", instruction: "Season salmon with salt, pepper, and olive oil." },
      { time: "0:10", instruction: "Grill salmon for 4-5 minutes per side." },
      { time: "0:20", instruction: "Toss greens and assemble the salad." },
    ],
    tips: ["Don't overcook the salmon to keep it tender.", "Add a squeeze of lemon for extra freshness."],
  },
  {
    id: "2",
    name: "Quinoa Chicken Bowl",
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    totalCalories: 520,
    macros: { protein: 38, carbs: 45, fat: 18 },
    costEstimate: 8.0,
    ingredients: [
      "150g Grilled Chicken Breast",
      "1 cup Cooked Quinoa",
      "Roasted Sweet Potatoes",
      "Steamed Broccoli",
      "Tahini Sauce",
    ],
    cookingSteps: [
      { time: "0:00", instruction: "Boil quinoa according to package instructions." },
      { time: "0:15", instruction: "Roast sweet potatoes with a drizzle of oil at 400°F." },
      { time: "0:30", instruction: "Pan-sear chicken breast until fully cooked." },
      { time: "0:45", instruction: "Assemble bowl and drizzle with tahini." },
    ],
    tips: ["Prep a large batch of quinoa for the week to save time."],
  },
  {
    id: "3",
    name: "Vegan Tofu Stir-fry",
    imageUrl: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=800&auto=format&fit=crop",
    totalCalories: 380,
    macros: { protein: 22, carbs: 40, fat: 16 },
    costEstimate: 6.5,
    ingredients: [
      "200g Firm Tofu, cubed",
      "Mixed Bell Peppers",
      "Snow Peas",
      "Soy Sauce & Ginger Glaze",
      "Brown Rice",
    ],
    cookingSteps: [
      { time: "0:00", instruction: "Press tofu to remove excess water, then cube." },
      { time: "0:10", instruction: "Pan-fry tofu until crispy on all sides." },
      { time: "0:20", instruction: "Add veggies and stir-fry for 3-4 minutes." },
      { time: "0:25", instruction: "Pour in sauce and simmer until thickened." },
    ],
    tips: ["Use cornstarch on tofu before frying for an extra crispy texture."],
  },
];

export const MOCK_MEAL_PLAN = {
  monday: [
    { type: "Breakfast", foodId: "3" },
    { type: "Lunch", foodId: "1" },
    { type: "Dinner", foodId: "2" },
  ],
  tuesday: [
    { type: "Breakfast", foodId: "1" },
    { type: "Lunch", foodId: "2" },
    { type: "Dinner", foodId: "3" },
  ],
};
