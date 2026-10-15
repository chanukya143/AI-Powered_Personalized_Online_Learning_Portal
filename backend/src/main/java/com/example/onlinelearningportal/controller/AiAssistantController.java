package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.ai.AiAssistantService;
import com.example.onlinelearningportal.dto.AiChatRequest;
import com.example.onlinelearningportal.dto.AiChatResponse;
import com.example.onlinelearningportal.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Learning Assistant", description = "Endpoints for intelligent educational tutoring, practice questions, and roadmaps")
public class AiAssistantController {

    private final AiAssistantService aiAssistantService;

    public AiAssistantController(AiAssistantService aiAssistantService) {
        this.aiAssistantService = aiAssistantService;
    }

    @PostMapping("/assistant")
    @Operation(summary = "Interact with the AI Learning Assistant for concept explanation or practice")
    public ResponseEntity<AiChatResponse> chatWithAssistant(
            @Valid @RequestBody AiChatRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        AiChatResponse response = aiAssistantService.processChat(request, userId);
        return ResponseEntity.ok(response);
    }
}
