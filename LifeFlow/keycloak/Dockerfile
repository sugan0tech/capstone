# Use the official Keycloak image as the base image
FROM quay.io/keycloak/keycloak:25.0.2 as builder

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

# Set environment variables
ENV KC_DB=mssql

WORKDIR /opt/keycloak
# for demonstration purposes only, please make sure to use proper certificates in production instead
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:keycloak,IP:127.0.0.1" -keystore conf/server.keystore
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:25.0.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENV KC_DB=mssql
ENV KC_DB_URL=jdbc:sqlserver://host.docker.internal:1433;databaseName=keycloak;encrypt=false
ENV KC_DB_USERNAME=sa
ENV KC_DB_PASSWORD=Suga@123
ENV KC_HOSTNAME=keycloak


# Copy the command to be executed
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--db=mssql", "--db-url=jdbc:sqlserver://host.docker.internal:1433;databaseName=keycloak;encrypt=false", "--db-username=sa", "--db-password=Suga@123"]

# ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev"]


