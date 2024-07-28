export const DonorInfoDisplay = ({ donorInfo, onEdit }) => (
  <div>
    <p>Blood Antigen Type: {donorInfo?.bloodAntigenType}</p>
    <p>Blood Subtype: {donorInfo?.bloodSubtype}</p>
    <p>Last Donation Time: {donorInfo?.lastDonationTime || "Not Yet"}</p>
    <button className="btn btn-secondary mt-4" onClick={onEdit}>
      Edit
    </button>
  </div>
);
