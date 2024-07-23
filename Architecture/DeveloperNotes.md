## Technical stuffs & decisions that are included & made in this application


## Infra plan
- Auth -> Keycloak
- Main Api Service -> dotnet
- Deidcated Notification Service -> pipeline with kafka
- Frontend -> React 


## Frotend Todo

1. React Leaflet integration for the map display
2. Geocoding Nomination
3. SignalR sdk for notification

## Backend Todo

1. Keycoak integration
2. MediatR
3. Log As events ( EventHog )
4. Ordering ( typing ordering scheme ), with transaction
	1. Orders will be events and streamed to dedicated service.
5. Blood tracing ( to the root donor )


Infra

1. K8s
2. Kafka in VM
3. KeyVault for creds
4. Project Managemetn with azure devops board
5.  CI/CD in azure pipelines 