package com.example.onlinelearningportal.security;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {

    private static final int MAX_ATTEMPTS = 10;
    private static final long LOCKOUT_DURATION_MS = 60_000; // 1 minute lockout

    private final Map<String, AttemptTracker> attemptsMap = new ConcurrentHashMap<>();

    public boolean isBlocked(String key) {
        AttemptTracker tracker = attemptsMap.get(key);
        if (tracker == null) {
            return false;
        }

        if (Instant.now().toEpochMilli() - tracker.lastAttemptTime > LOCKOUT_DURATION_MS) {
            attemptsMap.remove(key);
            return false;
        }

        return tracker.attempts >= MAX_ATTEMPTS;
    }

    public void loginFailed(String key) {
        attemptsMap.compute(key, (k, tracker) -> {
            long now = Instant.now().toEpochMilli();
            if (tracker == null || now - tracker.lastAttemptTime > LOCKOUT_DURATION_MS) {
                return new AttemptTracker(1, now);
            }
            return new AttemptTracker(tracker.attempts + 1, now);
        });
    }

    public void loginSucceeded(String key) {
        attemptsMap.remove(key);
    }

    private static class AttemptTracker {
        final int attempts;
        final long lastAttemptTime;

        AttemptTracker(int attempts, long lastAttemptTime) {
            this.attempts = attempts;
            this.lastAttemptTime = lastAttemptTime;
        }
    }
}
