# Food & Meal Planner AI - Implementation Plan

Dự án này sẽ xây dựng giao diện frontend cho ứng dụng "Food & Meal Planner AI" sử dụng Next.js (App Router), Tailwind CSS và TypeScript. Giao diện sẽ được thiết kế hiện đại, responsive và tích hợp các animation nhẹ nhàng để tăng trải nghiệm người dùng.

## Yêu Cầu Đánh Giá (User Review Required)
> [!IMPORTANT]
> - Chúng ta sẽ sử dụng **Next.js 14+ (App Router)**.
> - Sử dụng `lucide-react` cho các icon.
> - Khởi tạo dự án trực tiếp vào thư mục hiện tại (`d:\du an\AI-Food-Recommend-System`).

## Kế Hoạch Đề Xuất (Proposed Changes)

### 1. Khởi tạo dự án
- Chạy lệnh `npx -y create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-npm --yes` để cài đặt Next.js, Tailwind, TypeScript.
- Cấu hình lại `tailwind.config.ts` để thêm các màu sắc chủ đạo (vibrant, modern) và các utility cần thiết.

### 2. Mock Data
Tạo file `src/lib/mockData.ts` chứa dữ liệu tĩnh cho:
- Danh sách món ăn (có macro, calo, giá).
- Kế hoạch ăn uống (Meal Plans).
- Lịch sử chat mẫu.

### 3. Components
#### [NEW] `src/components/HeroForm.tsx`
- Form nhập liệu đầu vào với slider cho ngân sách.
- Select/Radio buttons cho loại bữa ăn và mục tiêu dinh dưỡng.
- Thiết kế nổi bật (Hero Section) với background gradient hoặc hình ảnh mờ.

#### [NEW] `src/components/FoodCard.tsx`
- Hiển thị hình ảnh món ăn, tên, tổng calo.
- Hiển thị Macro (Protein, Carbs, Fat) dưới dạng badge hoặc progress bar nhỏ.
- Ước lượng chi phí.
- Hiệu ứng hover (scale nhẹ, shadow).

#### [NEW] `src/components/MealCalendar.tsx`
- Giao diện dạng lưới (grid) hiển thị các ngày trong tuần/tháng.
- Hiển thị các bữa ăn đã được phân bổ trong từng ngày.

#### [NEW] `src/components/ChatWidget.tsx`
- Nút floating ở góc dưới bên phải màn hình.
- Khi click sẽ mở ra một cửa sổ chat nhỏ (giống ChatGPT) với giao diện tin nhắn giữa User và AI.

#### [NEW] `src/components/KitchenTimeline.tsx`
- Dùng cho trang chi tiết món ăn để hiển thị các bước nấu ăn dạng timeline.

### 4. Pages
#### [NEW] `src/app/page.tsx` (Trang chủ)
- Chứa `HeroForm` ở đầu.
- Gợi ý một số `FoodCard` tiêu biểu.
- Hiển thị `ChatWidget` toàn cục.

#### [NEW] `src/app/food/[id]/page.tsx` (Trang chi tiết món ăn)
- Banner hình ảnh món ăn.
- Phần thông tin: Tổng quan (calo, macros).
- Danh sách nguyên liệu.
- Các bước nấu ăn (`KitchenTimeline`).
- Mẹo nhà bếp.

#### [NEW] `src/app/plan/page.tsx` (Trang kế hoạch ăn uống)
- Hiển thị `MealCalendar`.

## Kế Hoạch Xác Minh (Verification Plan)
### Chạy thử cục bộ
- Chạy `npm run dev`.
- Kiểm tra trực quan nghiệm các component trên trình duyệt (đảm bảo responsive trên Mobile và Desktop).
- Tương tác với form, xem hover effect trên Food Card, mở/đóng Chat Widget.
