# Advanced Features - Hoàn Thành

Tôi đã xây dựng thành công 2 tính năng nâng cao mà bạn yêu cầu: **AI Chat Interface** với khả năng render Card trực tiếp và **Meal Plan Calendar** dạng ma trận (7 ngày x 4 bữa).

## 1. Meal Plan Matrix (Lịch Ăn Uống Nâng Cao)
- **Cấu trúc**: Lưới (Grid) đa chiều với các cột là `Thứ 2` -> `Chủ Nhật` và các hàng là `Sáng`, `Trưa`, `Tối`, `Snack`.
- **UI Card (Ô lịch)**: Nếu một bữa có món ăn, hệ thống sẽ render một card nhỏ gồm ảnh Thumbnail món ăn, Tên món, Calo. Ngược lại sẽ là một ô trống (Rest Day/Add Meal).
- **Hành động**: Khi hover vào một món ăn trong lịch, giao diện mờ đi (glassmorphism) và hiện lên 2 nút:
  - **Mắt (Eye)**: Chuyển hướng đến trang chi tiết món ăn (Route `/food/[id]`).
  - **Thùng rác (Trash)**: Placeholder để sau này bạn gắn API xóa món khỏi lịch.
- **Mock Data**: Đã setup trong `src/services/mealPlanService.ts` để giả lập dữ liệu lịch phân bổ cho các ngày trong tuần.

## 2. Trang AI Chat Hiện Đại (`/chat`)
- **Tách riêng Route**: Chat widget cũ đã được gỡ bỏ khỏi Layout. Bạn có thể truy cập `/chat` thông qua Navigation Bar để vào trang chat toàn màn hình chuyên biệt (tương tự ChatGPT).
- **Luồng Chat (Message Parsing)**:
  - Tin nhắn của bạn sẽ nằm bên phải (Xanh), tin nhắn của AI nằm bên trái (Trắng).
  - Khi bạn nhập tin nhắn (ví dụ: *"I want a high protein vegan meal"*), AI sẽ phân tích và trả về một luồng dữ liệu giả lập chứa cả Text thuần và Object JSON món ăn.
  - **Render Card**: Giao diện Chat đã được lập trình để nhận diện các Node dạng `food_recommendation`. Nếu có, nó sẽ inject Component `<FoodCard />` kích thước chuẩn thẳng vào luồng chat, tạo trải nghiệm thị giác vô cùng hiện đại và sinh động thay vì chỉ text thông thường.

## Trải nghiệm thực tế
Vui lòng chạy lại môi trường dev:
```bash
npm run dev
```

1. Mở [http://localhost:3000/plan](http://localhost:3000/plan) để xem Ma trận lịch ăn uống. Hãy thử Hover vào các món ăn.
2. Mở [http://localhost:3000/chat](http://localhost:3000/chat) và nhập từ khóa *"salmon"*, *"salad"* hoặc *"vegan"*, sau đó gửi và quan sát cách AI trả về một Card đồ họa tuyệt đẹp ngay trong khung chat nhé!
