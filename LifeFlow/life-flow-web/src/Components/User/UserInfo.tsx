export const UserInfo = ({ user, onEdit }) => (
  <div>
    <p>Email: {user?.email}</p>
    <p>Name: {user?.name}</p>
    <p>Role: {user?.role}</p>
    <button className="btn btn-secondary mt-4" onClick={onEdit}>
      Edit
    </button>
  </div>
);
