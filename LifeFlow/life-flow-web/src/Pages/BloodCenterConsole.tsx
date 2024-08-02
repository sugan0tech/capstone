import React, {useState} from "react";
import {Center, useCenter} from "../contexts/CenterContext";
import {post} from "../utils/apiService";
import CenterList from "../Components/Center/CenterList";
import AddCenter from "../Components/Center/AddCenter";
import CenterInfo from "../Components/Center/CenterInfo.tsx";

const BloodCenterConsole: React.FC = () => {
    const {selectedCenter, setSelectedCenter} = useCenter();
    const [newCenter, setNewCenter] = useState<Center>({
        id: 0,
        name: "",
        latitude: 0,
        longitude: 0,
        unitsCapacity: 0,
        rbcUnits: 0,
        plateletsUnits: 0,
        plasmaUnits: 0,
        isCentralReserve: false,
        slotsCapacity: 0,
        addressId: null,
        openByTime: "00:00:00",
        closeByTime: "00:00:00",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewCenter((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await post("/BloodCenter", newCenter);
    };

    return (
        <div className="flex flex-col pb-24">
            <div className="flex flex-col gap-x-96 items-center bg-base-200 h-48 rounded-box lg:flex-row">
                <div className="flex-1 lg:pl-24">
                    <h1 className="text-2xl font-bold">Center Information</h1>
                </div>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col gap-x-96 items-center bg-base-200 h-48 rounded-box lg:flex-row">
                <div className="flex-1 lg:pl-24">
                    <AddCenter/>
                </div>
            </div>
            <div className="divider"></div>
            <div className="flex w-full flex-col lg:flex-row">
                <div className=" flex-none w-1/4 card bg-base-200 rounded-box grid h-fit flex-grow place-items-center">
                    {selectedCenter && (
                        <CenterInfo></CenterInfo>
                    )}
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="flex-auto w-3/4 card bg-base-200 rounded-box grid h-fit flex-grow place-items-center">
                    <CenterList onSelectCenter={setSelectedCenter}/>
                </div>
            </div>
        </div>
    );
};

export default BloodCenterConsole;
