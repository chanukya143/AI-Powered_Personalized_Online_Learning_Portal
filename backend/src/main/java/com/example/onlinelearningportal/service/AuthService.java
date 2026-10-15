package com.example.onlinelearningportal.service;

import com.example.onlinelearningportal.dto.*;
import com.example.onlinelearningportal.entity.RefreshToken;
import com.example.onlinelearningportal.entity.Role;
import com.example.onlinelearningportal.entity.User;
import com.example.onlinelearningportal.exception.BadRequestException;
import com.example.onlinelearningportal.exception.DuplicateResourceException;
import com.example.onlinelearningportal.exception.ResourceNotFoundException;
import com.example.onlinelearningportal.exception.UnauthorizedException;
import com.example.onlinelearningportal.repository.RefreshTokenRepository;
import com.example.onlinelearningportal.repository.UserRepository;
import com.example.onlinelearningportal.security.JwtTokenProvider;
import com.example.onlinelearningportal.security.RateLimitService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final RateLimitService rateLimitService;
    private final long jwtExpirationMs;
    private final long jwtRefreshExpirationMs;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       RateLimitService rateLimitService,
                       @Value("${app.jwt.expiration-ms:900000}") long jwtExpirationMs,
                       @Value("${app.jwt.refresh-expiration-ms:604800000}") long jwtRefreshExpirationMs) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.rateLimitService = rateLimitService;
        this.jwtExpirationMs = jwtExpirationMs;
        this.jwtRefreshExpirationMs = jwtRefreshExpirationMs;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }

        User user = new User(
                request.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                Role.STUDENT, // Registration is always assigned the STUDENT role
                request.getLearningInterests() != null ? request.getLearningInterests().trim() : ""
        );

        User savedUser = userRepository.save(user);

        String accessToken = tokenProvider.generateTokenFromUser(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name()
        );

        RefreshToken refreshToken = createRefreshToken(savedUser);

        return new AuthResponse(
                accessToken,
                refreshToken.getToken(),
                jwtExpirationMs,
                UserDto.fromEntity(savedUser)
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (rateLimitService.isBlocked(email)) {
            throw new BadRequestException("Too many failed login attempts. Please wait a minute and try again.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.getPassword())
            );

            rateLimitService.loginSucceeded(email);

            String accessToken = tokenProvider.generateToken(authentication);

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

            RefreshToken refreshToken = createRefreshToken(user);

            return new AuthResponse(
                    accessToken,
                    refreshToken.getToken(),
                    jwtExpirationMs,
                    UserDto.fromEntity(user)
            );
        } catch (Exception ex) {
            rateLimitService.loginFailed(email);
            throw ex;
        }
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        if (refreshToken.isRevoked() || refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new UnauthorizedException("Refresh token is expired or has been revoked");
        }

        User user = refreshToken.getUser();
        String newAccessToken = tokenProvider.generateTokenFromUser(
                user.getId(),
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                newAccessToken,
                refreshToken.getToken(),
                jwtExpirationMs,
                UserDto.fromEntity(user)
        );
    }

    @Transactional
    public void logout(Long userId) {
        if (userId != null) {
            userRepository.findById(userId).ifPresent(refreshTokenRepository::deleteByUser);
        }
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return UserDto.fromEntity(user);
    }

    private RefreshToken createRefreshToken(User user) {
        refreshTokenRepository.deleteByUser(user);
        refreshTokenRepository.flush();

        RefreshToken refreshToken = new RefreshToken(
                UUID.randomUUID().toString(),
                user,
                Instant.now().plusMillis(jwtRefreshExpirationMs)
        );
        return refreshTokenRepository.save(refreshToken);
    }
}
