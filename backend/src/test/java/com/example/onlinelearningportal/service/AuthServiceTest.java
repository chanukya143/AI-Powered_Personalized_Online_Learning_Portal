package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.AuthResponse;
import com.example.onlinelearningportal.dto.LoginRequest;
import com.example.onlinelearningportal.dto.RegisterRequest;
import com.example.onlinelearningportal.entity.RefreshToken;
import com.example.onlinelearningportal.entity.Role;
import com.example.onlinelearningportal.entity.User;
import com.example.onlinelearningportal.exception.BadRequestException;
import com.example.onlinelearningportal.exception.DuplicateResourceException;
import com.example.onlinelearningportal.repository.RefreshTokenRepository;
import com.example.onlinelearningportal.repository.UserRepository;
import com.example.onlinelearningportal.security.JwtTokenProvider;
import com.example.onlinelearningportal.security.RateLimitService;
import com.example.onlinelearningportal.security.UserPrincipal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private RateLimitService rateLimitService;

    private JwtTokenProvider tokenProvider;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(
                "c3VwZXJzZWNyZXRqd3RleGFtcGxlZm9yZGV2ZWxvcG1lbnRwdXJwb3Nlc29ubHltaW4zMmJ5dGVzISE=",
                900000L
        );
        authService = new AuthService(
                userRepository,
                refreshTokenRepository,
                passwordEncoder,
                authenticationManager,
                tokenProvider,
                rateLimitService,
                900000L,
                604800000L
        );
    }

    @Test
    @DisplayName("Should successfully register a new student with BCrypt hashed password")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest(
                "Jane Doe",
                "jane@example.com",
                "Secret123!",
                "Secret123!",
                "Java, React"
        );

        when(userRepository.existsByEmail("jane@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Secret123!")).thenReturn("$2a$12$hashedPassword");

        User savedUser = new User("jane@example.com", "$2a$12$hashedPassword", "Jane Doe", Role.STUDENT, "Java, React");
        savedUser.setId(10L);

        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArguments()[0]);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertFalse(response.getAccessToken().isBlank());
        assertEquals("jane@example.com", response.getUser().getEmail());
        assertEquals(Role.STUDENT, response.getUser().getRole());
        verify(passwordEncoder).encode("Secret123!");
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration when email already exists")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest(
                "Jane Doe",
                "existing@example.com",
                "Secret123!",
                "Secret123!",
                "Java"
        );

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration when passwords do not match")
    void testRegisterPasswordMismatch() {
        RegisterRequest request = new RegisterRequest(
                "Jane Doe",
                "jane@example.com",
                "Secret123!",
                "DifferentPassword!",
                "Java"
        );

        assertThrows(BadRequestException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should authenticate valid credentials and issue tokens")
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest("jane@example.com", "Secret123!");

        when(rateLimitService.isBlocked("jane@example.com")).thenReturn(false);

        User user = new User("jane@example.com", "$2a$12$hashed", "Jane Doe", Role.STUDENT, "Java");
        user.setId(5L);

        Authentication auth = mock(Authentication.class);
        when(auth.getPrincipal()).thenReturn(UserPrincipal.create(user));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);

        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenAnswer(i -> i.getArguments()[0]);

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertNotNull(response.getAccessToken());
        assertFalse(response.getAccessToken().isBlank());
        assertEquals("jane@example.com", response.getUser().getEmail());
        verify(rateLimitService).loginSucceeded("jane@example.com");
    }

    @Test
    @DisplayName("Should fail authentication and record failed attempt on invalid credentials")
    void testLoginInvalidCredentials() {
        LoginRequest request = new LoginRequest("jane@example.com", "WrongPassword!");

        when(rateLimitService.isBlocked("jane@example.com")).thenReturn(false);
        when(authenticationManager.authenticate(any())).thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));
        verify(rateLimitService).loginFailed("jane@example.com");
    }
}
