# REST API Documentation

The **AI-Powered Personalized Online Learning Portal** exposes a RESTful API powered by Spring Boot 3.3.4.

* **Local Base URL**: `http://localhost:8080/api`
* **Production Base URL**: `https://<render-app-name>.onrender.com/api`
* **Interactive Swagger UI**: `http://localhost:8080/swagger-ui/index.html` (or `/swagger-ui.html`)
* **OpenAPI 3.0 JSON Spec**: `http://localhost:8080/v3/api-docs`

---

## 1. Authentication & Security

All protected endpoints require the HTTP Authorization header:
```http
Authorization: Bearer <access_token>
```

### 1.1 Register New Student
* **Endpoint**: `POST /api/auth/register`
* **Access**: Public
* **Request Body**:
```json
{
  "email": "student@example.com",
  "password": "StrongPassword123!",
  "fullName": "Jane Doe",
  "learningInterests": "Java, Spring Boot, Artificial Intelligence"
}
```
* **Response (201 Created)**:
```json
{
  "tokenType": "Bearer",
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "48b6f52e-5f4b-4ec9-8d72-b5eef9115d4d",
  "expiresInMs": 900000,
  "user": {
    "id": 2,
    "email": "student@example.com",
    "fullName": "Jane Doe",
    "role": "STUDENT",
    "learningInterests": "Java, Spring Boot, Artificial Intelligence"
  }
}
```

### 1.2 Login
* **Endpoint**: `POST /api/auth/login`
* **Access**: Public
* **Request Body**:
```json
{
  "email": "student@example.com",
  "password": "StrongPassword123!"
}
```
* **Response (200 OK)**: Same payload as Register.

### 1.3 Refresh Access Token
* **Endpoint**: `POST /api/auth/refresh`
* **Access**: Public
* **Request Body**:
```json
{
  "refreshToken": "48b6f52e-5f4b-4ec9-8d72-b5eef9115d4d"
}
```
* **Response (200 OK)**:
```json
{
  "tokenType": "Bearer",
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "48b6f52e-5f4b-4ec9-8d72-b5eef9115d4d",
  "expiresInMs": 900000,
  "user": { ... }
}
```

### 1.4 Logout
* **Endpoint**: `POST /api/auth/logout`
* **Access**: Authenticated (`STUDENT`, `ADMIN`)
* **Request Body**:
```json
{
  "refreshToken": "48b6f52e-5f4b-4ec9-8d72-b5eef9115d4d"
}
```
* **Response (200 OK)**:
```json
{
  "message": "Successfully logged out"
}
```

---

## 2. Course Catalog

### 2.1 List Published Courses
* **Endpoint**: `GET /api/courses`
* **Access**: Public
* **Query Parameters**:
  * `search` (optional string): Keyword to search title and description
  * `category` (optional string): Filter by category
  * `difficulty` (optional string): Filter by `Beginner`, `Intermediate`, `Advanced`
  * `page` (optional int, default `0`)
  * `size` (optional int, default `9`)
* **Response (200 OK)**:
```json
{
  "content": [
    {
      "id": 1,
      "title": "Mastering Modern Java 21 & Spring Boot 3",
      "shortDescription": "Learn virtual threads, records, pattern matching, and production APIs.",
      "category": "Backend Development",
      "difficultyLevel": "Intermediate",
      "instructorName": "Dr. Sarah Chen",
      "thumbnailUrl": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600",
      "estimatedDuration": "12 hours",
      "published": true,
      "lessonsCount": 4,
      "quizId": 1,
      "createdAt": "2026-10-15T10:00:00"
    }
  ],
  "page": 0,
  "size": 9,
  "totalElements": 6,
  "totalPages": 1,
  "last": true
}
```

### 2.2 Get Course Details
* **Endpoint**: `GET /api/courses/{id}`
* **Access**: Public (enrolled/progress fields populated if Bearer token present)
* **Response (200 OK)**: Includes course metadata plus `lessons` array and current student `enrolled` status.

---

## 3. Quizzes & Server-Side Evaluation

