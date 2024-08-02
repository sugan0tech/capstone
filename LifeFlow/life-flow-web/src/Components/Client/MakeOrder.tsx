import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { post } from "../../utils/apiService.ts";
import { useAlert } from "../../contexts/AlertContext";

enum OrderType {
    HospitalStockUpdate = "HospitalStockUpdate",
    RecurringTransfusion = "RecurringTransfusion",
    Emergency = "Emergency",
    RecurringAPI = "RecurringAPI",
}

enum BloodType {
    Platelet = "Platelet",
    RBC = "RBC",
    Plasma = "Plasma",
}

enum AntigenType {
    APositive = "APositive",
    ANegative = "ANegative",
    BPositive = "BPositive",
    BNegative = "BNegative",
    OPositive = "OPositive",
    ONegative = "ONegative",
    ABPositive = "ABPositive",
    ABNegative = "ABNegative",
}

enum BloodSubtype {
    Rhd = "Rhd",
    Ro = "Ro",
}

enum OrderStatus {
    Pending = "Pending",
    Delivered = "Delivered",
}

interface OrderRequestDto {
    ClientId: number;
    orderType: string;
    Status: OrderStatus;
    types: BloodType[];
    AntigenTypes: AntigenType[];
    Subtypes: BloodSubtype[];
    MaxQuantity: number;
    Description: string;
}

interface OrderResponseDto {
    id: number;
    clientId: number;
    status: OrderStatus;
    quantity: number;
    orderDate: Date;
    orderType: string;
    description: string;
    paymentId: number;
    totalPrice: number;
}

interface Payment {
    id: number;
    OrderId: number;
    Amount: number;
    PaymentDate: Date;
    Method: string;
    TransactionId: string;
}

