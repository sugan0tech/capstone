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
            <div className="flex flex-col ">
                    <ViewOrders/>
            </div>
        </div>
    );
}

export default MyOrders;
