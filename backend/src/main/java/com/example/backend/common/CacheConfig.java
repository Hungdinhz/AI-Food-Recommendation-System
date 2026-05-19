package com.example.backend.common;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import java.time.Duration;

@Configuration
public class CacheConfig {

    /**
     * Cấu hình CacheManager với chiến lược:
     * - Ưu tiên Redis nếu kết nối thành công.
     * - Tự động fallback sang In-Memory Cache nếu Redis không khả dụng.
     */
    @Bean
    @Primary
    public CacheManager cacheManager(
            org.springframework.beans.factory.ObjectProvider<RedisConnectionFactory> redisConnectionFactoryProvider) {
        RedisConnectionFactory redisConnectionFactory = redisConnectionFactoryProvider.getIfAvailable();

        if (redisConnectionFactory != null) {
            try {
                // Kiểm tra kết nối Redis
                redisConnectionFactory.getConnection().ping();

                // Nếu Redis khả dụng, sử dụng RedisCacheManager
                RedisCacheConfiguration cacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(Duration.ofHours(1)) // Cache tồn tại 1 giờ
                        .disableCachingNullValues();

                System.out.println("✅ Redis Cache đã kết nối thành công.");
                return RedisCacheManager.builder(redisConnectionFactory)
                        .cacheDefaults(cacheConfig)
                        .build();
            } catch (Exception e) {
                System.out.println("⚠️ Redis không khả dụng (" + e.getMessage() + "). Sử dụng In-Memory Cache.");
            }
        } else {
            System.out.println("⚠️ Không tìm thấy RedisConnectionFactory. Sử dụng In-Memory Cache.");
        }

        return new ConcurrentMapCacheManager("weeklyMealPlans");
    }
}
