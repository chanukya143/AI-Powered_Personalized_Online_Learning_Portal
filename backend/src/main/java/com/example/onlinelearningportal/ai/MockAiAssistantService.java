package com.example.onlinelearningportal.ai;

import com.example.onlinelearningportal.dto.AiChatRequest;
import com.example.onlinelearningportal.dto.AiChatResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MockAiAssistantService implements AiAssistantService {

    @Override
    public AiChatResponse processChat(AiChatRequest request, Long userId) {
        String msg = request.getMessage().toLowerCase();
        String mode = request.getMode() != null ? request.getMode().toLowerCase() : "general";
        String currentCourse = request.getCurrentCourseTitle() != null ? request.getCurrentCourseTitle() : "General Computer Science";

        StringBuilder reply = new StringBuilder();
        List<String> followups = new ArrayList<>();

        if ("practice_questions".equals(mode) || msg.contains("practice") || msg.contains("quiz") || msg.contains("question")) {
            reply.append("### 🧠 Practice Challenge: ").append(currentCourse).append("\n\n")
                 .append("Here is a targeted self-assessment challenge to test your grasp of the material:\n\n")
                 .append("**Question 1:** In modern web architectures, why is separating stateless authentication (e.g. JWT) from stateful persistence beneficial for horizontal scalability?\n")
                 .append("*A) It eliminates database queries completely*\n")
                 .append("*B) Any application node can verify the token without shared server session memory*\n")
                 .append("*C) It automatically encrypts all database tables*\n")
                 .append("*D) It increases HTTP request latency*\n\n")
                 .append("**Hint:** Think about what happens when you deploy behind an AWS or Render load balancer with 5 worker nodes.\n\n")
                 .append("**Question 2:** Explain the difference between compile-time dependency injection and runtime bean resolution in Spring.\n");

            followups.add("Show me the answer and explanation for Question 1");
            followups.add("Give me a coding exercise instead");
            followups.add("How do I prepare for technical interviews on this topic?");
        } else if ("roadmap".equals(mode) || msg.contains("roadmap") || msg.contains("path") || msg.contains("career")) {
            reply.append("### 🗺️ Tailored Learning Roadmap: Full-Stack Developer\n\n")
                 .append("Based on your current learning journey in **").append(currentCourse).append("**, here is your recommended progression:\n\n")
                 .append("1. **Core Foundations (Weeks 1-2):** Object-oriented principles, memory model, and clean code hygiene.\n")
                 .append("2. **API & Persistence (Weeks 3-4):** Spring Boot, JPA entities, database relationships, Flyway migrations, and transaction management.\n")
                 .append("3. **Modern Frontend Integration (Weeks 5-6):** React 18, TypeScript types, centralized Axios clients, and custom Neumorphic UI tokens.\n")
                 .append("4. **Cloud & Production (Weeks 7-8):** Docker containerization, CI/CD pipeline, and managed deployment on Render and Vercel.\n");

            followups.add("What courses should I enroll in next?");
            followups.add("How do I build portfolio-ready full-stack projects?");
        } else if (msg.contains("polymorphism") || msg.contains("oop")) {
            reply.append("### 🧩 Understanding Polymorphism\n\n")
                 .append("**Polymorphism** (meaning 'many forms') allows objects of different classes to be treated through a common interface.\n\n")
                 .append("- **Compile-time (Static) Polymorphism:** Method overloading (same method name, different parameter types or counts).\n")
                 .append("- **Runtime (Dynamic) Polymorphism:** Method overriding via inheritance and interfaces, where the JVM determines the exact method implementation to invoke at runtime.\n\n")
                 .append("```java\n")
                 .append("// Example: Polymorphic Interface\n")
                 .append("public interface PaymentProcessor {\n")
                 .append("    void process(double amount);\n")
                 .append("}\n")
                 .append("```\n");

            followups.add("How does Spring's IoC container utilize polymorphism?");
            followups.add("Give me an example in TypeScript");
        } else if (msg.contains("jwt") || msg.contains("token") || msg.contains("auth")) {
            reply.append("### 🔐 JWT Authentication Breakdown\n\n")
                 .append("A **JSON Web Token (JWT)** contains three base64-encoded segments separated by dots: `Header.Payload.Signature`.\n\n")
                 .append("1. **Header:** Contains token type and cryptographic algorithm (e.g., HS256).\n")
                 .append("2. **Payload:** Claims such as user ID, role, and expiration timestamp.\n")
                 .append("3. **Signature:** Verifies that the sender is who it claims to be and ensures the message wasn't changed along the way.\n\n")
                 .append("In our portal, the backend signs the JWT using a secure HMAC key, and the React client attaches it as `Authorization: Bearer <token>`.\n");

            followups.add("Why should refresh tokens have shorter/longer lifespans?");
            followups.add("How do we handle token expiry gracefully in Axios?");
        } else {
            reply.append("### 💡 AI Assistant Guide: ").append(request.getMessage()).append("\n\n")
                 .append("Here is an overview regarding your question in the context of **").append(currentCourse).append("**:\n\n")
                 .append("When studying complex engineering topics, break the problem down into three core stages:\n")
                 .append("1. **Mental Model:** Understand what data flows in, what transformation occurs, and what output is produced.\n")
                 .append("2. **Hands-on Experimentation:** Inspect the live code and test boundary conditions.\n")
                 .append("3. **Verification:** Take the course quiz to validate your understanding without looking at answers.\n\n")
                 .append("*Ask me any specific concept, code snippet, or quiz question you'd like to dive deeper into!*");

            followups.add("Explain this lesson's key points in 3 bullets");
            followups.add("Generate 3 quiz practice questions");
            followups.add("What is the real-world application of this concept?");
        }

        return new AiChatResponse(
                reply.toString(),
                followups,
                true, // demoMode flag explicitly true in local mock
                "Local Mock Assistant Engine (Demo Mode)"
        );
    }
}
