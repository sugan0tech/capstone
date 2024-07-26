import { TimeSpan } from "../types/TimeSpan";

interface BloodCenterProps {
  name: string;
  distance: string;
  rbc: number;
  capacity: number;
  openBy: TimeSpan;
  closeBy: TimeSpan;
  address: string;
}
function CentreCard({
  name = "Center Name",
  distance = "5km",
  rbc = 0,
  capacity = 1,
  address = "Kumarn stree, velumqani, chennai, tamilnadu. 73728",
}: BloodCenterProps) {
  return (
    <div className="card-body bg-base-100 h-fit rounded-btn">
      <h2 className="card-title">{name}</h2>
      <p>
        Located in {distance} from you. {address}
      </p>
      <div className="flex gap-2">
        <div className="badge badge-info">{distance}</div>
        <div className="badge badge-info">
          blood in stock: {rbc}/{capacity}
        </div>
      </div>
      <div className="card-actions justify-end">
        <button className="btn btn-secondary">See in map</button>
        <button className="btn btn-primary">
          Donate Here / Request for Blood ( if hospital login )
        </button>
      </div>
    </div>
  );
}

export default CentreCard;
