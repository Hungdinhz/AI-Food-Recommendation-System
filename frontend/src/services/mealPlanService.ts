import { MOCK_FOODS, Food } from "@/lib/mockData";

export type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";
export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface MealEntry {
  id: string;
  foodId: string;
  food: Food;
}

export type DailyMeals = {
  [K in MealType]: MealEntry | null;
};

export type WeeklyPlan = {
  [K in DayOfWeek]: DailyMeals;
};

export const mealPlanService = {
  async getWeeklyPlan(userId: string): Promise<WeeklyPlan> {
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 800));

    // Fallback Mock Data using MOCK_FOODS
    const food1 = MOCK_FOODS[0];
    const food2 = MOCK_FOODS[1];
    const food3 = MOCK_FOODS[2];

    const createEntry = (id: string, food: Food): MealEntry => ({ id, foodId: food.id, food });

    const emptyDay: DailyMeals = {
      Breakfast: null,
      Lunch: null,
      Dinner: null,
      Snack: null,
    };

    return {
      Mon: {
        Breakfast: createEntry("m1", food3),
        Lunch: createEntry("m2", food1),
        Dinner: createEntry("m3", food2),
        Snack: null,
      },
      Tue: {
        ...emptyDay,
        Breakfast: createEntry("t1", food1),
        Lunch: createEntry("t2", food2),
      },
      Wed: {
        ...emptyDay,
        Lunch: createEntry("w1", food3),
        Dinner: createEntry("w2", food1),
      },
      Thu: {
        ...emptyDay,
        Breakfast: createEntry("th1", food2),
        Snack: createEntry("th2", food3),
      },
      Fri: {
        ...emptyDay,
        Lunch: createEntry("f1", food1),
        Dinner: createEntry("f2", food2),
      },
      Sat: {
        ...emptyDay,
      },
      Sun: {
        ...emptyDay,
        Breakfast: createEntry("s1", food3),
        Lunch: createEntry("s2", food2),
        Dinner: createEntry("s3", food1),
      },
    };
  },
};
