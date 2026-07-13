FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B clean package -DskipTests \
    && cp target/server-*.jar /tmp/app.jar \
    && jar tf /tmp/app.jar >/dev/null

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY --from=build /tmp/app.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
