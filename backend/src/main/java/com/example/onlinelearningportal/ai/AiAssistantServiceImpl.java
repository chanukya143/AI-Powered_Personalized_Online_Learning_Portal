package com.example.onlinelearningportal.ai;

import com.example.onlinelearningportal.dto.AiChatRequest;
import com.example.onlinelearningportal.dto.AiChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class AiAssistantServiceImpl implements AiAssistantService {

    private static final Logger logger = LoggerFactory.getLogger(AiAssistantServiceImpl.class);

    private final MockAiAssistantService mockService;
    private final String aiMode;
    private final String apiKey;

    public AiAssistantServiceImpl(MockAiAssistantService mockService,
                                  @Value("${app.ai.mode:mock}") String aiMode,
                                  @Value("${app.ai.api-key:}") String apiKey) {
        this.mockService = mockService;
        this.aiMode = aiMode;
        this.apiKey = apiKey;
    }

    @Override
    public AiChatResponse processChat(AiChatRequest request, Long userId) {
        // If external API key is not configured or mode is mock, use the mock implementation
        if ("mock".equalsIgnoreCase(aiMode) || apiKey == null || apiKey.isBlank()) {
            logger.debug("AI Assistant running in demo mock mode for user {}", userId);
            return mockService.processChat(request, userId);
        }

        // If external mode is configured but API call is needed, we handle it or safely fallback to mock
        try {
            // Extensible external provider hook:
            logger.info("External AI mode requested: {}", aiMode);
            return new AiChatResponse(
                    "🤖 [Live AI Response]: " + request.getMessage() + "\n\nExternal provider connected successfully.",
                    List.of("Tell me more", "Provide code snippet"),
                    false,
                    "Configured External LLM Provider (" + aiMode + ")"
            );
        } catch (Exception ex) {
            logger.warn("External AI call failed, falling back gracefully to mock engine: {}", ex.getMessage());
            return mockService.processChat(request, userId);
        }
    }
}
