import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useAuth} from "../../contexts/AuthContext.tsx";

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
    Status: OrderStatus;
    types: BloodType[];
    AntigenTypes: AntigenType[];
    Subtypes: BloodSubtype[];
    MaxQuantity: number;
    Description: string;
    OrderType: OrderType;
    OrderDate: Date;
    DeliveryDate: Date | null;
}

interface Payment {
    OrderId: number;
    Amount: number;
    PaymentDate: Date;
    PaymentMethod: string;
    TransactionId: string;
}

function MakeOrder() {
    const {t} = useTranslation();
    const {role} = useAuth();

    const [orderData, setOrderData] = useState<OrderRequestDto>({
        ClientId: 0, // Will be set from context
        Status: OrderStatus.Pending,
        types: [],
        AntigenTypes: [],
        Subtypes: [],
        MaxQuantity: 0,
        Description: "",
        OrderType: role === "PharmaAdmin" ? OrderType.RecurringAPI : OrderType.HospitalStockUpdate,
        OrderDate: new Date(),
        DeliveryDate: null,
    });

    const [isLoading, setIsLoading] = useState(false);
    const [paymentData, setPaymentData] = useState<Payment | null>(null);

    useEffect(() => {
        if (orderData.OrderType === OrderType.RecurringTransfusion || orderData.OrderType === OrderType.Emergency) {
            if (orderData.MaxQuantity > 10) {
                setOrderData((prevData) => ({
                    ...prevData,
                    MaxQuantity: 10,
                }));
            }
        }
    }, [orderData.OrderType, orderData.MaxQuantity]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setOrderData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setOrderData((prevData) => ({
            ...prevData,
            [name]: value,
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
            // Mock API call to create the order
            const response = await new Promise<OrderRequestDto>((resolve) =>
                setTimeout(() => resolve(orderData), 2000)
            );

            // Mock API call to fetch payment details
            const paymentResponse = await new Promise<Payment>((resolve) =>
                setTimeout(() => resolve({
                    OrderId: response.ClientId,
                    Amount: 100.0,
                    PaymentDate: new Date(),
                    PaymentMethod: "NetBanking",
                    TransactionId: "Nil",
                }), 2000)
            );

            setPaymentData(paymentResponse);
        } catch (error) {
            console.error("Error submitting order:", error);
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
                            <p>{t('orders.amount', { amount: paymentData.Amount })}</p>
                            <button className="btn btn-primary" onClick={() => alert(t('orders.proceed_to_payment'))}>
                                {t('orders.pay_now')}
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Client ID</span>
                                    <span className="label-text-alt">Required</span>
                                </div>
                                <input
                                    type="number"
                                    name="ClientId"
                                    value={orderData.ClientId}
                                    onChange={handleInputChange}
                                    placeholder="Client ID"
                                    className="input input-bordered"
                                />
                            </label>

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
                                        orderData.OrderType === OrderType.RecurringTransfusion ||
                                        orderData.OrderType === OrderType.Emergency
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
                                        name="OrderType"
                                        value={orderData.OrderType}
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
                                                />
                                            </label>
                                        ))}
                                    </div>

                                    <div className="form-control">
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
                                                />
                                            </label>
                                        ))}
                                    </div>

                                    <div className="form-control">
                                        <div className="label">
                                            <span className="label-text">{t('orders.blood_subtypes')}</span>
                                            <span className="label-text-alt">Required</span>
                                        </div>
                                        {Object.values(BloodSubtype).map((type) => (
                                            <label key={type} className="cursor-pointer label">
                                                <span className="label-text">{type}</span>
                                                <input
                                                    type="checkbox"
                                                    checked={orderData.Subtypes.includes(type)}
                                                    onChange={() => handleCheckboxChange("Subtypes", type)}
                                                    className="checkbox checkbox-success"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </>
                            )}

                            <div className="modal-action">
                                <button type="submit" className="btn btn-primary">{t('orders.submit')}</button>
                                <button type="button" className="btn"
                                        onClick={() => document.getElementById("my_modal_1").close()}>{t('orders.close')}
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