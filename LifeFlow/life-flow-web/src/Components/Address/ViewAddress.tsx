export const ViewAddress = ({ address, onEdit }) => {
  if (!address) {
    return <p>No address available</p>;
  }

  return (
    <div>
      <p className="card-title">Address:</p>
      <p>Street: {address.street}</p>
      <p>City: {address.city}</p>
      <p>State: {address.state}</p>
      <p>Country: {address.country}</p>
      <p>Zip Code: {address.zipCode}</p>
      <p>Latitude: {address.latitude}</p>
      <p>Longitude: {address.longitude}</p>
      <button className="btn btn-secondary mt-4" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
};
