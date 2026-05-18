# Frontend API Client & UI Design Plan

Dự án này tuân theo kiến trúc **Decoupled**: Next.js chỉ đóng vai trò là Frontend. Toàn bộ Backend (Java Spring Boot, PostgreSQL, Redis) sẽ nằm ở một repository khác.

## Yêu Cầu Đánh Giá (User Review Required)
> [!IMPORTANT]
> - Chúng ta sẽ không sử dụng bất kỳ code Backend/Database nào trong repo này.
> - Xây dựng một layer API Client Service (sử dụng `fetch` API) tích hợp mock data để mô phỏng tương tác với Backend Java.

## Kế Hoạch Đề Xuất (Proposed Changes)

### 1. API Client Services Layer
Tạo thư mục `src/services` để quản lý các request gọi API:

#### [NEW] `src/services/apiClient.ts`
- Cấu hình base URL trỏ đến Backend Java (ví dụ: `http://localhost:8080/api/v1`).
- Viết các hàm fetch cơ bản với error handling.

#### [NEW] `src/services/recipeService.ts`
- Hàm `getRecipes(params)`: Gọi API để lấy danh sách món ăn (kèm mock data tĩnh nếu call lỗi/chưa có backend).
- Các params: `budget`, `mealType`, `minProtein`, `maxCalories`.

#### [NEW] `src/services/mealPlanService.ts`
- Hàm `getMealPlan(userId)` và `createMealPlan(data)`.

### 2. Thiết kế và Hoàn thiện UI Trang Chủ (Home Page)
Mặc dù đã có form cơ bản, chúng ta sẽ nâng cấp trang chủ:
- **HeroForm**: Liên kết với `recipeService.ts` để khi bấm "Generate", nó sẽ hiển thị trạng thái loading, gọi API Service và trả về danh sách món ăn phù hợp (sử dụng Mock Data).
- **Trạng thái Loading & Kết quả**: Thiết kế thêm phần hiển thị danh sách kết quả trả về ngay bên dưới HeroForm.

## Kế Hoạch Xác Minh (Verification Plan)
- Chạy `npm run dev`.
- Tương tác với HeroForm trên trang chủ.
- Kiểm tra console xem API client đã log ra URL đúng chưa (vd: `/api/v1/recipes?budget=15&mealType=Lunch...`) và giao diện có hiển thị Mock Data đúng cách không.
