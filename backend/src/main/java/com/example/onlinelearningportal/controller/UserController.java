package com.example.onlinelearningportal.controller;

import com.example.onlinelearningportal.dto.UpdateProfileRequest;
import com.example.onlinelearningportal.dto.UserDto;
import com.example.onlinelearningportal.security.UserPrincipal;
import com.example.onlinelearningportal.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Endpoints for managing user accounts and learning profiles")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    @Operation(summary = "Update current user profile and learning interests")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                @Valid @RequestBody UpdateProfileRequest request) {
        UserDto updated = userService.updateProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(updated);
    }
}
