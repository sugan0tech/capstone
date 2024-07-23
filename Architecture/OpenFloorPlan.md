# Rough draft of what to be the flow and use-case

## Actors

-   Donor
-   Blood Bank ( Application holder )
-   Receiver ( Hospitals, Nursing homes & Pharma )

## Donation process

1. Donor can Login/Register
2. Fill up the form
    - This form, to verify them with vaccination & medical conditions
3. Based on their location, app will book an appointment for donation in nearby Blood Donation Center
4. Once the appointment statisfied, The Blood ( 1N ). Converted to sub types ( plasma, RBC & platelets ).
5. The blood will be tested, if any conditions found -> Notify the user ( via application & mail )
6. The stored to Blood Bank registry

> Note if the blood type is rare of subtype Ro. Should be transferred to Central Cryo Reserve

## Requisition For blood

> It's a delivery involved process. So each request will be treated as orders.

1. Client make request in portal, with of types
    1. Immediate delivery ( Emergency patients )
    2. Advanced delivery ( routine, stacking & Pharma )
2. Based on priority, delivery will be made
3. For Routines, timely interval has to provided & auto payment
4. Delivery will be dynamic, with nearby regions of supply.

## Base Business Model

-   Pvt & Commercial is the places to be add additional charges.
-   Public, non-profit should follow base charges alone.

# LifeFlowStructure

## Primary Services

-   Keycloak ( Auth )

    -   Register User
        -   Donor
        -   Hospital Admin ( MFA needed )
        -   Parma Admin
        -   Center Admin ( MFA needed )

-   BloodDonationService

    -   Doner
        -   /nearby-center
            -   gives map view with nearby 5 centers
        -   /request-appointment
    -   BloodCenter
        -   /validate-appointment
        -   /new-center
        -   /update-center
    -   Service
        -   auto transfer cryo
        -   expiration and removal
        -   slot booking, ( depends on extraction units & demand )
            -   no booking
                -   if high on stock
                -   higher stagnant rate
            -   booking
                -   slot allotment based on FIFO ( days goes by inc )
            -   If used skipped
                -   notify

-   BloodOrderService

    -   User
        -   /order-blood
            -   if emergency
                -   ASAP delivery only RBC & Plasma
                -   Fixed limited payment
            -   Non Emergency
                -   Require preiod of delivery
                -   Regular for hospitals
                    -   With given max units ( dynamically deliver on demands )
                    -   available will be trasnferred
                    -   Regular payment
                -   Regular for Pharma
                    -   after full filling other needs ( of second priority )
                    -   High payment

-   NotificationService
    -   Creats socket with web client
    -   receives msg strings from other services and pushes to corresponding users hub
