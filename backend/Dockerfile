# Stage 1: Build application with Maven
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /build

# Copy Maven wrapper and POM first to leverage Docker layer caching
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code and build production jar
COPY src src
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Minimal Production JRE Image
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create a non-privileged system user for running the service
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin appuser

# Copy the built jar from the builder stage
COPY --from=builder /build/target/*.jar /app/app.jar

# Ensure proper permissions
RUN chown -R appuser:appgroup /app
USER appuser

# Render assigns dynamic PORT environment variable (defaults to 8080)
ENV PORT=8080
EXPOSE 8080

# Production JVM options tuned for cloud containers with low memory footprint
ENTRYPOINT ["sh", "-c", "exec java -Djava.security.egd=file:/dev/./urandom -Dserver.port=${PORT} -XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -jar /app/app.jar"]
