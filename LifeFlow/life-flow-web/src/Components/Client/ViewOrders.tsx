import { useEffect, useState } from "react";
import {get} from "../../utils/apiService.ts";

enum OrderType {
    HospitalStockUpdate = "HospitalStockUpdate",
    RecurringTransfusion = "RecurringTransfusion",
    Emergency = "Emergency",
    RecurringAPI = "RecurringAPI",
}

enum OrderStatus {
    Pending = "Pending",
    Delivered = "Delivered",
}

interface UnitBag {
    // Define the properties of UnitBag according to your application
    id: number;
    volume: number;
    type: string;
}

interface Client {
    // Define the properties of Client according to your application
    id: number;
    name: string;
}

interface OrderDto {
    ClientId: number;
    Client: Client;
    Status: OrderStatus;
    Items: UnitBag[];
    Quantity: number;
    TotalPrice: number;
    Description: string;
    OrderType: OrderType;
    OrderDate: Date;
    DeliveryDate: Date | null;
}

function ViewOrders() {
    const [deliveredOrders, setDeliveredOrders] = useState<OrderDto[]>([]);
    const [ongoingOrders, setOngoingOrders] = useState<OrderDto[]>([]);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const clientId = 1; // Fetch this from context
                const orders = await get<OrderDto[]>(`/order/all/${clientId}`);

                // Filter orders based on status
                setDeliveredOrders(orders.filter(order => order.Status === OrderStatus.Delivered));
                setOngoingOrders(orders.filter(order => order.Status !== OrderStatus.Delivered));
            } catch (error) {
                console.error("Failed to fetch orders", error);
                // Use dummy data in case of failure
                const dummyData: OrderDto[] = [
                    {
                        ClientId: 1,
                        Client: { id: 1, name: "Dummy Client" },
                        Status: OrderStatus.Delivered,
                        Items: [],
                        Quantity: 10,
                        TotalPrice: 500,
                        Description: "Dummy Delivered Order",
                        OrderType: OrderType.HospitalStockUpdate,
                        OrderDate: new Date(),
                        DeliveryDate: new Date(),
                    },
                    // Add more dummy orders as needed
                ];
                setDeliveredOrders(dummyData);
                setOngoingOrders(dummyData);
            }
        }

        fetchOrders();
    }, []);

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Ongoing Orders</h2>
            <div className="grid gap-4">
                {ongoingOrders.map((order) => (
                    <div key={order.OrderDate.toString()} className="card shadow-md">
                        <div className="card-body">
                            <h3 className="card-title">{order.Description}</h3>
                            <p>Quantity: {order.Quantity}</p>
                            <p>Total Price: {order.TotalPrice}</p>
                        </div>
                    </div>
                ))}
            </div>
            <h2 className="text-xl font-bold mt-8 mb-4">Delivered Orders</h2>
            <div className="grid gap-4">
                {deliveredOrders.map((order) => (
                    <div key={order.OrderDate.toString()} className="card shadow-md">
                        <div className="card-body">
                            <h3 className="card-title">{order.Description}</h3>
                            <p>Quantity: {order.Quantity}</p>
                            <p>Total Price: {order.TotalPrice}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ViewOrders;