### 3.1 Get Quiz for Student
* **Endpoint**: `GET /api/quizzes/{id}`
* **Access**: Authenticated (`STUDENT`, `ADMIN`)
* **Note**: Answers (`correctAnswerIndex` and `explanation`) are **never** returned before submission.
* **Response (200 OK)**:
```json
{
  "id": 1,
  "courseId": 1,
  "courseTitle": "Mastering Modern Java 21 & Spring Boot 3",
  "title": "Java 21 Core Knowledge Assessment",
  "description": "Test your grasp on Virtual Threads, Records, and Spring 3.3.",
  "passingScore": 75,
  "questions": [
    {
      "id": 1,
      "questionText": "What key benefit do Java 21 Virtual Threads provide?",
      "options": [
        "Faster single-core clock cycles",
        "Lightweight concurrency managed by the JVM",
        "Automatic database indexing",
        "Hardware-level GPU acceleration"
      ],
      "questionOrder": 1
    }
  ]
}
```

### 3.2 Submit Quiz
* **Endpoint**: `POST /api/quizzes/{id}/submit`
* **Access**: Authenticated (`STUDENT`, `ADMIN`)
* **Request Body**:
```json
{
  "answers": [
    {
      "questionId": 1,
      "selectedOptionIndex": 1
    }
  ]
}
```
* **Response (200 OK)**:
```json
{
  "attemptId": 42,
  "quizId": 1,
  "quizTitle": "Java 21 Core Knowledge Assessment",
  "score": 100,
  "passed": true,
  "passingScore": 75,
  "totalQuestions": 1,
  "correctAnswersCount": 1,
  "questionResults": [
    {
      "questionId": 1,
      "questionText": "What key benefit do Java 21 Virtual Threads provide?",
      "options": [...],
      "selectedOptionIndex": 1,
      "correctAnswerIndex": 1,
      "correct": true,
      "explanation": "Virtual threads are lightweight threads managed by the JVM runtime that drastically reduce resource consumption."
    }
  ],
  "attemptedAt": "2026-10-15T12:00:00"
}
```

---

## 4. Personalized Recommendations

### 4.1 Get Scored Recommendations
* **Endpoint**: `GET /api/recommendations`
* **Access**: Authenticated (`STUDENT`)
* **Response (200 OK)**:
```json
[
  {
    "courseId": 2,
    "title": "Full-Stack React 18 & Neumorphic Design",
    "shortDescription": "Craft accessible, modern tactile web applications.",
    "category": "Frontend Development",
    "difficultyLevel": "Beginner",
    "thumbnailUrl": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600",
    "instructorName": "Elena Vance",
    "estimatedDuration": "8 hours",
    "explanation": "Recommended based on your interest in Frontend and high score in Java 21 fundamentals.",
    "score": 85.0
  }
]
```

---

## 5. AI Learning Assistant

### 5.1 Send Prompt to AI Assistant
* **Endpoint**: `POST /api/ai/chat`
* **Access**: Authenticated (`STUDENT`, `ADMIN`)
* **Request Body**:
```json
{
  "message": "Explain Java 21 records with a quick code snippet",
  "courseContext": "Mastering Modern Java 21 & Spring Boot 3"
}
```
* **Response (200 OK)**:
```json
{
  "reply": "Records in Java are immutable data-carrier classes that eliminate boilerplate code...",
  "suggestedFollowups": [
    "How do records compare to traditional JavaBeans?",
    "Can records implement interfaces?"
  ],
  "demoMode": true,
  "provider": "EduPulse AI Engine (Local Demo Mode)",
  "timestamp": "2026-10-15T12:05:00"
}
```

---

## 6. Admin Management

All administrative endpoints require the `ADMIN` role.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Platform aggregates (enrollments, completions, active students). |
| `GET` | `/api/admin/courses` | Complete course list including unpublished drafts. |
| `POST` | `/api/admin/courses` | Create new course. |
| `PUT` | `/api/admin/courses/{id}` | Update existing course. |
| `PATCH`| `/api/admin/courses/{id}/toggle-publish` | Toggle published visibility state. |
| `DELETE`| `/api/admin/courses/{id}` | Delete course and cascade lessons/quizzes. |
| `POST` | `/api/admin/courses/{id}/lessons` | Add new lesson to course. |
| `PUT` | `/api/admin/lessons/{id}` | Update existing lesson. |
| `DELETE`| `/api/admin/lessons/{id}` | Delete lesson. |
| `GET` | `/api/admin/quizzes/{id}` | Inspect quiz with correct answer keys and explanations. |
| `POST` | `/api/admin/quizzes` | Create quiz for a course. |
| `PUT` | `/api/admin/quizzes/{id}` | Update quiz questions, options, and passing score. |
| `DELETE`| `/api/admin/quizzes/{id}` | Delete quiz. |
| `GET` | `/api/admin/users` | List registered students and enrollment counts. |
