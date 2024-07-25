import MapLeaflet from "../Components/MapLeaflet";

function FindCenters() {
  return (
    <div className="flex w-full flex-col">
      <div className="card bg-base-300 rounded-box grid h-20 w-12/12 place-items-center">
        Searchbar left ; selected Center sta rightt
      </div>
      <div className="divider "></div>
      <div className="flex w-full flex-col lg:flex-row">
        <div className="card bg-base-300 rounded-box grid h-6/6 flex-1 place-items-center">
          nearby center list cardscrollable
        </div>
        <div className="divider lg:divider-horizontal"></div>
        <div className="card bg-base-200 rounded-box grid h-4/6 flex-grow place-items-center">
          <MapLeaflet />
        </div>
      </div>
    </div>
  );
}

export default FindCenters;
