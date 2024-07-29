import { useState } from "react";
import NotificationIcon from "../assets/NotificationIcon";

// dummy data
// todo Data will be api fetchable after Notification Service Setup
function NotificationButton() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Card title 1",
      message: "You can use any element as a dropdown.",
    },
    {
      id: 2,
      title: "Card title 2",
      message: "You can use any element as a dropdown.",
    },
    {
      id: 3,
      title: "Card title 3",
      message: "You can use any element as a dropdown.",
    },
    {
      id: 4,
      title: "Card title 4",
      message: "You can use any element as a dropdown.",
    },
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const clearNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button tabIndex={0} className="btn" onClick={toggleDropdown}>
        <NotificationIcon />
        <div className="badge">+{notifications.length}</div>
      </button>
      {isDropdownOpen && (
        <div
          tabIndex={0}
          className="dropdown-content card card-compact bg-primary text-primary-content z-[1] w-64 p-2 shadow absolute right-0"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="card-title">Notifications</h3>
            <button
              className="btn btn-sm btn-secondary"
              onClick={clearAllNotifications}
            >
              Clear All
            </button>
          </div>
          <div className="container overflow-y-auto max-h-64">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="card-body flex justify-between items-center mb-2 bg-secondary text-secondary-content p-2 rounded"
              >
                <div>
                  <h3 className="card-title">{notification.title}</h3>
                  <p>{notification.message}</p>
                </div>
                <button
                  className="btn btn-sm btn-error ml-2"
                  onClick={() => clearNotification(notification.id)}
                >
                  Clear
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationButton;