function MakeOrder() {
    const { t } = useTranslation();
    const { role } = useAuth();
    const { addAlert } = useAlert();
    const client = JSON.parse(localStorage.getItem("Client"));

    const [orderData, setOrderData] = useState<OrderRequestDto>({
        ClientId: client.id,
        Status: OrderStatus.Pending,
        types: [],
        AntigenTypes: [],
        Subtypes: [],
        MaxQuantity: 0,
        Description: "",
        orderType: "HospitalStockUpdate",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<Payment | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("NetBanking");

    useEffect(() => {
        if (orderData.orderType === OrderType.Emergency) {
            setOrderData((prevData) => ({
                ...prevData,
                types: [BloodType.RBC],
                AntigenTypes: prevData.AntigenTypes.slice(0, 1),
            }));
        }

        if (orderData.orderType === OrderType.RecurringAPI) {
            setOrderData((prevData) => ({
                ...prevData,
                types: [BloodType.Plasma],
            }));
        }
    }, [orderData.orderType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOrderData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrderData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRadioChange = (name: string, value: string) => {
        setOrderData((prevData) => ({
            ...prevData,
            [name]: [value],
        }));
    };

    const handleCheckboxChange = (name: string, value: string) => {
        setOrderData((prevData) => ({
            ...prevData,
            [name]: prevData[name].includes(value)
                ? prevData[name].filter((item: string) => item !== value)
                : [...prevData[name], value],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const orderResponse = await post<OrderResponseDto>("/order/make", orderData);

            console.log("orderResponse")
            console.log(orderResponse)
            setTimeout(() => {
                setPaymentData({
                    id: orderResponse.paymentId,
                    OrderId: orderResponse.id,
                    Amount: orderResponse.totalPrice,
                    PaymentDate: new Date(),
                    Method: "",
                    TransactionId: "",
                });
            }, 3000);
        } catch (error) {
            console.error("Error submitting order:", error);
            addAlert({ message: t("orders.error_submitting_order"), type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async () => {
        setIsLoading(true);

        try {
            const paymentResponse = await post<Payment>("/payment/make", {
                PaymentId: paymentData!.id,
                Amount: paymentData!.Amount,
                Method: paymentMethod,
                OrderId: paymentData!.OrderId,
            });

            setPaymentData(paymentResponse);
            addAlert({ message: t("orders.payment_successful"), type: "success" });
        } catch (error) {
            console.error("Error making payment:", error);
            addAlert({ message: t("orders.error_making_payment"), type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button className="btn" onClick={() => document.getElementById("my_modal_1").showModal()}>
                {t('orders.create_order')}
            </button>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{t('orders.new_order')}</h3>
                    {isLoading ? (
                        <span className="loading loading-spinner text-primary">{t('orders.loading')}</span>
                    ) : paymentData ? (
                        <div>
                            <p>{t('orders.order_created')}</p>
                            <p>{t('orders.amount', { amount: paymentData.Amount})} </p>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">{t('orders.payment_method')}</span>
                                    <span className="label-text-alt">Required</span>
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
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Max Quantity</span>
                                    <span className="label-text-alt">Required</span>
                                </div>
                                <input
                                    type="number"
                                    name="MaxQuantity"
                                    value={orderData.MaxQuantity}
                                    onChange={handleInputChange}
                                    placeholder="Max Quantity"
                                    className="input input-bordered"
                                    max={
                                        orderData.orderType === OrderType.RecurringTransfusion ||
                                        orderData.orderType === OrderType.Emergency
                                            ? 10
                                            : undefined
                                    }
                                />
                            </label>

                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Order Description</span>
                                    <span className="label-text-alt">Optional</span>
                                </div>
                                <textarea
                                    name="Description"
                                    value={orderData.Description}
                                    onChange={handleInputChange}
                                    placeholder="Order Description"
                                    className="textarea textarea-bordered"
                                />
                            </label>

                            {role !== "PharmaAdmin" && (
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Order Type</span>
                                        <span className="label-text-alt">Required</span>
                                    </div>
                                    <select
                                        name="orderType"
                                        value={orderData.orderType}
                                        onChange={handleSelectChange}
                                        className="select select-bordered"
                                    >
                                        {Object.values(OrderType).map((type) => (
                                            type !== OrderType.RecurringAPI && (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            )
                                        ))}
                                    </select>
                                </label>
                            )}

                            {role === "PharmaAdmin" && (
                                <label className="form-control w-full max-w-xs">
                                    <div className="label">
                                        <span className="label-text">Order Type</span>
                                        <span className="label-text-alt">Fixed</span>
                                    </div>

                                    <input
                                        type="text"
                                        name="OrderType"
                                        value={OrderType.RecurringAPI}
                                        readOnly
                                        className="input input-bordered"
                                    />
                                </label>
                            )}

                            {role === "HospitalAdmin" && (
                                <>
                                    <div className="form-control">
                                        <div className="label">
                                            <span className="label-text">{t('orders.blood_types')}</span>
                                            <span className="label-text-alt">Required</span>
                                        </div>
                                        {Object.values(BloodType).map((type) => (
                                            <label key={type} className="cursor-pointer label">
                                                <span className="label-text">{type}</span>
                                                <input
                                                    type="checkbox"
                                                    checked={orderData.types.includes(type)}
                                                    onChange={() => handleCheckboxChange("types", type)}
                                                    className="checkbox checkbox-success"
                                                    disabled={orderData.orderType === OrderType.RecurringAPI || (orderData.orderType === OrderType.Emergency && type !== BloodType.RBC)}
                                                />
                                            </label>
                                        ))}
                                    </div>

                                    <label className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">{t('orders.antigen_types')}</span>
                                            <span className="label-text-alt">Required</span>
                                        </div>
                                        {Object.values(AntigenType).map((type) => (
                                            <label key={type} className="cursor-pointer label">
                                                <span className="label-text">{type}</span>
                                                <input
                                                    type="checkbox"
                                                    checked={orderData.AntigenTypes.includes(type)}
                                                    onChange={() => handleCheckboxChange("AntigenTypes", type)}
                                                    className="checkbox checkbox-success"
                                                    disabled={
                                                        orderData.orderType === OrderType.Emergency && orderData.AntigenTypes.length > 0
                                                    }
                                                />
                                            </label>
                                        ))}
                                    </label>
                                </>
                            )}

                            {role !== "PharmaAdmin" && (
                                <div className="form-control">
                                    <div className="label">
                                        <span className="label-text">{t('orders.blood_subtypes')}</span>
                                    </div>
                                    {Object.values(BloodSubtype).map((subtype) => (
                                        <label key={subtype} className="cursor-pointer label">
                                            <span className="label-text">{subtype}</span>
                                            <input
                                                type="radio"
                                                name="Subtypes"
                                                value={subtype}
                                                checked={orderData.Subtypes.includes(subtype)}
                                                onChange={() => handleRadioChange("Subtypes", subtype)}
                                                className="radio radio-success"
                                            />
                                        </label>
                                    ))}
                                </div>
                            )}

                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary">
                                    {t('orders.submit')}
                                </button>
                                <button className="btn" onClick={() => document.getElementById("my_modal_1").close()}>
                                    {t('orders.close')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </dialog>
        </div>
    );
}

export default MakeOrder;
