
## Introduction

This document provides an overview of the technical implementation of the LifeFlow application, which is developed using .NET for the backend and React with TypeScript for the frontend. The application is designed with a focus on modularity, scalability, and maintainability, utilizing several cutting-edge technologies and design patterns.

## Technologies and Frameworks

### Backend (.NET)

- **Quartz.NET**: Quartz.NET is utilized for scheduling background jobs, such as sending notifications, processing recurring orders, and issuing warnings about expiring blood units. This ensures timely alerts and updates to users and administrators.

- **MediatR**: Implements the mediator pattern to manage interactions between components. It decouples request handlers from controllers, leading to cleaner and more maintainable code by centralizing the request handling logic.

- **AutoMapper**: Used for mapping objects between different layers, such as mapping DTOs (Data Transfer Objects) to entities and vice versa. AutoMapper simplifies the mapping code and ensures consistency, reducing the potential for human error in manual mapping.

- **Entity Framework Core (EF Core)**: EF Core is the ORM (Object-Relational Mapper) used for database operations. It supports LINQ-based querying, lazy loading, change tracking, and migrations, enabling efficient and scalable database interactions.

- **WatchDog**: WatchDog is employed for logging application activities and exceptions. It provides detailed logs of operations, which are crucial for monitoring, debugging, and auditing application behavior.

- **SignalR**: SignalR is implemented for real-time communication, particularly for notifications. It enables the application to push real-time updates to users, such as alerts for new donation slots, order status changes, or warnings about expiring blood units.

### Frontend (React with TypeScript)

- **React**: The frontend is built using React, a powerful library for building user interfaces. React is component-based, making it easier to manage and reuse code across the application.
- **TypeScript**: TypeScript is used over JavaScript to provide type safety, ensuring that code is more predictable and less prone to runtime errors. It helps in catching errors during the development phase and improves the overall maintainability of the application.
- **DaisyUI**: DaisyUI is a utility-first CSS framework for designing responsive and accessible UIs. It integrates seamlessly with Tailwind CSS, providing pre-built components that are easy to customize.

### Architecture

- **Layered by Feature Architecture**: The application follows a feature-based modular architecture. Each feature (e.g., Orders, Clients, Notifications) is encapsulated within its own module, containing all related services, controllers, models, and views. This promotes better organization, separation of concerns, and easier scaling of the application.

- **Order Service**: The Order service manages the creation, processing, and management of orders. It handles various order types such as Emergency, Recurring Transfusion, Hospital Stock Update, and Recurring API. The service interacts with other services like UnitBagService, ClientService, PaymentService, and NotificationService to process orders efficiently.

- **BloodCenterService**: This service is responsible for handling operations related to blood centers, such as fetching nearby centers, booking appointments, processing donation slots, and managing unit bags.

## OrderService Implementation

The `OrderService` class is a core component of the application, responsible for managing orders. Below is an overview of the key methods and their functionality:

### `MakeOrder(OrderRequestDto request)`

This method processes an order request by:

- Verifying the client and their address.
- Identifying nearby blood centers based on the client's location.
- Handling different order types (e.g., Emergency, Recurring Transfusion) by fetching appropriate unit bags from blood centers.
- Handling transactions and managing exceptions to ensure data consistency.
- Logging important operations using WatchDog for monitoring and debugging.

### `ProcessForEmergency(List<BloodCenterFetchDto> centers, OrderRequestDto request)`

This method processes an emergency order by:

- Fetching the appropriate unit bags (RBC and Rhd subtype) from nearby centers.
- Ensuring that only a limited quantity (max 5 units) is allowed for emergency orders.
- Notifying the client if the requested blood type or antigen type is out of stock.

### `ProcessForRecurringTransfusion(List<BloodCenterFetchDto> centers, OrderRequestDto request)`

This method handles recurring transfusion orders by:

- Fetching unit bags based on the specified blood types and antigen types.
- Ensuring that the required quantity is gathered from the nearest centers.

### `ProcessForHospitalStockUpdate(List<BloodCenterFetchDto> centers, OrderRequestDto request)`

This method manages hospital stock update orders by:

- Fetching unit bags for the specified blood types and antigen types.
- Prioritizing stock allocation based on available quantity.

### `ProcessForRecurringApi(List<BloodCenterFetchDto> centers, OrderRequestDto request)`

This method handles recurring API orders by:

- Fetching plasma unit bags from nearby centers.
- Ensuring that the required quantity is available.

### `MakeOrder(List<UnitBagDto> bags, OrderType type, ClientType clientType, OrderRequestDto request)`

This method creates an order by:

- Calculating the total price based on the order type and client type.
- Persisting the order and updating the database with the selected unit bags.

## Calculating distance with Latitude and Longitude

```
acos(sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lon2-lon1))*6371 (6371 is Earth radius in km.)
```


### Some RollBack Decisios
- As early we are planned to have these Order, Donation & Notification service as dedicated microservices. Due to the configuration dependency of Keycloak ( the planned Auth Gate way ). This might require addition time for it's configuration and setup across all the services. So as of now we are partial ==Modular Monolith with the use of MeidatR== . Upon future scope conversion to microservice will occur
- As for the Use of Kafka for the streaming, with these monolith flow seems sufficient as of now. Also for the notification the job time window has the minimum duration of 30 minutes
## Conclusion

The LifeFlow application is a robust and scalable solution designed with modern architectural patterns and technologies. The combination of .NET and React with TypeScript ensures a maintainable and efficient codebase, while the modular architecture allows for easy expansion and feature integration.

This document should serve as a reference for understanding the key components and technical choices made during the development of the LifeFlow application.

