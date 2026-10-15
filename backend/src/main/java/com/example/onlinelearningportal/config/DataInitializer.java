package com.example.onlinelearningportal.config;

import com.example.onlinelearningportal.entity.*;
import com.example.onlinelearningportal.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@ConditionalOnProperty(name = "app.seed-data.enabled", havingValue = "true", matchIfMissing = false)
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DataInitializer(UserRepository userRepository,
                           CourseRepository courseRepository,
                           LessonRepository lessonRepository,
                           QuizRepository quizRepository,
                           QuestionRepository questionRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        try {
            seedUsers();
            seedCoursesAndContent();
        } catch (Exception ex) {
            logger.error("Error during sample data initialization: {}", ex.getMessage(), ex);
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@portal.com")) {
            User admin = new User(
                    "admin@portal.com",
                    passwordEncoder.encode("Admin123!"),
                    "System Administrator",
                    Role.ADMIN,
                    "Cloud Architecture, DevOps, Security"
            );
            userRepository.save(admin);
            logger.info("Dev seed: Default admin created (admin@portal.com / Admin123!)");
        }

        if (!userRepository.existsByEmail("student@portal.com")) {
            User student = new User(
                    "student@portal.com",
                    passwordEncoder.encode("Student123!"),
                    "Alex Chen",
                    Role.STUDENT,
                    "Java, Spring Boot, Microservices, React"
            );
            userRepository.save(student);
            logger.info("Dev seed: Default student created (student@portal.com / Student123!)");
        }
    }

    private void seedCoursesAndContent() throws Exception {
        if (courseRepository.count() > 0) {
            return; // Data already initialized
        }

        logger.info("Dev seed: Initializing curated educational sample courses and lessons...");

        // Course 1: Modern Java & Enterprise Spring Boot
        Course javaCourse = new Course(
                "Modern Java 21 & Enterprise Spring Boot 3",
                "Master high-performance backend architecture with virtual threads, Spring Security, REST APIs, and JPA.",
                "Comprehensive enterprise guide covering modern Java 21 features (pattern matching, records, virtual threads), building robust RESTful services with Spring Boot 3, secure stateless authentication via JWT, database migrations with Flyway, and production monitoring using Actuator.",
                "Backend Development",
                "Intermediate",
                "Dr. Sarah Jenkins",
                "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60",
                "12 Hours",
                true
        );
        Course savedJavaCourse = courseRepository.save(javaCourse);

        // Lessons for Course 1
        createLesson(savedJavaCourse, 1, "Java 21 Fundamentals & Virtual Threads",
                "Explore the evolution of Java, project Loom, and high-throughput concurrency models.",
                "### 1. Introduction to Modern Java 21\n\nJava 21 is a Long-Term Support (LTS) release that introduces generational ZGC, record patterns, sequenced collections, and virtual threads.\n\n#### Virtual Threads (Project Loom)\nUnlike OS platform threads which consume ~1MB of stack memory, virtual threads are lightweight threads managed directly by the JVM runtime.\n\n```java\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n    IntStream.range(0, 10_000).forEach(i -> {\n        executor.submit(() -> {\n            Thread.sleep(Duration.ofSeconds(1));\n            return i;\n        });\n    });\n}\n```\n\nThis dramatically simplifies writing high-throughput, concurrent network applications without complex reactive callbacks.",
                "https://www.youtube.com/watch?v=5E0L8i_wJbY", "35 Mins");

        createLesson(savedJavaCourse, 2, "Building REST APIs with Spring Boot 3 & Validation",
                "Construct robust controllers, structured exception handling, and Jakarta Bean Validation.",
                "### Building Production RESTful APIs\n\nIn this lesson, we structure enterprise endpoints using `@RestController`, request and response DTO records, and validation annotations.\n\n#### Best Practices\n- Never expose internal database entities directly to the client.\n- Use `@Valid` and `@NotNull`, `@Size`, `@Email` to safeguard boundary inputs.\n- Centralize error handling with `@RestControllerAdvice` to deliver predictable JSON payloads.",
                "https://www.youtube.com/watch?v=9SGDpanrc8U", "45 Mins");

        createLesson(savedJavaCourse, 3, "Stateless Authentication with Spring Security 6 & JWT",
                "Implement secure role-based access control, cryptographic HMAC signing, and request filtering.",
                "### Stateless Security Architecture\n\nSpring Security 6 enforces strict authorization rules using standard security filter chains.\n\n```java\n@Bean\npublic SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n    return http\n        .csrf(AbstractHttpConfigurer::disable)\n        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))\n        .authorizeHttpRequests(auth -> auth\n            .requestMatchers(\"/api/auth/**\").permitAll()\n            .requestMatchers(\"/api/admin/**\").hasRole(\"ADMIN\")\n            .anyRequest().authenticated()\n        )\n        .build();\n}\n```\n\nAlways store password hashes using BCrypt with an appropriate work factor (12+).",
                "", "50 Mins");

        // Quiz for Course 1
        Quiz javaQuiz = new Quiz(savedJavaCourse, "Java 21 & Spring Boot Mastery Assessment",
                "Evaluate your understanding of virtual threads, Spring Security stateless architecture, and REST API best practices.", 70);
        Quiz savedJavaQuiz = quizRepository.save(javaQuiz);

        createQuestion(savedJavaQuiz, 1,
                "What is the primary architectural advantage of Virtual Threads in Java 21?",
                List.of("They execute on GPU hardware", "They are lightweight JVM-managed threads allowing high concurrency with blocking I/O", "They bypass the JVM bytecode verifier", "They eliminate the need for garbage collection"),
                1,
                "Virtual threads allow tens of thousands of concurrent tasks with standard blocking code without exhausting operating system thread pools.");

        createQuestion(savedJavaQuiz, 2,
                "Which HTTP status code should be returned when a client submits invalid registration fields?",
                List.of("401 Unauthorized", "403 Forbidden", "400 Bad Request", "500 Internal Server Error"),
                2,
                "400 Bad Request is the standard HTTP status for client input validation failures.");

        createQuestion(savedJavaQuiz, 3,
                "Why should JPA entities not be returned directly from `@RestController` methods?",
                List.of("Entities cannot be converted to JSON", "Entities expose internal database schemas, cause circular references, and leak sensitive attributes", "Entities are always immutable", "JPA forbids JSON serialization"),
                1,
                "DTOs decouple API contracts from the relational database schema, preventing security leaks like password hashes and circular lazy-loading issues.");

        // Course 2: React 18 & Neumorphism Design Systems
        Course reactCourse = new Course(
                "Modern React 18 & Neumorphism UI Architecture",
                "Build state-of-the-art tactile web interfaces with React, TypeScript, and clean CSS design tokens.",
                "Learn component composition, tactile Neumorphic design principles with dual-shadow elevations, custom hooks, centralized Axios interceptors, responsive navigation drawers, and robust client validation using Zod.",
                "Frontend Development",
                "Beginner",
                "Marcus Vance",
                "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
                "8 Hours",
                true
        );
        Course savedReactCourse = courseRepository.save(reactCourse);

        createLesson(savedReactCourse, 1, "Neumorphism Design Tokens & Elevation Physics",
                "Understanding light angles, soft drop shadows, and inset highlights.",
                "### The Physics of Neumorphic Surfaces\n\nNeumorphism simulates physical elements extruding from or embedded into a unified background.\n\n```css\n:root {\n  --neo-bg: #E9EDF2;\n  --neo-shadow-dark: 8px 8px 18px rgba(163, 177, 198, 0.45);\n  --neo-shadow-light: -8px -8px 18px rgba(255, 255, 255, 0.85);\n  --neo-inset-dark: inset 4px 4px 8px rgba(163, 177, 198, 0.40);\n  --neo-inset-light: inset -4px -4px 8px rgba(255, 255, 255, 0.85);\n}\n```\n\nContrast and accessibility must always be preserved through strong typography and purposeful accent colors.",
                "", "30 Mins");

        createLesson(savedReactCourse, 2, "State Management & React Hook Form with Zod",
                "Build reactive, type-safe forms with real-time feedback and validation schemas.",
                "### Type-Safe Forms with Zod & React Hook Form\n\nPairing Zod with `@hookform/resolvers/zod` gives compile-time safety and automatic client validation error handling.\n\n```typescript\nexport const loginSchema = z.object({\n  email: z.string().email('Invalid email address'),\n  password: z.string().min(6, 'Password must be at least 6 characters')\n});\n```",
                "", "40 Mins");

        Quiz reactQuiz = new Quiz(savedReactCourse, "Frontend UI & React 18 Assessment",
                "Test your knowledge of React hooks, CSS shadow physics, and type-safe state management.", 70);
        Quiz savedReactQuiz = quizRepository.save(reactQuiz);

        createQuestion(savedReactQuiz, 1,
                "In Neumorphic CSS design, how is a raised card effect achieved?",
                List.of("Using a single harsh black shadow", "Using a combination of a light shadow on the top-left and a soft dark shadow on the bottom-right", "Using a heavy 10px solid black border", "Applying an inverted blur filter"),
                1,
                "The dual-shadow technique simulates a single directional light source reflecting off a tactile surface.");

        createQuestion(savedReactQuiz, 2,
                "What is the primary role of Zod when paired with React Hook Form?",
                List.of("It renders HTML input fields", "It manages Redux state stores", "It validates form data against a declared runtime schema and generates TypeScript types", "It communicates with the database"),
                2,
                "Zod provides schema declaration and validation with automatic TypeScript inference.");

        // Course 3: Cloud Architecture & DevOps (Microservices, Docker, CI/CD)
        Course cloudCourse = new Course(
                "Cloud-Native Architecture & Production DevOps",
                "Deploy resilient services on Render, Vercel, and Aiven with Docker and zero-downtime migrations.",
                "Master containerization of Java Spring Boot services with multi-stage Dockerfiles, managing production MySQL clusters on Aiven, automated database schema versioning with Flyway, and environment variable security.",
                "Cloud & DevOps",
                "Advanced",
                "Elena Rostova",
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
                "10 Hours",
                true
        );
        Course savedCloudCourse = courseRepository.save(cloudCourse);

        createLesson(savedCloudCourse, 1, "Multi-Stage Docker Builds for Spring Boot",
                "Optimize container image size and security using multi-stage OpenJDK layers.",
                "### Multi-Stage Dockerfile Strategy\n\nSeparate the Maven build environment from the minimal JRE runtime environment to produce secure, lightweight images (<200MB).\n\n```dockerfile\n# Stage 1: Build\nFROM maven:3.9-eclipse-temurin-21 AS build\nCOPY . .\nRUN mvn clean package -DskipTests\n\n# Stage 2: Runtime\nFROM eclipse-temurin:21-jre-alpine\nCOPY --from=build /target/*.jar app.jar\nENTRYPOINT [\"java\", \"-jar\", \"app.jar\"]\n```",
                "", "45 Mins");

        Quiz cloudQuiz = new Quiz(savedCloudCourse, "DevOps & Cloud Production Assessment",
                "Examine your skills in container optimization, cloud database connectivity, and CI/CD.", 70);
        Quiz savedCloudQuiz = quizRepository.save(cloudQuiz);

        createQuestion(savedCloudQuiz, 1,
                "Why are multi-stage Docker builds beneficial for Spring Boot production deployments?",
                List.of("They speed up the developer's CPU", "They keep build tools (Maven, JDK) out of the final runtime image, minimizing attack surface and image size", "They bypass OS security patches", "They allow running two databases in one container"),
                1,
                "Multi-stage builds separate the compile environment from the production runtime image, resulting in lean, secure containers.");

        logger.info("Dev seed: 3 comprehensive courses with lessons and quizzes successfully initialized.");
    }

    private void createLesson(Course course, int order, String title, String description,
                              String content, String videoUrl, String duration) {
        Lesson lesson = new Lesson(
                course,
                title,
                description,
                order,
                content,
                videoUrl,
                duration,
                true
        );
        lessonRepository.save(lesson);
    }

    private void createQuestion(Quiz quiz, int order, String text, List<String> options,
                                int correctIndex, String explanation) throws Exception {
        Question q = new Question(
                quiz,
                text,
                objectMapper.writeValueAsString(options),
                correctIndex,
                explanation,
                order
        );
        questionRepository.save(q);
    }
}
