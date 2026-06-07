import MealCalendar from "@/components/MealCalendar";

export default function PlanPage() {
  return (
    <div className="space-y-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
        <MealCalendar />
      </div>
    </div>
  );
}
