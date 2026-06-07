package com.example.backend.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AiSuggestionService {

    private final RedisChatMemoryService chatMemoryService;
    private final RestTemplate restTemplate;

    @Value("${ai.api.key:}")
    private String apiKey;

    @Value("${ai.api.url:}")
    private String apiUrl;

    private static final String SYSTEM_PROMPT = """
            Bạn là một chuyên gia dinh dưỡng và đầu bếp chuyên nghiệp hàng đầu Việt Nam.
            Nhiệm vụ của bạn:
            - Tư vấn chế độ ăn uống lành mạnh, cân bằng dinh dưỡng phù hợp với thể trạng và mục tiêu của người dùng.
            - Gợi ý các công thức nấu ăn ngon, dễ làm với nguyên liệu phổ biến tại Việt Nam.
            - Tính toán lượng calo, protein, carbs, fat cho từng món ăn khi được yêu cầu.
            - Lập kế hoạch bữa ăn hàng ngày/tuần nếu người dùng cần.
            - Trả lời bằng tiếng Việt, thân thiện, dễ hiểu.
            - Luôn dựa vào ngữ cảnh cuộc trò chuyện trước đó để trả lời mạch lạc và liên tục.
            
            Lưu ý quan trọng:
            - Không đưa ra lời khuyên y tế. Nếu người dùng hỏi về bệnh lý, hãy khuyên họ đến gặp bác sĩ.
            - Ưu tiên thực phẩm tươi, tự nhiên, hạn chế thực phẩm chế biến sẵn.
            """;

    public AiSuggestionService(RedisChatMemoryService chatMemoryService) {
        this.chatMemoryService = chatMemoryService;
        this.restTemplate = new RestTemplate();
    }

    /**
     * Xử lý tin nhắn từ User và trả về phản hồi AI.
     */
    public String getAiResponse(Long userId, String userMessage) {
        // Bước 1: Lấy lịch sử chat từ Redis/In-Memory
        String chatHistory = chatMemoryService.getChatHistory(userId);

        // Bước 2: Xây dựng prompt đầy đủ với context
        String fullPrompt = buildPromptWithContext(chatHistory, userMessage);

        // Bước 3: Gọi LLM API hoặc trả mock response
        String aiReply;
        if (apiKey != null && !apiKey.isEmpty() && apiUrl != null && !apiUrl.isEmpty()) {
            aiReply = callLlmApi(fullPrompt, userMessage);
        } else {
            aiReply = generateMockResponse(userMessage);
        }

        // Bước 4: Lưu cả tin nhắn User và AI vào lịch sử
        chatMemoryService.saveMessage(userId, "user", userMessage);
        chatMemoryService.saveMessage(userId, "assistant", aiReply);

        // Bước 5: Trả về phản hồi
        return aiReply;
    }

    /**
     * Xây dựng prompt kèm ngữ cảnh lịch sử chat.
     */
    private String buildPromptWithContext(String chatHistory, String userMessage) {
        StringBuilder sb = new StringBuilder();
        sb.append(SYSTEM_PROMPT).append("\n\n");

        if (!chatHistory.isEmpty()) {
            sb.append("=== LỊCH SỬ CUỘC TRÒ CHUYỆN ===\n");
            sb.append(chatHistory);
            sb.append("\n=================================\n\n");
        }

        sb.append("Tin nhắn mới từ người dùng: ").append(userMessage);
        return sb.toString();
    }

    /**
     * Gọi LLM API thực tế (OpenAI / Gemini).
     * Cấu trúc request theo chuẩn OpenAI Chat Completions API.
     * Khi dùng Gemini, chỉ cần thay đổi ai.api.url trong application.yml.
     */
    private String callLlmApi(String systemPrompt, String userMessage) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> requestBody = Map.of(
                    "model", "gpt-4o-mini",
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userMessage)
                    ),
                    "temperature", 0.7,
                    "max_tokens", 1024
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(apiUrl, entity, Map.class);

            if (response != null && response.containsKey("choices")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return (String) message.get("content");
                }
            }
            return "Xin lỗi, tôi không thể xử lý yêu cầu này lúc này. Vui lòng thử lại sau.";
        } catch (Exception e) {
            System.out.println("⚠️ Lỗi khi gọi LLM API: " + e.getMessage());
            return generateMockResponse(userMessage);
        }
    }

    /**
     * Mock response khi chưa cấu hình API Key.
     * Trả về câu trả lời mẫu dựa trên từ khóa trong câu hỏi.
     */
    private String generateMockResponse(String userMessage) {
        String lower = userMessage.toLowerCase();

        if (lower.contains("giảm cân") || lower.contains("giảm béo")) {
            return "🥗 Để giảm cân hiệu quả, bạn nên:\n\n"
                    + "1. **Tạo thâm hụt calo**: Ăn ít hơn 300-500 kcal so với TDEE hàng ngày.\n"
                    + "2. **Tăng protein**: Ăn 1.6-2g protein/kg cân nặng để giữ cơ (ức gà, cá, trứng, đậu phụ).\n"
                    + "3. **Ăn nhiều rau xanh**: Rau cải, bông cải xanh, rau muống giúp no lâu với ít calo.\n"
                    + "4. **Hạn chế tinh bột trắng**: Thay cơm trắng bằng gạo lứt, khoai lang.\n"
                    + "5. **Uống đủ 2-3 lít nước/ngày**.\n\n"
                    + "Bạn muốn tôi lập thực đơn giảm cân chi tiết cho 1 tuần không?";
        }

        if (lower.contains("tăng cơ") || lower.contains("tăng cân")) {
            return "💪 Để tăng cơ hiệu quả, bạn cần:\n\n"
                    + "1. **Thặng dư calo**: Ăn thêm 300-500 kcal/ngày so với mức duy trì.\n"
                    + "2. **Protein cao**: 2-2.5g protein/kg cân nặng (thịt bò, ức gà, whey protein).\n"
                    + "3. **Carbs phức hợp**: Gạo lứt, yến mạch, khoai lang để cung cấp năng lượng tập luyện.\n"
                    + "4. **Chất béo tốt**: Bơ, dầu olive, các loại hạt.\n"
                    + "5. **Ăn 4-5 bữa/ngày**, chia đều protein.\n\n"
                    + "Bạn nặng bao nhiêu kg? Tôi sẽ tính lượng macro cụ thể cho bạn!";
        }

        if (lower.contains("phở") || lower.contains("bún") || lower.contains("món ăn") || lower.contains("nấu")) {
            return "🍜 Tôi rất vui được giúp bạn nấu ăn!\n\n"
                    + "**Phở Bò Tái tại nhà** (1 phần ~ 450 kcal):\n\n"
                    + "🛒 **Nguyên liệu**: Bánh phở 150g, thịt bò tái 100g, hành tây, gừng, quế, hồi, nước dùng xương.\n\n"
                    + "👨‍🍳 **Cách nấu**:\n"
                    + "1. Ninh xương bò 3-4 tiếng với gừng nướng, hành nướng, quế, hồi.\n"
                    + "2. Lọc nước dùng, nêm nước mắm, đường phèn, muối.\n"
                    + "3. Trụng bánh phở qua nước sôi, xếp vào tô.\n"
                    + "4. Xếp thịt bò tái lên trên, chan nước dùng sôi.\n"
                    + "5. Ăn kèm rau thơm, giá đỗ, chanh, ớt.\n\n"
                    + "Bạn muốn biết thêm món nào khác không?";
        }

        if (lower.contains("calo") || lower.contains("calories") || lower.contains("kcal")) {
            return "📊 Để tính lượng calo cần thiết, tôi cần biết thêm:\n\n"
                    + "1. **Giới tính** của bạn?\n"
                    + "2. **Tuổi** bao nhiêu?\n"
                    + "3. **Chiều cao** (cm) và **cân nặng** (kg)?\n"
                    + "4. **Mức độ vận động**: ít, vừa, hay nhiều?\n"
                    + "5. **Mục tiêu**: giảm cân, duy trì, hay tăng cân?\n\n"
                    + "Khi có đủ thông tin, tôi sẽ tính TDEE và đề xuất lượng calo phù hợp cho bạn!";
        }

        return "👋 Xin chào! Tôi là trợ lý dinh dưỡng AI của bạn.\n\n"
                + "Tôi có thể giúp bạn:\n"
                + "- 🥗 Tư vấn chế độ ăn (giảm cân, tăng cơ, ăn healthy)\n"
                + "- 🍳 Gợi ý công thức nấu ăn Việt Nam\n"
                + "- 📊 Tính calo và dinh dưỡng cho từng bữa ăn\n"
                + "- 📋 Lập kế hoạch bữa ăn hàng tuần\n\n"
                + "Hãy cho tôi biết bạn cần hỗ trợ gì nhé!";
    }
}
