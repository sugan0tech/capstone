import React, {useEffect, useState} from "react";
import {get, put} from "../../utils/apiService";
import {useCenter} from "../../contexts/CenterContext";
import {useAlert} from "../../contexts/AlertContext";
import {useTranslation} from "react-i18next";

enum OrderType {
    HospitalStockUpdate = "HospitalStockUpdate",
    RecurringTransfusion = "RecurringTransfusion",
    Emergency = "Emergency",
    RecurringAPI = "RecurringAPI",
}

enum OrderStatus {
    Pending = "Pending",
    Approved = "Approved",
    Rejected = "Rejected",
    Ongoing = "Ongoing",
    Delivered = "Delivered",
    Cancelled = "Cancelled",
}

interface OrderDto {
    id: number;
    clientId: number;
    status: OrderStatus;
    quantity: number;
    totalPrice: number;
    description: string;
    orderType: OrderType;
    orderDate: string;
    paymentId: number;
    deliveryDate: string | null;
}

interface UnitBag {
    id: number;
    type: string;
    bloodSubtype: string;
    bloodType: string;
    expiry: string;
    donorId: number;
    centerId: number;
    orderId: number;
    isRare: boolean;
    isSold: boolean;
}

const OrdersDashboard: React.FC = () => {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
    const [unitBags, setUnitBags] = useState<UnitBag[]>([]);
    const {selectedCenter} = useCenter();
    const {addAlert} = useAlert();
    const {t} = useTranslation();

    useEffect(() => {
        async function fetchOrders() {
            if (selectedCenter) {
                try {
                    const fetchedOrders = await get<OrderDto[]>(`/order/center/${selectedCenter.name}`);
                    setOrders(fetchedOrders);
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                    addAlert({message: t("orders.error_fetching_orders"), type: "error"});
                }
            }
        }

        fetchOrders();
    }, [selectedCenter]);

    const handleUpdateOrderStatus = async (orderId: number, status: OrderStatus) => {
        try {
            await put(`/order/${orderId}/${status}`, {});
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? {...order, status} : order
                )
            );
            addAlert({message: t("orders.status_updated"), type: "success"});
        } catch (error) {
            console.error("Failed to update order status", error);
            addAlert({message: t("orders.error_updating_status"), type: "error"});
        }
    };

    const handleOrderClick = async (order: OrderDto) => {
        setSelectedOrder(order);
        try {
            const bags = await get<UnitBag[]>(`/UnitBag/order/${order.id}`);
            setUnitBags(bags);
            document.getElementById("order_modal")?.showModal();
        } catch (error) {
            console.error("Failed to fetch unit bags", error);
            addAlert({message: t("orders.error_fetching_bags"), type: "error"});
        }
    };

    const ongoingOrders = orders.filter(
        (order) =>
            order.status === OrderStatus.Ongoing ||
            order.status === OrderStatus.Pending ||
            order.status === OrderStatus.Approved
    );
    const deliveredOrders = orders.filter(
        (order) => order.status === OrderStatus.Delivered
    );

    return (
        <div>
            <div className="flex flex-col gap-x-96 items-center bg-base-200 h-48 rounded-box lg:flex-row">
                <div className="flex-1 lg:pl-24">
                    <h1 className="text-2xl font-bold">{t("orders.dashboard_title")}</h1>
                </div>
            </div>
            <div className="divider"></div>
            <div className="flex w-full flex-col lg:flex-row pb-24">
                <div className="card bg-base-200 rounded-box grid h-fit flex-grow place-items-center overflow-y-scroll"
                     style={{height: "800px"}}>
                    <h2 className="text-xl font-bold mb-4">{t("orders.ongoing_orders")}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {ongoingOrders.map((order) => (
                            <div key={order.id} className="card shadow-md bg-base-300">
                                <div className="card-body">
                                    <h3 className="card-title">{order.description}</h3>
                                    <p>{t("orders.quantity")}: {order.quantity}</p>
                                    <p>{t("orders.total_price")}: {order.totalPrice}</p>
                                    <p>{t("orders.order_type")}: {order.orderType}</p>
                                    <div className="flex justify-between mt-4 gap-4">
                                        <button className="btn btn-secondary" onClick={() => handleOrderClick(order)}>
                                            {t("orders.view_more")}
                                        </button>
                                        {order.status === OrderStatus.Pending && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.Approved)}
                                            >
                                                {t("orders.approve_order")}
                                            </button>
                                        )}
                                        {order.status === OrderStatus.Approved && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.Ongoing)}
                                            >
                                                {t("orders.mark_as_ongoing")}
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.Rejected)}
                                        >
                                            {t("orders.reject_order")}
                                        </button>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.Cancelled)}
                                        >
                                            {t("orders.cancel_order")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="card bg-base-200 rounded-box grid h-fit flex-grow place-items-center overflow-y-scroll"
                     style={{height: "800px"}}>
                    <h2 className="text-xl font-bold mt-8 mb-4">{t("orders.delivered_orders")}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {deliveredOrders.map((order) => (
                            <div key={order.id} className="card shadow-md bg-base-300">
                                <div className="card-body">
                                    <h3 className="card-title">{order.description}</h3>
                                    <p>{t("orders.quantity")}: {order.quantity}</p>
                                    <p>{t("orders.total_price")}: {order.totalPrice}</p>
                                    <p>{t("orders.order_type")}: {order.orderType}</p>
                                    <button className="btn btn-secondary" onClick={() => handleOrderClick(order)}>
                                        {t("orders.view_more")}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <dialog id="order_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t("orders.order_details")}</h3>
                    <p>{t("orders.description")}: {selectedOrder?.description}</p>
                    <p>{t("orders.order_type")}: {selectedOrder?.orderType}</p>
                    <p>{t("orders.quantity")}: {selectedOrder?.quantity}</p>
                    <h4 className="mt-4 font-bold">{t("orders.unit_bags")}:</h4>
                    <div className="overflow-y-scroll max-h-80">
                        {unitBags.map(bag => (
                            <div key={bag.id} className="card bg-base-300 text-primary-content w-96 mb-2">
                                <div className="card-body">
                                    <h2 className="card-title">{bag.type}</h2>
                                    <p>{t("orders.blood_subtype")}: {bag.bloodSubtype}</p>
                                    <p>{t("orders.blood_type")}: {bag.bloodType}</p>
                                    <p>{t("orders.expiry")}: {new Date(bag.expiry).toLocaleDateString()}</p>
                                    <p>{t("orders.is_rare")}: {bag.isRare ? t("yes") : t("no")}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modal-action">
                        <button className="btn bg-secondary"
                                onClick={() => document.getElementById('order_modal')?.close()}>{t("close")}</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default OrdersDashboard;
