export const ViewClient = ({ client, onEdit }) => {
  if (!client) {
    return <p>No client information available</p>;
  }

  return (
    <div>
      <p>Name: {client.name}</p>
      <p>Type: {client.type}</p>
      {/* Add other fields as needed */}
      <button className="btn btn-secondary mt-4" onClick={onEdit}>
        Edit
      </button>
    </div>
  );
};
