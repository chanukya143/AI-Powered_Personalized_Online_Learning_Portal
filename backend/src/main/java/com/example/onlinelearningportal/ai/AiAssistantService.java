package com.example.onlinelearningportal.ai;

import com.example.onlinelearningportal.dto.AiChatRequest;
import com.example.onlinelearningportal.dto.AiChatResponse;

public interface AiAssistantService {
    AiChatResponse processChat(AiChatRequest request, Long userId);
}
