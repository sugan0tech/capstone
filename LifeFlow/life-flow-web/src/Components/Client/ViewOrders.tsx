import React, {useEffect, useState} from "react";
import {get, post, put} from "../../utils/apiService.ts";
import {useTranslation} from "react-i18next";
import {useAlert} from "../../contexts/AlertContext.tsx";

enum OrderType {
    HospitalStockUpdate = "HospitalStockUpdate",
    RecurringTransfusion = "RecurringTransfusion",
    Emergency = "Emergency",
    RecurringAPI = "RecurringAPI",
}

enum OrderStatus {
    Pending = "Pending",
    Approved = "Approved",
    Delivered = "Delivered",
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

interface Payment {
    id: number;
    orderId: number;
    amount: number;
    paymentDate: Date;
    method: string;
    transactionId: string;
}

function ViewOrders() {
    const [deliveredOrders, setDeliveredOrders] = useState<OrderDto[]>([]);
    const [ongoingOrders, setOngoingOrders] = useState<OrderDto[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);
    const [unitBags, setUnitBags] = useState<UnitBag[]>([]);
    const [paymentData, setPaymentData] = useState<Payment | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("NetBanking");
    const {t} = useTranslation();
    const {addAlert} = useAlert();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const clientId = 1; // Fetch this from context
                const orders = await get<OrderDto[]>(`/order/client/${clientId}`);

                setDeliveredOrders(orders.filter(order => order.status === OrderStatus.Delivered));
                setOngoingOrders(orders.filter(order => order.status !== OrderStatus.Delivered));
            } catch (error) {
                console.error("Failed to fetch orders", error);
            }
        }

        fetchOrders();
    }, []);

    const handleMarkAsDelivered = async (orderId: number) => {
        try {
            await put(`/order/${orderId}/Delivered`, {});
            setOngoingOrders(prevOrders =>
                prevOrders.filter(order => order.id !== orderId)
            );
            setDeliveredOrders(prevOrders => [
                ...prevOrders,
                {...prevOrders.find(order => order.id === orderId), status: OrderStatus.Delivered} as OrderDto
            ]);
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };

    const handleOrderClick = async (order: OrderDto) => {
        setSelectedOrder(order);
        try {
            const bags = await get<UnitBag[]>(`/UnitBag/order/${order.id}`);
            setUnitBags(bags);
            document.getElementById('order_modal')?.showModal();
        } catch (error) {
            console.error("Failed to fetch unit bags", error);
        }
    };

    const handlePayment = async () => {
        try {
            const paymentResponse = await post<Payment>(`/payment/${selectedOrder?.paymentId}`, {
                method: paymentMethod,
            });

            setPaymentData(paymentResponse);
            addAlert({message: t("orders.payment_successful"), type: "success"});
        } catch (error) {
            console.error("Error making payment:", error);
            addAlert({message: t("orders.error_making_payment"), type: "error"});
        }
    };

    return (
        <div>
            <dialog id="payment_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t('orders.make_payment')}</h3>
                    <div>
                        <p>{t('orders.amount', {amount: paymentData?.amount})} </p>
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text">{t('orders.payment_method')}</span>
                                <span className="label-text-alt">{t('orders.required')}</span>
                            </div>
                            <select
                                name="PaymentMethod"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="NetBanking">Net Banking</option>
                                <option value="CreditCard">Credit Card</option>
                                <option value="DebitCard">Debit Card</option>
                                <option value="UPI">UPI</option>
                            </select>
                        </label>
                        <button className="btn btn-primary mt-4" onClick={handlePayment}>
                            {t('orders.pay_now')}
                        </button>
                    </div>
                </div>
            </dialog>

            <div className="flex w-full flex-col lg:flex-row">
                <div className="card bg-base-200 rounded-box grid h-fit flex-grow place-items-center overflow-y-scroll"
                     style={{height: "550px"}}>
                    <h2 className="text-xl font-bold mb-4">{t('orders.ongoing_orders')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {ongoingOrders.map((order) => (
                            <div key={order.id} className="card shadow-md bg-base-300">
                                <div className="card-body">
                                    <h3 className="card-title">{order.description}</h3>
                                    <p>{t('orders.quantity')}: {order.quantity}</p>
                                    <p>{t('orders.total_price')}: {order.totalPrice}</p>
                                    <p>{t('orders.order_type')}: {order.orderType}</p>
                                    <div className="flex justify-between  mt-4">
                                        <button className="btn btn-secondary" onClick={() => handleOrderClick(order)}>
                                            {t('orders.view_more')}
                                        </button>
                                        {order.status === OrderStatus.Pending && (
                                            <button className="btn btn-primary"
                                                    onClick={() => document.getElementById("payment_modal").showModal()}>
                                                {t('orders.make_payment')}
                                            </button>
                                        )}
                                        {order.status === OrderStatus.Approved && (
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleMarkAsDelivered(order.id)}
                                            >
                                                {t('orders.mark_as_delivered')}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="card bg-base-200 rounded-box grid h-fit flex-grow place-items-center overflow-y-scroll"
                     style={{height: "550px"}}>
                    <h2 className="text-xl font-bold mt-8 mb-4">{t('orders.delivered_orders')}</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {deliveredOrders.map((order) => (
                            <div key={order.id} className="card shadow-md bg-base-300">
                                <div className="card-body">
                                    <h3 className="card-title">{order.description}</h3>
                                    <p>{t('orders.quantity')}: {order.quantity}</p>
                                    <p>{t('orders.total_price')}: {order.totalPrice}</p>
                                    <p>{t('orders.order_type')}: {order.orderType}</p>
                                    <button className="btn btn-secondary" onClick={() => handleOrderClick(order)}>
                                        {t('orders.view_more')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <dialog id="order_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t('orders.order_details')}</h3>
                    <p>{t('orders.description')}: {selectedOrder?.description}</p>
                    <p>{t('orders.order_type')}: {selectedOrder?.orderType}</p>
                    <p>{t('orders.quantity')}: {selectedOrder?.quantity}</p>
                    <h4 className="mt-4 font-bold">{t('orders.unit_bags')}:</h4>
                    <div className="overflow-y-scroll max-h-80">
                        {unitBags.map(bag => (
                            <div key={bag.id} className="card bg-base-300 text-primary-content w-96 mb-2">
                                <div className="card-body">
                                    <h2 className="card-title">{bag.type}</h2>
                                    <p>{t('orders.blood_subtype')}: {bag.bloodSubtype}</p>
                                    <p>{t('orders.blood_type')}: {bag.bloodType}</p>
                                    <p>{t('orders.expiry')}: {new Date(bag.expiry).toLocaleDateString()}</p>
                                    <p>{t('orders.is_rare')}: {bag.isRare ? t('yes') : t('no')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="modal-action">
                        <button className="btn bg-secondary"
                                onClick={() => document.getElementById('order_modal')?.close()}>{t('close')}</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

export default ViewOrders;
