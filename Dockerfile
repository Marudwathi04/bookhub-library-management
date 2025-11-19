# ---------- Build stage (Maven + Java 17) ----------
FROM maven:3.9.6-eclipse-temurin-17 AS build

# repo root as workdir
WORKDIR /app

# copy backend pom and source
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

# build Spring Boot jar
WORKDIR /app/backend
RUN mvn clean package -DskipTests

# ---------- Run stage (lightweight JRE) ----------
FROM eclipse-temurin:17-jre

WORKDIR /app

# copy jar from build stage
COPY --from=build /app/backend/target/*.jar app.jar

# Render will set PORT env; Spring Boot uses server.port=${PORT:8081}
ENV PORT=8081
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
