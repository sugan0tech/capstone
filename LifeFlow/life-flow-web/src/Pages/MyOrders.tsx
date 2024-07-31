import React from 'react';
import MakeOrder from "../Components/Client/MakeOrder.tsx";
import ViewOrders from "../Components/Client/ViewOrders.tsx";
import {useTranslation} from "react-i18next";

function MyOrders() {
    const {t} = useTranslation();
    return (
        <div className="flex flex-col pb-24">
            <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
                <div className="flex-1 lg:pl-24">
                    <h1 className="text-2xl font-bold">{t("orders")["my_orders"]}</h1>
                </div>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
                <div className="flex-1 lg:pl-24">
                    <MakeOrder/>
                </div>
            </div>
            <div className="divider"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="card bg-base-300 h-fit rounded-btn">
                    <div className="card-body">
                        <ViewOrders/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyOrders;
