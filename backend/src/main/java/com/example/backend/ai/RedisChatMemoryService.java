package com.example.backend.ai;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RedisChatMemoryService {

    private final StringRedisTemplate redisTemplate;
    private final boolean redisAvailable;

    // Fallback in-memory store khi Redis không khả dụng
    private final ConcurrentHashMap<String, List<String>> inMemoryStore = new ConcurrentHashMap<>();

    private static final String KEY_PREFIX = "chat:history:";
    private static final int MAX_HISTORY_SIZE = 10;
    private static final Duration TTL = Duration.ofHours(24);

    public RedisChatMemoryService(
            org.springframework.beans.factory.ObjectProvider<StringRedisTemplate> redisTemplateProvider) {
        StringRedisTemplate template = redisTemplateProvider.getIfAvailable();
        boolean available = false;
        if (template != null) {
            try {
                template.getConnectionFactory().getConnection().ping();
                available = true;
                System.out.println("✅ RedisChatMemoryService: Redis kết nối thành công.");
            } catch (Exception e) {
                System.out.println("⚠️ RedisChatMemoryService: Redis không khả dụng. Sử dụng In-Memory store.");
            }
        }
        this.redisTemplate = template;
        this.redisAvailable = available;
    }

    /**
     * Lưu tin nhắn vào lịch sử chat.
     * Format: "role: content" (ví dụ: "user: Tôi muốn giảm cân")
     */
    public void saveMessage(Long userId, String role, String content) {
        String key = KEY_PREFIX + userId;
        String message = role + ": " + content;

        if (redisAvailable && redisTemplate != null) {
            redisTemplate.opsForList().rightPush(key, message);
            // Giữ tối đa MAX_HISTORY_SIZE tin nhắn gần nhất
            redisTemplate.opsForList().trim(key, -MAX_HISTORY_SIZE, -1);
            // Đặt TTL 24 giờ
            redisTemplate.expire(key, TTL);
        } else {
            // Fallback: lưu vào bộ nhớ
            inMemoryStore.computeIfAbsent(key, k -> Collections.synchronizedList(new ArrayList<>()));
            List<String> history = inMemoryStore.get(key);
            history.add(message);
            // Giữ tối đa MAX_HISTORY_SIZE
            while (history.size() > MAX_HISTORY_SIZE) {
                history.remove(0);
            }
        }
    }

    /**
     * Lấy lịch sử chat gần nhất (tối đa 10 tin nhắn) dưới dạng chuỗi văn bản.
     */
    public String getChatHistory(Long userId) {
        String key = KEY_PREFIX + userId;
        List<String> messages;

        if (redisAvailable && redisTemplate != null) {
            messages = redisTemplate.opsForList().range(key, 0, -1);
        } else {
            messages = inMemoryStore.getOrDefault(key, new ArrayList<>());
        }

        if (messages == null || messages.isEmpty()) {
            return "";
        }

        return String.join("\n", messages);
    }
}
