import {
  formatTimeSpan12Hour,
  parseTimeSpan,
  TimeSpan,
} from "../types/TimeSpanAsserts";

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
  openBy = parseTimeSpan("09:00:00"),
  closeBy = parseTimeSpan("18:00:00"),
}: BloodCenterProps) {
  return (
    <div className="card-body bg-base-100 h-fit rounded-btn">
      <h2 className="card-title">{name}</h2>
      <p>
        Located in {distance} from you. {address}
      </p>
      <div className="flex gap-2">
        <div className="badge badge-info">
          stock: {rbc}/{capacity}
        </div>
        <div className="badge badge-info">
          {" "}
          from {formatTimeSpan12Hour(openBy)}
          to {formatTimeSpan12Hour(closeBy)}
        </div>
      </div>
      <div className="card-actions justify-end">
        <button className="btn btn-primary">
          Donate Here / Request for Blood ( if hospital login )
        </button>
      </div>
    </div>
  );
}

export default CentreCard;
