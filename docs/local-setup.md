# Local Development & Setup Guide

This guide walks through running the **AI-Powered Personalized Online Learning Portal** locally on your workstation.

---

## 1. Prerequisites

Ensure you have the following installed:
* **Java Development Kit (JDK) 21** or higher:
  ```bash
  java -version
  ```
* **Apache Maven 3.9+** (or use the bundled `mvnw` / `mvnw.cmd` wrapper):
  ```bash
  mvn -version
  ```
* **Node.js 18+** and **npm**:
  ```bash
  node -v
  npm -v
  ```
* **MySQL 8.0+** (or an Aiven Cloud MySQL instance, or H2 in-memory for testing).

---

## 2. Backend Setup (Spring Boot 3)

### Step 2.1: Database Configuration
If using a local MySQL instance, create the database:
```sql
CREATE DATABASE edupulse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Configure `backend/src/main/resources/application.properties` (or set environment variables):
```properties
# MySQL Connection
spring.datasource.url=jdbc:mysql://localhost:3306/edupulse_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Flyway Migrations
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true

# JWT Secrets (at least 32 characters for HMAC-SHA256)
app.jwt.secret=9a7c8e6d2b4f1a3c5e7g9i1k3m5o7q9s1u3w5y7z9b1d3f5h7j9l1n3p5r7t9v1x
app.jwt.access-token-expiration-ms=900000
app.jwt.refresh-token-expiration-ms=604800000

# CORS Allowed Origins
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

*(Tip: In Windows PowerShell, you can set environment variables via `$env:SPRING_DATASOURCE_PASSWORD="your_password"`).*

### Step 2.2: Build & Run Automated Tests
```bash
cd backend
mvn test
```
*All 19 tests will execute and verify authentication, course retrieval, quiz scoring, and security rules.*

### Step 2.3: Start the Backend Server
```bash
cd backend
mvn spring-boot:run
```
The backend server will start on `http://localhost:8080`.
* **Health Check**: `http://localhost:8080/actuator/health`
* **Swagger UI Documentation**: `http://localhost:8080/swagger-ui.html`

### Step 2.4: Default Pre-Seeded Accounts
When the application starts, the `DataInitializer` automatically inserts:
| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@portal.com` | `Admin123!` |
| **Student** | `student@portal.com` | `Student123!` |

*(Along with 4 sample full courses, structured lessons, and multi-question quizzes).*

---

## 3. Frontend Setup (React 18 + Vite)

### Step 3.1: Install Dependencies
Open a separate terminal window and run:
```bash
cd frontend
npm install
```
*(On Windows systems where PowerShell script policy blocks `npm`, run via `cmd /c npm install` or `npm.cmd install`).*

### Step 3.2: Configure Environment Variables
Create or verify `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Step 3.3: Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

---

## 4. End-to-End Verification Checklist

1. **Public Catalog**: Visit `http://localhost:5173/courses`. Search courses and filter by category (e.g. *Backend Development*).
2. **Student Experience**:
   * Log in with `student@portal.com` / `Student123!` (or register a new user).
   * Go to **Student Dashboard**: verify enrollment stats and completion streak.
   * Go to **My Courses** and click **Continue Learning**.
   * In **Course Learn Page**: read lesson content, click **Mark Lesson Completed**, and observe the progress bar update dynamically.
   * Click **Take Quiz**: submit answers, verify server-side score calculation, and review correct answers with explanations.
   * Go to **AI Recommendations**: inspect personalized recommendations with explainability rationales.
   * Go to **AI Tutor**: ask technical questions and test sample prompts.
3. **Admin Experience**:
   * Log out and log in with `admin@portal.com` / `Admin123!`.
   * Open the **Admin Console** from the top navbar.
   * Inspect platform analytics cards (Total Students, Active Courses, Completion Rate).
   * Create a new course, add a lesson, and toggle publish state.
   * Review registered user records in **User Management**.
