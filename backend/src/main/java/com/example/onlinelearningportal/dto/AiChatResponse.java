package com.example.onlinelearningportal.dto;

import java.time.Instant;
import java.util.List;

public class AiChatResponse {

    private String reply;
    private List<String> suggestedFollowups;
    private boolean demoMode;
    private String provider;
    private Instant timestamp;

    public AiChatResponse() {
        this.timestamp = Instant.now();
    }

    public AiChatResponse(String reply, List<String> suggestedFollowups, boolean demoMode, String provider) {
        this.reply = reply;
        this.suggestedFollowups = suggestedFollowups;
        this.demoMode = demoMode;
        this.provider = provider;
        this.timestamp = Instant.now();
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<String> getSuggestedFollowups() {
        return suggestedFollowups;
    }

    public void setSuggestedFollowups(List<String> suggestedFollowups) {
        this.suggestedFollowups = suggestedFollowups;
    }

    public boolean isDemoMode() {
        return demoMode;
    }

    public void setDemoMode(boolean demoMode) {
        this.demoMode = demoMode;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
