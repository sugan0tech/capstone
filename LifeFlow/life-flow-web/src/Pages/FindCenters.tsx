import CentreCard from "../Components/CentreCard";
import MapLeaflet from "../Components/MapLeaflet";
import { OverAllStatus } from "../Components/OverAllStatus";
import UserStatus from "../Components/UserStatus";

function FindCenters() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-col gap-x-96 items-center bg-base-300 h-48 rounded-box lg:flex-row">
          <div className="flex-1 lg:pl-24 ">
            <label className="input input-bordered flex items-center gap-2">
              <input
                type="text"
                className="grow"
                placeholder="Search centers"
              />
              <kbd className="kbd kbd-sm">⌘</kbd>
              <kbd className="kbd kbd-sm">K</kbd>
            </label>
          </div>
          <div className="flex-1">
            <UserStatus />
          </div>
        </div>
      </div>

      <div className="divider "></div>

      <div className="flex flex-col lg:flex-row">
        <div className="card bg-base-300 rounded-box grid flex-1 place-items-center gap-2 h-fill">
          <div
            className="grid grid-cols-2 gap-2 overflow-y-scroll pl-2 pb-2"
            style={{ height: "550px" }}
          >
            <CentreCard />
            <CentreCard />
            <CentreCard />
            <CentreCard />
            <CentreCard />
          </div>
        </div>

        <div className="divider lg:divider-horizontal"></div>

        <div className="card bg-base-200 rounded-box grid flex-1 place-items-center h-fit">
          <MapLeaflet />
        </div>
      </div>
    </>
  );
}

export default FindCenters;
