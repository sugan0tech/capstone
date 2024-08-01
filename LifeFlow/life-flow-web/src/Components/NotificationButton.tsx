import { useEffect, useState } from "react";
import { HubConnectionBuilder, HttpTransportType, LogLevel } from "@microsoft/signalr";
import NotificationIcon from "../assets/NotificationIcon";

function NotificationButton() {
    const [notifications, setNotifications] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        // Fetch pending notifications
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5226/api/Notification/pending/17', {
                    headers: {
                        'Accept': 'text/plain',
                        'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                } else {
                    console.error('Failed to fetch notifications:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        const connection = new HubConnectionBuilder()
            .withUrl(`http://localhost:5226/notificationHub?receiverId=${17}`, {
                skipNegotiation: true,
                transport: HttpTransportType.WebSockets,
                accessTokenFactory: () => localStorage.getItem("accessToken"),
            })
            .withAutomaticReconnect()
            .build();
        // .configureLogging(LogLevel.Information)

        connection.start()
            .then(() => {
                // console.log("Connected to SignalR");

                connection.on("ReceiveNotification", (message) => {
                    console.log("From Socket")
                    console.log(message)
                    setNotifications((prevNotifications) => [
                        ...prevNotifications,
                        { id: Date.now(), title: "New Notification", message },
                    ]);
                    alert(message); // Display alert with the message
                });
            })
            .catch((err) => {
                // console.error("SignalR connection failed: ", err);
            });

        return () => {
            connection.stop().then(() => console.log("Connection stopped")).catch(err => console.error("Error stopping connection: ", err));
        };
    }, []);

    const clearNotification = async (id) => {
        try {
            const response = await fetch(`http://localhost:5226/api/Notification/mark-read/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'text/plain',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (response.ok) {
                setNotifications(notifications.filter((notification) => notification.id !== id));
            } else {
                console.error('Failed to mark notification as read:', response.statusText);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const clearAllNotifications = async () => {
        for (let notification of notifications) {
            await clearNotification(notification.id);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="relative">
            <div className="indicator">
                {notifications.length > 0 && (
                    <span className="indicator-item indicator-bottom indicator-right badge badge-secondary">
                        {notifications.length}
                    </span>
                )}
                <button tabIndex={0} className="btn" onClick={toggleDropdown}>
                    <NotificationIcon />
                </button>
            </div>
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
